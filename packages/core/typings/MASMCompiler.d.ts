import { CompilerFlags, CompilerOptions, CompilerOutput, Issue, Step } from "./types.js";
declare class MASMCompiler {
    private assembly;
    private input;
    private store;
    private output;
    private pc;
    private stack;
    private done;
    private branch;
    private program;
    private instructionCount;
    options: CompilerOptions;
    flags: CompilerFlags;
    issues: Issue[];
    constructor(assembly: string);
    step(): Step;
    init(text: string, options: CompilerOptions): void;
    compile(flags: CompilerFlags, source?: string): CompilerOutput;
    ADR(name: string): void;
}
export { MASMCompiler };
//# sourceMappingURL=MASMCompiler.d.ts.map