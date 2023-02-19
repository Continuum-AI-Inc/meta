import { Builder } from "./Builder.js";
import { parse } from "./parse.js";
import { Scanner } from "./Scanner.js";
var MASMCompiler = (function () {
    function MASMCompiler(assembly) {
        this.assembly = assembly;
        this.store = {};
        this.instructionCount = 0;
        this.flags = [];
        this.program = parse(this.assembly);
    }
    MASMCompiler.prototype.step = function () {
        if (this.done) {
            return;
        }
        var instr = this.program[this.pc];
        this[instr[0]](instr[1]);
    };
    MASMCompiler.prototype.init = function (text, options) {
        this.output = new Builder();
        this.pc = 0;
        this.store = {};
        this.stack = [];
        this.done = false;
        this.branch = false;
        this.input = new Scanner(text);
        this.instructionCount = 0;
        this.options = options;
    };
    MASMCompiler.prototype.compile = function (flags, source) {
        if (source === void 0) { source = ""; }
        var timeStarted = Number(process.hrtime.bigint()) / 1000000;
        this.flags = flags;
        while (this.step()) { }
        var performance = null;
        var totalInstructions = this.assembly.split("\n").length;
        if (this.flags.indexOf("p") > -1) {
            var timeEnded = Number(process.hrtime.bigint()) / 1000000;
            performance = {
                time: timeEnded - timeStarted,
                timeStarted: timeStarted,
                timeEnded: timeEnded,
                instructionCount: this.instructionCount,
                instructionPercentage: this.instructionCount / totalInstructions * 100
            };
        }
        return {
            output: this.output.text,
            metrics: {
                performance: performance
            }
        };
    };
    MASMCompiler.prototype.ADR = function (name) {
        this.stack[name] = {};
    };
    return MASMCompiler;
}());
export { MASMCompiler };
