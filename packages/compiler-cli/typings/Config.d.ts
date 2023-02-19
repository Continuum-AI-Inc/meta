import type { Config } from "./types";
declare function loadConfig(root?: string): Config | null;
declare const defaultConfig: {
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
        virtualMachine: string;
        useMetaCLS: boolean;
    };
    watch: boolean;
};
export { loadConfig, defaultConfig };
//# sourceMappingURL=Config.d.ts.map