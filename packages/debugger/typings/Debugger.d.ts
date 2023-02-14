import { MetaCompiler, Metadata } from "@metalang/core";
import type { Step } from "@metalang/core";
import { StackTree } from "./StackTree.js";
declare type DebugEvent = "breakpoint" | "step";
declare type DebugEventReturnValues = {
    "breakpoint": [
        {
            lineno: number;
            colno: number;
            pc: number;
            instruction: string[];
            metadata: Metadata;
        }
    ];
    "step": [
        {
            lineno: number;
            colno: number;
            pc: number;
            instruction: string[];
            metadata: Metadata;
        }
    ];
};
declare class Debugger {
    private assembly;
    private grammar;
    compiler: MetaCompiler;
    tree: StackTree;
    step: Step;
    private breakpoints;
    constructor(assembly: string, grammar: string);
    run(autoContinue?: boolean, disableBreakpoints?: boolean): Step;
    runUntil(predicate: (step: Step) => boolean): Step;
    next(disableBreakpoints?: boolean): Step;
    stepInto(): false | Step;
    addBreakpoint(line: number): void;
    removeBreakpoint(line: number): void;
    private emitter;
    on<Type extends DebugEvent>(event: Type, listener: (...args: DebugEventReturnValues[Type]) => any): void;
    off<Type extends DebugEvent>(event: Type, callback: (...args: DebugEventReturnValues[Type]) => void): void;
    private emit;
}
export { Debugger };
//# sourceMappingURL=Debugger.d.ts.map