import { Scanner } from "./Scanner.js";
import { Builder } from "./Builder.js";
import { parse } from "./parse.js";
import { error } from "./error-handler.js";
import { CompilerFlags, CompilerOptions, CompilerOutput, InstructionSet, Issue, Step } from "./types.js";
import * as fs from "fs";
import * as path from "path";

//
// The META II virtual machine runs compilers
// compiled with the META II grammar.
//
class MetaCompiler {
	private input: Scanner;
	private output: Builder;
	private pc: number;
	private stack: any[];
	private nextGN1: number;
	private nextGN2: number;
	private done: boolean;
	private branch: boolean;
	private program: {[key: string | number]: any}
	private source: string;
	private instructionCount: number = 0;
	private outputStack: string[] = [];
	private references: {[name: string]: string};
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
		
		if (this.options.debugMode) {
			console.log(instr);
		}
		

		if (!instr || instr.length == 0) {
			this.error(`Malformed instruction: ${instr}`);
		}

		if (!this[instr[0]]) {
			this.error(`Call to undefined Instruction: ${instr[0]}`)
		}

		this[instr[0]](instr[1]);
		this.instructionCount++;

		// If the current line is registered as a breakpoint,
		// stop execution and emit a "breakpoint" event.
		let lineno = this.input.getLine();
		let colno = this.input.getColumn();
		let isJumpInstruction = instr[0] == InstructionSet.JMP || instr[0] == InstructionSet.B || (instr[0] == InstructionSet.BF && !this.branch) || (instr[0] == InstructionSet.BT && this.branch);
		let isReturnInstruction = instr[0] == InstructionSet.RET;

