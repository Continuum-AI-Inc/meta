var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { MetaCompiler } from "@metalang/core";
import { StackTree } from "./StackTree.js";
import { EventEmitter } from "events";
var Debugger = (function () {
    function Debugger(assembly, grammar) {
        this.assembly = assembly;
        this.grammar = grammar;
        this.tree = new StackTree();
        this.breakpoints = new Set();
        this.emitter = new EventEmitter();
        this.compiler = new MetaCompiler(this.assembly);
        this.compiler.init(this.grammar);
    }
    Debugger.prototype.run = function (autoContinue, disableBreakpoints) {
        if (autoContinue === void 0) { autoContinue = true; }
        if (disableBreakpoints === void 0) { disableBreakpoints = false; }
        var _a = this.step = this.compiler.step(), lineno = _a.lineno, colno = _a.colno, pc = _a.pc, instruction = _a.instruction, metadata = _a.metadata;
        this.tree.push(instruction[0], [instruction[1]], lineno);
        this.emit("step", { lineno: lineno, colno: colno, pc: pc, instruction: instruction, metadata: metadata });
        if (this.breakpoints.has(lineno) && !disableBreakpoints) {
            this.emit("breakpoint", { lineno: lineno, colno: colno, pc: pc, instruction: instruction, metadata: metadata });
            return this.step;
        }
        if (autoContinue) {
            return this.run();
        }
        return this.step;
    };
    Debugger.prototype.runUntil = function (predicate) {
        while (this.run(false, true) && predicate(this.step)) { }
        return this.step;
    };
    Debugger.prototype.next = function (disableBreakpoints) {
        if (disableBreakpoints === void 0) { disableBreakpoints = true; }
        return this.run(false, disableBreakpoints);
    };
    Debugger.prototype.stepInto = function () {
        if (!this.step.metadata.isJumpInstruction) {
            return false;
        }
        return this.next();
    };
    Debugger.prototype.addBreakpoint = function (line) {
        this.breakpoints.add(line);
    };
    Debugger.prototype.removeBreakpoint = function (line) {
        this.breakpoints["delete"](line);
    };
    Debugger.prototype.on = function (event, listener) {
        this.emitter.on(event, listener);
    };
    Debugger.prototype.off = function (event, callback) {
        this.emitter.off(event, callback);
    };
    Debugger.prototype.emit = function (event) {
        var _a;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        (_a = this.emitter).emit.apply(_a, __spreadArray([event], args, false));
    };
    return Debugger;
}());
;
export { Debugger };
