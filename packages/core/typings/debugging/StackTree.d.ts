import { StackFrame } from "./StackFrame.js";
declare class StackTree {
    root: StackFrame | null;
    current: StackFrame | null;
    push(name: string, args: any[], line: number): void;
    pop(): void;
    toArray(): any[];
}
export { StackTree };
//# sourceMappingURL=StackTree.d.ts.map