import { MetaCompiler, METALANG } from "@metalang/core";
import { loadConfig } from "../Config.js";
import * as fs from "fs";
import * as path from "path";
function Compile(args) {
    var workingDir = process.cwd();
    var output = args.output, binary = args.binary, mls = args.mls, grammar = args.grammar, debug = args.debug;
    var config = loadConfig(process.cwd());
    var entry;
    if (config) {
        entry = config.compilerOptions.entry;
    }
    else {
        entry = args.default && args.default[0];
    }
    if (!entry || !fs.existsSync(entry)) {
        throw new Error("Entry is not defined or doesn't exist.");
    }
    var entryContent = fs.readFileSync(entry, "utf-8");
    var grammarContent = METALANG;
    if (grammar !== "default") {
        if (!fs.existsSync(grammar)) {
            throw new Error("Trying to load invalid grammar file: " + grammar);
        }
        grammarContent = fs.readFileSync(grammar, "utf-8");
    }
    process.chdir(path.dirname(entry));
    var debugMode = debug || (config && config.compilerOptions.debugMode);
    var compiler = new MetaCompiler(grammarContent);
    compiler.init(entryContent, {
        debugMode: debugMode
    });
    var compilerOutput = compiler.compile(entry);
    var outputFile = output;
    if (!output) {
        if (config && config.compilerOptions.outDir) {
            outputFile = path.join(workingDir, config.compilerOptions.outDir, path.basename(entry) + ".masm");
        }
        else {
            outputFile = path.join(workingDir, path.basename(entry) + ".masm");
        }
    }
    if (fs.existsSync(outputFile)) {
        throw new Error("Trying to overwrite already existing file: " + outputFile);
    }
    fs.writeFileSync(outputFile, compilerOutput.output, "utf-8");
}
export { Compile };
