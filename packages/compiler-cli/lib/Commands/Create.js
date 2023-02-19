import * as fs from "fs";
import * as path from "path";
import inquirer from "inquirer";
import { exec } from "child_process";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { PrettyConsole } from "../Console.js";
var __dirname = dirname(fileURLToPath(import.meta.url));
var console = new PrettyConsole();
console.closeByNewLine = true;
console.useIcons = true;
function Create(args) {
    if (!args.default || !args.default[0]) {
        throw new Error("No name was specified.");
    }
    var name = args.default[0];
    var folder = path.join(process.cwd(), name);
    if (fs.existsSync(folder)) {
        throw new Error("Folder already exists: " + name);
    }
    inquirer.prompt([
        {
            name: "repo",
            default: "N",
            choices: ["y", "N"],
            message: "Do you want to create a GIT Repository? (y/N)"
        }, {
            name: "bare",
            default: "N",
            choices: ["y", "N"],
            message: "Do you want a bare bones project? (y/N)"
        }
    ]).then(function (answers) {
        var repo = answers.repo, bare = answers.bare;
        fs.mkdirSync(folder);
        process.chdir(folder);
        if (repo.toLowerCase() == "y") {
            exec("git init");
        }
        fs.mkdirSync("./docs");
        fs.mkdirSync("./grammar");
        fs.mkdirSync("./bin");
        fs.mkdirSync("./tests");
        var config = {
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
        fs.writeFileSync("./meta.config.json", JSON.stringify(config, null, 4));
        if (bare.toLowerCase() == "n") {
            var grammar = fs.readFileSync(path.join(__dirname, "../../static/template.main.grammar.meta"));
            var math = fs.readFileSync(path.join(__dirname, "../../static/template.math.grammar.meta"));
            var test = fs.readFileSync(path.join(__dirname, "../../static/template.main.test.meta"));
            fs.writeFileSync("./grammar/main.grammar.meta", grammar);
            fs.writeFileSync("./grammar/math.grammar.meta", math);
            fs.writeFileSync("./tests/main.test.meta", test);
        }
        var readme = fs.readFileSync(path.join(__dirname, "../../static/template.readme.md"));
        fs.writeFileSync("./README.md", readme);
        console.success("You're all set up!", "cd " + name, "metalang compile");
    });
}
export { Create };
