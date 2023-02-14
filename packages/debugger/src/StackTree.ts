import { StackFrame } from "./StackFrame.js";

class StackTree {
	public root: StackFrame | null = null;
	public current: StackFrame | null = null;

	push(name: string, args: any[] = [], line: number) {
		const frame = new StackFrame(name, args, line, this.current);
		if (!this.root) {
			this.root = frame;
		}
		this.current = frame;
	}

	pop() {
		if (this.current === this.root) {
			this.root = null;
		}
		this.current = this.current.parent;
	}

	toArray() {
		const result = [];
		let current = this.current;
		while (current) {
			result.push(current);
			current = current.parent;
		}
		return result.reverse();
	}
}

export { StackTree }