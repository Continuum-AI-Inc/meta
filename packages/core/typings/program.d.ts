declare const parse: (text: string) => Instruction[];
declare class Builder {
    text: string;
    copy(string: string): void;
    label(): void;
    newLine(): void;
    getProgram(): Instruction[];
}
export { Builder, parse };
//# sourceMappingURL=program.d.ts.map