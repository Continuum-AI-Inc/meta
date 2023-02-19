import * as fs from "fs";
import * as path from "path";
import { colarg } from "colarg";
import inquirer from "inquirer";
import { exec } from "child_process";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { PrettyConsole } from "../Console.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const console = new PrettyConsole();
console.closeByNewLine = true;
console.useIcons = true;

function Create(args: typeof colarg.arguments) {
	// Check if the name was given.
	if (!args.default || !args.default[0]) {
		throw new Error("No name was specified.");
	}
	// The name is the first non keyword argument.
	const name = args.default[0];

	// Check if the folder already exists.
	const folder = path.join(process.cwd(), name);
	if (fs.existsSync(folder)) {
		throw new Error("Folder already exists: " + name);
	}

	/**
	 * Create the default directory structure
	 * /
	 * -> docs
	 * -> grammar
	 * 	--> main.grammar.meta
	 *  --> aexp.grammar.meta
	 * -> bin
	 * -> tests
	 * 	--> main.test.txt
	 * -> meta.config.json 
	 * -> README.md
	 */
	// We need to ask the user whether he wants to initialize a git repo
	inquirer.prompt([
		{
			name: "repo",
			default: "N",
			choices: ["y", "N"],
			message: "Do you want to create a GIT Repository? (y/N)"
		},{
			name: "bare",
			default: "N",
			choices: ["y", "N"],
			message: "Do you want a bare bones project? (y/N)"
		}
	]).then(answers => {
		let { repo, bare } = answers;

		// Create the folder
		fs.mkdirSync(folder);
		// Navigate into the folder.
		process.chdir(folder);

		if (repo.toLowerCase() == "y") {
			// Create a git repo
			exec("git init");
		}

		// Create the docs, grammar, bin and tests folder.
		fs.mkdirSync("./docs");
		fs.mkdirSync("./grammar");
		fs.mkdirSync("./bin");
		fs.mkdirSync("./tests");

		// Create the config file.
		const config = {
			"compilerOptions": {
				"debugMode": false,
				"performanceMetrics": true,
				"outDir": "bin/",
				"entry": "grammar/main.grammar.meta"
			},
			"testingOptions": {
				// This will cause the compiler to output additional debugging information which can be read and interpreted by a debugger.
				"debugMode": false,
				// Whether or not to enable performance metrics, these will tell you about the execution speed of your compiler.
				"performanceMetrics": true,
				// Whether or not to collect code coverage metrics, this will tell you how effective your tests are.
				"coverageMetrics": true,
				// Whether or not to enable compiler optimizations, will result in faster execution but unreadable code.
				"enableOptimizations": false,
				// This will specify the location of a metrics.json file which can be read by our testing application.
				"metricsOutput": "tests/metrics.json",
				"benchmarkOutput": "docs/benchmark.md",
				// Which virtual machine to use when running a test, can either be an NPM package or a URL to a script.
				"virtualMachine": "@metalang/cls-vm",
				// Whether or not to use the Meta Common Language Specification, if this is `false` the virtual machine must be supplied through a URL.
				"useMetaCLS": true
			},
			"watch": true
		}

		// Create the config
		fs.writeFileSync("./meta.config.json", JSON.stringify(config, null, 4));

		// Check if the user wants content.
		if (bare.toLowerCase() == "n") {
			// Create the main.grammar.meta and the test file.
			const grammar = fs.readFileSync(path.join(__dirname, "../../static/template.main.grammar.meta"));
			const math = fs.readFileSync(path.join(__dirname, "../../static/template.math.grammar.meta"));
			const test = fs.readFileSync(path.join(__dirname, "../../static/template.main.test.meta"));

			fs.writeFileSync("./grammar/main.grammar.meta", grammar);
			fs.writeFileSync("./grammar/math.grammar.meta", math);
			fs.writeFileSync("./tests/main.test.meta", test);
		}

		// The readme is always included in the project.
		const readme = fs.readFileSync(path.join(__dirname, "../../static/template.readme.md"));
		fs.writeFileSync("./README.md", readme);

		// Now print a success message
		console.success("You're all set up!", "cd " + name, "metalang compile");
	})
}

export { Create }