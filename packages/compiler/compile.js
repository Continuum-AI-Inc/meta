import * as fs from "fs";
import * as path from "path";
import { MetaCompiler } from "./lib/index.js";

if (process.argv.length < 3) {
	console.log('Usage: node compile.js <compiler assembly code>');
	process.exit(1);
}

const dir = "./test/input/grammar";
const grammarFiles = fs.readdirSync(dir);
const assembly = fs.readFileSync(process.argv[2], "utf-8");
const compiler = new MetaCompiler(assembly);

for (const grammarFile of grammarFiles) {
	console.clear();
	console.log("Starting Compilation: " + grammarFile)
	let name = path.basename(grammarFile, path.extname(grammarFile));
	const grammar = fs.readFileSync(path.join(dir, grammarFile), "utf-8");
	compiler.init(grammar);
	const {output: compiledGrammar, metrics } = compiler.compile(["p"], grammarFile);

	console.log(metrics);
	process.exit()

	// Now compile the code
	// Check if it exists first.
	if (!compiledGrammar) {
		console.log("Failed compiling grammar: " + grammarFile);
		process.exit(1);
	}

	fs.writeFileSync(path.join("./test/output/", name + ".o"), compiledGrammar);

	console.log("Compiled Grammar successfully: " + grammarFile)

	const codeFile = path.join("./test/input/code", name);

	if (!fs.existsSync(codeFile)) {
		console.log("Missing Code File - Continuing");
		continue;
	}

	const grammarCompiler = new MetaCompiler(compiledGrammar);
	const code = fs.readFileSync(codeFile, "utf-8");
	grammarCompiler.init(code);
	const { output } = grammarCompiler.compile([], codeFile);
	
	fs.writeFileSync(path.join("./test/results/", name + ".o"), output);

	console.log("Compiled code successfully!");
}