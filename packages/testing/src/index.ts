import { MetaCompiler, METALANG } from "@metalang/core";
import type { TestingOptions } from "./types";
import * as fs from "fs";
import * as path from "path";
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

class MetaTester {
	private compiler: MetaCompiler;

	constructor(public options: TestingOptions = {}) {
		// Check if a compiler option was passed as an option
		if (options.useCompiler) {
			// Check if the file exists.
			if (!fs.existsSync(options.useCompiler)) {
				throw new Error("Trying to load invalid compiler, file does not exist: " + options.useCompiler)
			}
			// Load the compiler
			let compilerCode = fs.readFileSync(options.useCompiler, "utf-8");
			this.compiler = new MetaCompiler(compilerCode);
		} else {
			// Load the default metalang compiler
			this.compiler = new MetaCompiler(METALANG);
		}
	}

	public run(code: string) {
		// We first need to compile the code that was passed.
		// We instantiate a new Compiler class and use the default testing Compiler
		// for executing it.
		const testFileCompiler = fs.readFileSync(path.join(__dirname, "../bootstrap/meta-test.test.o"), "utf-8");
		let compiler = new MetaCompiler(testFileCompiler);
		compiler.init(code, {
			debugMode: this.options.debugMode,
			performanceMetrics: this.options.performanceMetrics
		});

		console.log(compiler.compile());
	}
}

const test = `%use "main.grammar.meta";
%flag "debug" off;
%flag "performance" off;
%code {

a = 5;
b = a * 19;
c = (a + b) / (-10^2);

}

// Check if the variables are all correctly set.
// This will only work if the metalang-test can hook
// into the program.
// The option to do that is only available if the output
// is configured to use 'META-LS'.
%assert c == -1;
%assert b == 95;
%assert a == 5;

// Compare the output to the expected output.
%compare {

}`

const tester = new MetaTester({
	useCompiler: path.join(__dirname, "../bootstrap/lang.masm")
});


tester.run(test);
