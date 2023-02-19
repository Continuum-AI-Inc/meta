import * as path from "path";
import * as fs from "fs";
function loadConfig(root) {
    if (root === void 0) { root = process.cwd(); }
    var configPath = path.join(root, "meta.config.json");
    if (!fs.existsSync(configPath)) {
        return null;
    }
    var config = fs.readFileSync(configPath, "utf-8");
    return JSON.parse(config);
}
var defaultConfig = {
    "compilerOptions": {
        "debugMode": false,
        "performanceMetrics": true,
        "outDir": "bin/",
        "entry": "grammar/main.grammar.meta"
    },
    "testingOptions": {
        "debugMode": false,
        "performanceMetrics": true,
        "coverageMetrics": true,
        "enableOptimizations": false,
        "metricsOutput": "tests/metrics.json",
        "benchmarkOutput": "docs/benchmark.md",
        "virtualMachine": "@metalang/cls-vm",
        "useMetaCLS": true
    },
    "watch": true
};
export { loadConfig, defaultConfig };
