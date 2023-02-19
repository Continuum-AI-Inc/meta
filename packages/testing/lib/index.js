import { MetaCompiler, METALANG } from "@metalang/core";
import * as fs from "fs";
import * as path from "path";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
var __dirname = dirname(fileURLToPath(import.meta.url));
var MetaTester = (function () {
    function MetaTester(options) {
        if (options === void 0) { options = {}; }
        this.options = options;
        if (options.useCompiler) {
            if (!fs.existsSync(options.useCompiler)) {
                throw new Error("Trying to load invalid compiler, file does not exist: " + options.useCompiler);
            }
            var compilerCode = fs.readFileSync(options.useCompiler, "utf-8");
            this.compiler = new MetaCompiler(compilerCode);
        }
        else {
            this.compiler = new MetaCompiler(METALANG);
        }
    }
    MetaTester.prototype.run = function (code) {
        var testFileCompiler = fs.readFileSync(path.join(__dirname, "../bootstrap/meta-test.test.o"), "utf-8");
        var compiler = new MetaCompiler(testFileCompiler);
        compiler.init(code, {
            debugMode: this.options.debugMode,
            performanceMetrics: this.options.performanceMetrics
        });
        console.log(compiler.compile());
    };
    return MetaTester;
}());
var test = "%use \"main.grammar.meta\";\n%flag \"debug\" off;\n%flag \"performance\" off;\n%code {\n\na = 5;\nb = a * 19;\nc = (a + b) / (-10^2);\n\n}\n\n// Check if the variables are all correctly set.\n// This will only work if the metalang-test can hook\n// into the program.\n// The option to do that is only available if the output\n// is configured to use 'META-LS'.\n%assert c == -1;\n%assert b == 95;\n%assert a == 5;\n\n// Compare the output to the expected output.\n%compare {\n\n}";
var tester = new MetaTester({
    useCompiler: path.join(__dirname, "../bootstrap/lang.masm")
});
tester.run(test);
