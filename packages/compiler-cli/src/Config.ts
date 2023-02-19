import * as path from "path";
import * as fs from "fs";
import type { Config } from "./types";

/**
 * Load a meta.config.json file from the current working directory.
 * Will return `null` if none could be found.
 * @date 2/18/2023 - 9:57:21 PM
 */
function loadConfig(root: string = process.cwd()): Config | null {
	const configPath = path.join(root, "meta.config.json");

	// Check if the config file exists.
	if (!fs.existsSync(configPath)) {
		return null;
	}

	// Load the config file using JSON.parse and return it.
	let config = fs.readFileSync(configPath, "utf-8");
	return JSON.parse(config);
}

const defaultConfig = {
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
};

export { loadConfig, defaultConfig }