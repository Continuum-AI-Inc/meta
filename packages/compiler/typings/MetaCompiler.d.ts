interface Step {
    lineno: number;
    colno: number;
    pc: number;
    instruction: Instruction;
    metadata: Metadata;
}
interface Metadata {
    isJumpInstruction: boolean;
    jumpAddress: number;
    jumpAddressLabel: string;
    isReturnInstruction: boolean;
}
declare enum InstructionSet {
    JMP = "JMP",
    RET = "R",
    BF = "BF",
    BT = "BT",
    B = "B"
}
interface Issue {
    message: string;
    pc: number;
    lineno: number;
    colno: number;
}
declare type CompilerFlags = ("p" | "d")[];
interface CompilerOutput {
    output: string;
    metrics: {
        performance?: {
            instructionCount: number;
            instructionPercentage: number;
            time: number;
            timeStarted: number;
            timeEnded: number;
        };
    };
}
declare class MetaCompiler {
    private assembly;
    private input;
    private output;
    private pc;
    private stack;
    private nextGN1;
    private nextGN2;
    private done;
    private branch;
    private program;
    private source;
    private instructionCount;
    flags: CompilerFlags;
    issues: Issue[];
    constructor(assembly: string);
    step(): Step;
    init(text: string): void;
    compile(flags: CompilerFlags, source?: string): CompilerOutput;
    private error;
    TST(string: string): void;
    GROUP(num: number): void;
    REGEXP(string: string): void;
    ID(): void;
    NUM(): void;
    ROL(): void;
    NOT(exclude: string): void;
    SR(): void;
    JMP(aaa: string): void;
    R(): void;
    SET(): void;
    B(aaa: string): void;
    BT(aaa: string): void;
    BF(aaa: string): void;
    BE(): void;
    ERR(message: string): void;
    WARN(message: string): void;
    CL(string: string): void;
    CI(): void;
    GN1(): void;
    GN2(): void;
    LB(): void;
    OUT(): void;
    ADR(ident: string): void;
    END(): void;
}
export { MetaCompiler };
export type { Step, Metadata, InstructionSet };
//# sourceMappingURL=MetaCompiler.d.ts.map