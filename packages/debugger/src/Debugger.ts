import { MetaCompiler, Metadata } from "@metalang/core";
import type { Step } from "@metalang/core";
import { StackTree } from "./StackTree.js";
import { EventEmitter } from "events";

type DebugEvent = "breakpoint" | "step";

type DebugEventReturnValues = {
	"breakpoint": [{
		lineno: number,
		colno: number,
		pc: number,
		instruction: string[],
		metadata: Metadata
	}],
	"step": [{
		lineno: number,
		colno: number,
		pc: number,
		instruction: string[],
		metadata: Metadata
	}],
}

//
// The META II virtual machine runs compilers
// compiled with the META II grammar.
//
class Debugger {
	public compiler: MetaCompiler;
	public tree: StackTree = new StackTree();
	public step: Step;
	private breakpoints: Set<number> = new Set();

	constructor(private assembly: string, private grammar: string) {
		this.compiler = new MetaCompiler(this.assembly)
		// Reset the compiler state and bind the input grammar to it.
		// We can't call the `compile` method since it would run the `step`
		// function automatically.
		this.compiler.init(this.grammar)
	}

	public run(autoContinue: boolean = true, disableBreakpoints: boolean = false): Step {
		let { lineno, colno, pc, instruction, metadata } = this.step = this.compiler.step()

		this.tree.push(instruction[0], [instruction[1]], lineno);

		// Emit a step event
		this.emit("step", { lineno, colno, pc, instruction, metadata })

		// Check if the current line is registered as a breakpoint.
		if (this.breakpoints.has(lineno) && !disableBreakpoints) {
			this.emit("breakpoint", { lineno, colno, pc, instruction, metadata });
			return this.step;
		}

		// Continue running one step at a time.
		// If the autoContinue flag is set to false
		// we will need to return and wait
		// for the next run command
		if (autoContinue) {
			return this.run();
		}

		return this.step;
	}

	
	/**
	 * Run until the predicate is `false`, the result will be returned.
	 * @date 2/13/2023 - 10:52:30 PM
	 *
	 * @public
	 * @param {(step: Step) => boolean} predicate
	 * @returns {Step}
	 */
	public runUntil(predicate: (step: Step) => boolean): Step {
		// Just keep it running until predicate is false
		// then the while loop will exit
		// and we can simply return `step`
		while(this.run(false, true) && predicate(this.step)) {}

		return this.step;
	}

	
	/**
	 * Run the next instruction then return the result for further inspection.
	 * @date 2/13/2023 - 10:56:22 PM
	 *
	 * @param {boolean} disableBreakpoints This will disable any calls to breakpoint listeners
	 * @public
	 * @returns {Step}
	 */
	public next(disableBreakpoints: boolean = true): Step {
		return this.run(false, disableBreakpoints);
	}

	public stepInto() {
		// If the current step is not a jump instruction
		// then there is nothing to step into
		// we just return false
		if (!this.step.metadata.isJumpInstruction) {
			return false;
		}

		// Otherwise we want to run until we hit a return instruction
		// or another jump instruction.
		return this.next();
	}

	public addBreakpoint(line: number) {
		this.breakpoints.add(line);
	}

	public removeBreakpoint(line: number) {
		this.breakpoints.delete(line);
	}

	private emitter: EventEmitter = new EventEmitter();
	public on<Type extends DebugEvent>(event: Type, listener: (...args: DebugEventReturnValues[Type]) => any) {
		this.emitter.on(event, listener);
	}

	public off<Type extends DebugEvent>(event: Type, callback: (...args: DebugEventReturnValues[Type]) => void) {
		this.emitter.off(event, callback);
	}

	private emit<Type extends DebugEvent>(event: Type, ...args: DebugEventReturnValues[Type]) {
		this.emitter.emit(event, ...args);
	}
};

export { Debugger }