import { Scanner } from "./Scanner.js";
import { Builder } from "./Builder.js";
import { parse } from "./parse.js";
import { error } from "./error-handler.js";
var InstructionSet;
(function (InstructionSet) {
    InstructionSet["JMP"] = "JMP";
    InstructionSet["RET"] = "R";
    InstructionSet["BF"] = "BF";
    InstructionSet["BT"] = "BT";
    InstructionSet["B"] = "B";
})(InstructionSet || (InstructionSet = {}));
var MetaCompiler = (function () {
    function MetaCompiler(assembly) {
        this.assembly = assembly;
        this.instructionCount = 0;
        this.flags = [];
        this.program = parse(this.assembly);
    }
    MetaCompiler.prototype.step = function () {
        if (this.done) {
            return;
        }
        var instr = this.program[this.pc];
        if (!instr || instr.length == 0) {
            this.error("Malformed instruction: ".concat(instr));
        }
        if (!this[instr[0]]) {
            this.error("Call to undefined Instruction: ".concat(instr[0]));
        }
        this[instr[0]](instr[1]);
        this.instructionCount++;
        var lineno = this.input.getLine();
        var colno = this.input.getColumn();
        var isJumpInstruction = instr[0] == InstructionSet.JMP || instr[0] == InstructionSet.B || (instr[0] == InstructionSet.BF && !this.branch) || (instr[0] == InstructionSet.BT && this.branch);
        var isReturnInstruction = instr[0] == InstructionSet.RET;
        return { lineno: lineno, colno: colno, pc: this.pc, instruction: instr, metadata: {
                isJumpInstruction: isJumpInstruction,
                jumpAddressLabel: isJumpInstruction ? instr[1] : "",
                jumpAddress: isJumpInstruction ? this.program[instr[1]] : 0,
                isReturnInstruction: isReturnInstruction
            } };
    };
    MetaCompiler.prototype.init = function (text) {
        this.output = new Builder();
        this.pc = 0;
        this.stack = [];
        this.nextGN1 = 0;
        this.nextGN2 = 0;
        this.done = false;
        this.branch = false;
        this.input = new Scanner(text);
        this.instructionCount = 0;
    };
    MetaCompiler.prototype.compile = function (flags, source) {
        var _this = this;
        if (source === void 0) { source = ""; }
        var timeStarted = Number(process.hrtime.bigint()) / 1000000;
        this.source = source;
        this.flags = flags;
        var run = function () {
            if (_this.step()) {
                run();
            }
        };
        run();
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
    MetaCompiler.prototype.error = function (message) {
        error(message, this.input.originalText, this.source, this.input.getLine(), this.input.getColumn());
    };
    MetaCompiler.prototype.TST = function (string) {
        this.input.blanks();
        this.branch = this.input.match(string);
        this.pc++;
    };
    MetaCompiler.prototype.GROUP = function (num) {
        if (num >= this.input.matches.length) {
            this.error("Trying to access match on invalid offset: ".concat(num));
        }
        this.output.copy(this.input.matches[num]);
        this.pc++;
    };
    MetaCompiler.prototype.REGEXP = function (string) {
        this.input.blanks();
        try {
            var regexp = new RegExp(string);
            this.branch = this.input.match(regexp);
        }
        catch (e) {
            this.error("Invalid Regular Expression: ".concat(string));
        }
        this.pc++;
    };
    MetaCompiler.prototype.ID = function () {
        this.input.blanks();
        this.branch = this.input.match(/^[_a-zA-Z][$_a-zA-Z0-9]*/);
        this.pc++;
    };
    MetaCompiler.prototype.NUM = function () {
        this.input.blanks();
        this.branch = this.input.match(/^-?[0-9]+(,[0-9]+)*/);
        this.pc++;
    };
    MetaCompiler.prototype.ROL = function () {
        this.branch = this.input.match(/^.*?(?:\n|\r\n)/);
        this.pc++;
    };
    MetaCompiler.prototype.NOT = function (exclude) {
        exclude = exclude.replace(/[.*+?^${}()|[\]\\\/]/g, '\\$&');
        this.branch = this.input.match(new RegExp("[^".concat(exclude, "]*")));
        this.pc++;
    };
    MetaCompiler.prototype.SR = function () {
        this.input.blanks();
        this.branch = this.input.match(/^["][^"]*["]/);
        this.pc++;
    };
    MetaCompiler.prototype.JMP = function (aaa) {
        this.stack.push(this.pc + 1);
        this.stack.push(null);
        this.stack.push(null);
        this.pc = this.program[aaa];
    };
    MetaCompiler.prototype.R = function () {
        if (this.stack.length === 0) {
            this.END();
        }
        this.stack.pop();
        this.stack.pop();
        this.pc = this.stack.pop();
    };
    MetaCompiler.prototype.SET = function () {
        this.branch = true;
        this.pc++;
    };
    MetaCompiler.prototype.B = function (aaa) {
        this.pc = this.program[aaa];
    };
    MetaCompiler.prototype.BT = function (aaa) {
        if (this.branch) {
            this.pc = this.program[aaa];
        }
        else {
            this.pc++;
        }
    };
    MetaCompiler.prototype.BF = function (aaa) {
        if (!this.branch) {
            this.pc = this.program[aaa];
        }
        else {
            this.pc++;
        }
    };
    MetaCompiler.prototype.BE = function () {
        if (!this.branch) {
            this.error("BRANCH ERROR Executed - Something is Wrong!");
        }
        this.pc++;
    };
    MetaCompiler.prototype.ERR = function (message) {
        this.error(message);
    };
    MetaCompiler.prototype.WARN = function (message) {
        this.issues.push({ message: message, pc: this.pc, lineno: this.input.getLine(), colno: this.input.getColumn() });
    };
    MetaCompiler.prototype.CL = function (string) {
        this.output.copy(string + ' ');
        this.pc++;
    };
    MetaCompiler.prototype.CI = function () {
        this.output.copy(this.input.lastMatch);
        this.pc++;
    };
    MetaCompiler.prototype.GN1 = function () {
        var gn2 = this.stack.pop();
        var gn1 = this.stack.pop();
        if (gn1 === null) {
            gn1 = this.nextGN1++;
        }
        this.stack.push(gn1);
        this.stack.push(gn2);
        this.output.copy('A' + gn1 + ' ');
        this.pc++;
    };
    MetaCompiler.prototype.GN2 = function () {
        var gn2 = this.stack.pop();
        if (gn2 === null) {
            gn2 = this.nextGN2++;
        }
        this.stack.push(gn2);
        this.output.copy('B' + gn2 + ' ');
        this.pc++;
    };
    MetaCompiler.prototype.LB = function () {
        this.output.label();
        this.pc++;
    };
    MetaCompiler.prototype.OUT = function () {
        this.output.newLine();
        this.pc++;
    };
    MetaCompiler.prototype.ADR = function (ident) {
        this.pc = this.program[ident];
    };
    MetaCompiler.prototype.END = function () {
        this.done = true;
    };
    return MetaCompiler;
}());
;
export { MetaCompiler };
