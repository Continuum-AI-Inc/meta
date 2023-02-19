interface Config {
    compilerOptions: {
        debugMode: boolean;
        performanceMetrics: boolean;
        outDir: string;
        entry: string;
    };
    testingOptions: {
        debugMode: boolean;
        performanceMetrics: boolean;
        coverageMetrics: boolean;
        enableOptimizations: boolean;
        metricsOutput: string;
        benchmarkOutput: string;
        virtualMachine: "@metalang/cls-vm" | string;
        useMetaCLS: boolean;
    };
    watch: boolean;
}
export type { Config };
//# sourceMappingURL=types.d.ts.map