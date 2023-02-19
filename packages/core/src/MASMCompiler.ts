import { Builder } from "./Builder.js";
import { parse } from "./parse.js";
import { Scanner } from "./Scanner.js";
import { CompilerFlags, CompilerOptions, CompilerOutput, Issue, Step } from "./types.js";


/**
 * Meta-Assembly Compiler
 * @date 2/18/2023 - 11:43:17 AM
 *
 * @class MASMCompiler
 * @typedef {MASMCompiler}
 */
class MASMCompiler {
	private input: Scanner;
	/**
	 * This is where all the variables will be stored in between execution.
	 */
	private store: {[key: string] : any} = {};
	private output: Builder;
	private pc: number;
	private stack: any[];
	private done: boolean;
	private branch: boolean;
	private program: {[key: string | number]: any}
	private instructionCount: number = 0;
	public options: CompilerOptions;
	public flags: CompilerFlags = [];
	public issues: Issue[]

	constructor(private assembly: string) {
		this.program = parse(this.assembly)
	}

	public step(): Step {
		if (this.done) {
			return;
		}

		var instr = this.program[this.pc];

		this[instr[0]](instr[1]);
	}

	public init(text: string, options: CompilerOptions) {
		this.output = new Builder();
		this.pc = 0;
		this.store = {};
		this.stack = [];
		this.done = false;
		this.branch = false;
		this.input = new Scanner(text);
		this.instructionCount = 0;
		this.options = options;
	}

	public compile(flags: CompilerFlags, source: string = ""): CompilerOutput {
		const timeStarted = Number(process.hrtime.bigint()) / 1000000;
		this.flags = flags;
		
		while(this.step()) {}

		let performance: CompilerOutput["metrics"]["performance"] = null;

		let totalInstructions = this.assembly.split("\n").length;

		if (this.flags.indexOf("p") > -1) {
			let timeEnded = Number(process.hrtime.bigint()) / 1000000;
			// Include performance metrics.
			performance = {
				time: timeEnded - timeStarted,
				timeStarted: timeStarted,
				timeEnded: timeEnded,
				instructionCount: this.instructionCount,
				instructionPercentage: this.instructionCount / totalInstructions * 100
			}
		}



		return {
			output: this.output.text,
			metrics: {
				performance
			}
		};
	}

	public ADR(name: string) {
		this.stack[name] = {};
	}
}

export { MASMCompiler }