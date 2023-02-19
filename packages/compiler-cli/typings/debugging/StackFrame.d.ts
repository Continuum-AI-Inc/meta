declare class StackFrame {
    name: any;
    args: any[];
    parent: StackFrame | null;
    line: number;
    constructor(name: any, args: any[], line: number, parent: StackFrame | null);
}
export { StackFrame };
//# sourceMappingURL=StackFrame.d.ts.map