class StackFrame {
	public name: any;
	public args: any[];
	public parent: StackFrame | null;
	public line: number;

	constructor(name: any, args: any[], line: number, parent: StackFrame | null) {
		this.name = name;
		this.args = args;
		this.parent = parent;
		this.line = line;
	}
}

export { StackFrame }