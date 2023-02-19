interface Config {
	compilerOptions: {
		debugMode: boolean;
		performanceMetrics: boolean;
		outDir: string;
		entry: string;
	},
	testingOptions: {
		// This will cause the compiler to output additional debugging information which can be read and interpreted by a debugger.
		debugMode: boolean;
		// Whether or not to enable performance metrics, these will tell you about the execution speed of your compiler.
		performanceMetrics: boolean;
		// Whether or not to collect code coverage metrics, this will tell you how effective your tests are.
		coverageMetrics: boolean;
		// Whether or not to enable compiler optimizations, will result in faster execution but unreadable code.
		enableOptimizations: boolean;
		// This will specify the location of a metrics.json file which can be read by our testing application.
		metricsOutput: string;
		benchmarkOutput: string;
		// Which virtual machine to use when running a test, can either be an NPM package or a URL to a script.
		virtualMachine: "@metalang/cls-vm" | string,
		// Whether or not to use the Meta Common Language Specification, if this is `false` the virtual machine must be supplied through a URL.
		useMetaCLS: boolean;
	},
	watch: boolean;
}

export type { Config }