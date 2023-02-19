import { MetaCompiler, METALANG } from "@metalang/core";
import { loadConfig } from "../Config.js";
import * as fs from "fs";
import * as path from "path";

function Compile(args) {
	// Save the current working directory, in the case that we will
	// have to change it later on.
	const workingDir = process.cwd();
	// Get all possible options.
	let { output, binary, mls, grammar, debug } = args;
	// Try to find a config file in the current directory.
	const config = loadConfig(process.cwd());
	let entry: string;
	if (config) {
		entry = config.compilerOptions.entry;
	} else {
		// Get the entry point as first non-keyword argument passed to the call.
		entry = args.default && args.default[0];
	}

	// Check if the entry file is not null and exists.
	if (!entry || !fs.existsSync(entry)) {
		throw new Error("Entry is not defined or doesn't exist.");
	}

	// If the entry file exists, read it into memory.
	const entryContent = fs.readFileSync(entry, "utf-8");

	// Check if the grammar file for the compilation is the default one.
	var grammarContent = METALANG;
	if (grammar !== "default") {
		// Check if the file exists
		if (!fs.existsSync(grammar)) {
			throw new Error("Trying to load invalid grammar file: " + grammar);
		}
		grammarContent = fs.readFileSync(grammar, "utf-8");
	}

	// Every file operation is now relative to the location
	// of the entry file.
	// let's change the directory.
	process.chdir(path.dirname(entry));

	// Check if debugMode and other compiler options are enabled.
	// First check the options and then the config file.
	const debugMode = debug || (config && config.compilerOptions.debugMode);

	// Initialize the compiler.
	const compiler = new MetaCompiler(grammarContent)
	compiler.init(entryContent, {
		debugMode
	});
	// Compile the input file.
	const compilerOutput = compiler.compile(entry);

	// TODO: Implement outputting to binary.
	// TODO: Implement debug features using `METALS`

	// Check if the output file was specified explicitly.
	var outputFile = output;
	if (!output) {
		// Check if the config includes an output directory.
		if (config && config.compilerOptions.outDir) {
			outputFile = path.join(workingDir, config.compilerOptions.outDir, path.basename(entry) + ".masm")
		} else {
			// Just use the input file name, add a `.masm` extension and call it a day...
			outputFile = path.join(workingDir, path.basename(entry) + ".masm");
		}
	}

	// Check if the output file already exists.
	if (fs.existsSync(outputFile)) {
		throw new Error("Trying to overwrite already existing file: " + outputFile)
	}
	// Write the compiler output to the output file.
	
	fs.writeFileSync(outputFile, compilerOutput.output, "utf-8");
}

export { Compile }