		return { lineno, colno, pc: this.pc, instruction: instr, metadata: {
			isJumpInstruction,
			jumpAddressLabel: isJumpInstruction ? instr[1] : "",
			jumpAddress: isJumpInstruction ? this.program[instr[1]] : 0,
			isReturnInstruction
		} }
	}

	public init(content: string, options: CompilerOptions) {
		this.output = new Builder();
		this.pc = 0;
		this.stack = [];
		this.nextGN1 = 0;
		this.nextGN2 = 0;
		this.done = false;
		this.references = {};
		this.branch = false;
		this.input = new Scanner(content);
		this.instructionCount = 0;
		this.options = options;
	}

	public compile(source: string = ""): CompilerOutput {
		const timeStarted = Number(process.hrtime.bigint()) / 1000000;
		this.source = source;
		
		while(this.step()) {}

		let performance: CompilerOutput["metrics"]["performance"] = null;

		let totalInstructions = this.assembly.split("\n").length;

		if (this.options.performanceMetrics) {
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

	private error(message: string) {
		error(message, this.input.originalText, this.source, this.input.getLine(), this.input.getColumn());
	}

	// TEST
	// 
	// After deleting initial blanks in
	// the input string, compare it to
	// the string given as argument. If the
	// comparison is met, delete the
	// matched portion from the input and
	// set switch. If not met, reset
	// switch.
	public TST(string: string) {
		this.input.blanks();
		this.branch = this.input.match(string);
		this.pc++;
	}

	
	
	/**
	 * INIT
	 * Initializes a new variable from a given type.
	 * @date 2/18/2023 - 1:30:30 PM
	 *
	 * @public
	 * @param {string} type
	 */
	public INIT(type: string) {
		this.environment[this.lastAddress] = {
			"HASHMAP": {},
			"ARRAY": []
		}[type];
		this.pc++
	}
	private environment: {[key: string]: any} = {};
	private lastAddress: string;
	private usedVariable: string;

	
	/**
	 * VADR
	 * Variable Address.
	 * Sets the `lastAddress` to the value of the given variable name
	 * so that an initializer knows which variable to assign to.
	 * @date 2/18/2023 - 7:50:16 PM
	 *
	 * @public
	 * @param {string} name
	 */
	public VADR(name: string) {
		this.lastAddress = name;
		this.pc++;
	}

	
	/**
	 * CV
	 * Copy Variable.
	 * Copy's the contents of the given variable onto stdout
	 * @date 2/18/2023 - 7:49:51 PM
	 *
	 * @public
	 * @param {string} name
	 */
	public CV(name: string) {
		if (!this.environment.hasOwnProperty(name)) {
			this.error("Variable can not be referenced before its assignment: " + name);
		}
		this.output.copy(this.environment[name]);
		this.pc++;
	}

	
	/**
	 * LDV
	 * Load Variable.
	 * Will load a variable name into the `variable` flag
	 * so that it can be used later on.
	 * @date 2/18/2023 - 7:49:07 PM
	 *
	 * @public
	 * @param {string} name
	 */
	public LDV(name: string) {
		if (!this.environment.hasOwnProperty(name)) {
			this.error("Variable can not be referenced before its assignment: " + name);
		}
		this.usedVariable = name;
		this.pc++;
	}


	
	/**
	 * IN
	 * Checks whether the last match already exists
	 * in a given variable.
	 * If it does exist, the branch flag will be set to true.
	 * @date 2/18/2023 - 7:48:28 PM
	 *
	 * @public
	 */
	public IN() {
		let name = this.input.lastMatch;
		if (!name || !this.environment.hasOwnProperty(this.usedVariable)) {
			this.error("Reference to non existing variable: " + name);
		}
		

		// CHeck if the property exists inside the variable.
		this.branch = this.environment[this.usedVariable].hasOwnProperty([name]);
		this.pc++;
	}

	
	/**
	 * PUSH
	 * Pushes the last match into a variable.
	 * Depending on the type of variable, the method
	 * for pushing will be different.
	 * @date 2/18/2023 - 7:47:47 PM
	 *
	 * @public
	 */
	public PUSH() {
		this.environment[this.usedVariable][this.input.lastMatch] = true;
		this.branch = true;
		this.pc++
	}

	/**
	 * GROUP
	 * 
	 * Useful when matching a RegExp containing Groups.
	 * Can be used with a modifier (#1, #2 etc.) to retrieve
	 * a specific group.
	 */
	public GROUP(num: number) {
		if (num >= this.input.matches.length) {
			this.error(`Trying to access match on invalid offset: ${num}`);
		}

		this.output.copy(this.input.matches[num]);
		this.pc++;
	}

	public OUTMOV(str: string) {
		this.outputStack.push(str);
		this.pc++;
	}

	public CIOUT() {
		this.outputStack.push(this.input.lastMatch);
		this.pc++
	}

	public CO() {
		this.output.copy(this.outputStack.join(""));
		this.outputStack = [];
		this.pc++;
	}

	/**
	 * REGEXP
	 * 
	 * After deleting initial blanks in
	 * the input string, test if the passed
	 * Regular Expression is valid by using
	 * JavaScripts builtin RegExp constructor.
	 * If it is, match the input with the
	 * newly constructed RegExp to set the
	 * branch flag.
	 * 
	 * Otherwise throw an error that the
	 * received RegExp was invalid.
	 */
	public REGEXP(string: string) {
		this.input.blanks();

		// Check if the RegExp is valid.
		try {
			let regexp = new RegExp(string);
			this.branch = this.input.match(regexp);
		} catch(e) {
			this.error(`Invalid Regular Expression: ${string}`);
		}
		this.pc++;
	}

	// IDENTIFIER
	// 
	// After deleting initial blanks in
	// the input string, test if it begins
	// with an identifier, ie., a letter
	// followed by a sequence of letters
	// and/or digits. If so, delete the
	// identifier and set switch. If not,
	// reset switch.
	public ID() {
		this.input.blanks();
		this.branch = this.input.match(/^[_a-zA-Z][$_a-zA-Z0-9]*/);
		this.pc++;
	}

	// NUMBER
	//
	// After deleting initial blanks in
	// the input string, test if it begins
	// with a number. A number is a
	// string of digits wich may contain
	// imbeded periods, but may not begin
	// or end with a period. Moreover, no
	// two periods may be next to one
	// another. If a number is found,
	// delete it and set switch. If not,
	// reset switch.
	public NUM() {
		this.input.blanks();
		this.branch = this.input.match(/^-?[0-9]+([,.][0-9]+)*/);
		this.pc++;
	}

	// ROL
	//
	// Match the entirety of the following characters up until
	// a newline character.
	public ROL() {
		this.branch = this.input.match(/^.*?(?:\n|\r\n)/);
		this.pc++;
	}

	// NOT
	//
	// Match the entirety of the following characters up until
	// we hit a character that is excluded.
	public NOT(exclude: string) {
		// Replace any characters that have specific meaning inside a regex
		exclude = exclude.replace(/[.*+?^${}()|[\]\\\/]/g, '\\$&')
		this.branch = this.input.match(new RegExp(`[^${exclude}]*`));
		this.pc++;
	}

	// STRING
	//
	// After deleting initial blanks in
	// the input string, test if it begins
	// with a string, ie., a single quote,
	// followed by a sequence of any
	// characters other than single quote
	// followed by another single quote.
	// If a string is found, delete it an
	// set switch. If not, reset switch.
	public SR() {
		this.input.blanks();
		this.branch = this.input.match(/^["][^"]*["]/);
		this.pc++;
	}

	// JUMP
	// 
	// Enter the subroutine beginning in
	// location aaa. Push the stack down 
	// by three cells. The third cell
	// contains the return address.
	// Clear the top two cells to
	// blanks to indicate that they can
	// accept addresses which may be
	// generated within the subroutine.
	public JMP(aaa: string) {
		this.stack.push(this.pc + 1);
		this.stack.push(null);
		this.stack.push(null);
		this.pc = this.program[aaa];
	}

	// RETURN
	//
	// Return to the exit address, popping
	// up the stack by three cells.
	public R() {
		if (this.stack.length === 0) {
			this.END();
		}
		this.stack.pop();
		this.stack.pop();
		this.pc = this.stack.pop();
	}

	// SET
	//
	// Set branch switch on.
	public SET() {
		this.branch = true;
		this.pc++;
	}

	// BRANCH
	//
	// Branch unconditionally to location
	// aaa.
	public B(aaa: string) {
		this.pc = this.program[aaa];
	}

	// BRANCH IF TRUE
	//
	// Branch to location aaa, if switch is
	// on. Otherwise, continue in sequence.
	public BT(aaa: string) {
		if (this.branch) {
			this.pc = this.program[aaa];
		} else {
			this.pc++;
		}
	}

	// BRANCH IF FALSE
	//
	// Branch to location aaa, is switch
	// is off. Otherwise, continue in
	// sequence.
	public BF(aaa: string) {
		if (!this.branch) {
			this.pc = this.program[aaa];
		} else {
			this.pc++;
		}
	}

	// BRANCH TO ERROR IF FALSE
	//
	// Halt if switch is off. Otherwise,
	// continue in sequence.
	public BE() {
		if (!this.branch) {
			this.error("BRANCH ERROR Executed - Something is Wrong!");
		}
		this.pc++;
	}

	/**
	 * Halt the compiler, throw an error and exit.
	 */
	public ERR(message: string) {
		this.error(message);
	}

	/**
	 * Add a warning to the list of issues, this will NOT cause the compiler to exit.
	 */
	public WARN(message: string) {
		this.issues.push({message, pc: this.pc, lineno: this.input.getLine(), colno: this.input.getColumn() });
	}

	// COPY LITERAL
	//
	// Output the variable length string
	// given as the argument. A blank
	// character will be inserted in the
	// output following the string.
	public CL(string: string) {
		this.output.copy(string + ' ');
		this.pc++;
	}

	// COPY INPUT
	//
	// Output the last sequence of char-
	// acters deleted from the input
	// string. This command may not func-
	// tion properly if the last command
	// which could cause deletion failed
	// to do so.
	public CI() {
		this.output.copy(this.input.lastMatch);
		this.pc++;
	}

	// GENERATE 1
	//
	// This concerns the current label 1
	// cell, ie. the next to top cell in
	// the stack, which is either clear or
	// contains a generated label. If
	// clear, generate a label and put it
	// into that cell. Wether the label
	// has just been put into the cell or
	// was already there, output it.
	// Finally, insert a blank character
	// in the output following the label.
	public GN1() {
		var gn2 = this.stack.pop();
		var gn1 = this.stack.pop();
		if (gn1 === null) {
			gn1 = this.nextGN1++;
		}
		this.stack.push(gn1);
		this.stack.push(gn2);
		this.output.copy('A' + gn1 + ' ');
		this.pc++;
	}

	// GENERATE 2
	//
	// Same as GN1, except that it con-
	// cerns the current label 2 cell,
	// ie., the top cell in the stack.
	public GN2() {
		var gn2 = this.stack.pop();
		if (gn2 === null) {
			gn2 = this.nextGN2++;
		}
		this.stack.push(gn2);
		this.output.copy('B' + gn2 + ' ');
		this.pc++;
	}

	// LABEL
	//
	// Set the output counter to card
	// column 1.
	public LB() {
		this.output.label();
		this.pc++;
	}

	// OUTPUT
	//
	// Punch card and reset output counter
	// to card column 8.
	public OUT() {
		this.output.newLine();
		this.pc++;
	}

	// ADDRESS
	//
	// Produces the address which is
	// assigned to the given identifier
	// as a constant.
	public ADR(ident: string) {
		this.pc = this.program[ident];
	}

	// END
	//
	// Denotes the end of the program.
	public END() {
		this.done = true;
	}
};

export { MetaCompiler }