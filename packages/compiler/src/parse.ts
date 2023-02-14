//
// A compiled program is a JavaScript array containing
// instructions as tuples [op-code argument].
//
// Use the array's methods to iterate over the instructions:
//
//   program.forEach(function(instruction) { ... })
//
// Use the object's properties to access the instructions using
// labels:
//
//   pc = program["label"]
//

// PARSER: String -> Program
//
// A program can be represented by a collection of lines.
// A line can be a label starting at column 1 or an instruction
// starting at column 8 composed of an op code of up to 3
// characters and an optional argument.
//
// LABEL  CODE    ADDRESS
// 1- -6  8- -10  12-
//
// Note: Strings are enclosed in simple quotes in assembly code
//       to make the parsing easier for the human and the machine.
//       These quotes are removed here before sending the instruction
//       to the virtual machine.
//
const parse = function (text: string): Instruction[] {
	// We create an array for our program, where each instruction will get put into.
	const program = [];
	// We split the text at each newline to get an array of lines.
	const lines = text.split("\n");

	// Then we iterate over all lines and add them to our program.
	for (const line of lines) {
		// Skip blank lines.
		if (line.trim().length == 0) {
			continue;
		}

		// Labels are left bound, whilst instructions are indented.
		if (line[0] == " ") {
			program.push(parseInstruction(line));
		} else {
			program[parseLabel(line)] = program.length;
		}
	}

	return program;
};



function parseInstruction(line: string): Instruction {
	const instruction = line.trim();
	// Check if there is a space in the line.
	var idx = instruction.indexOf(" ");
	// If there is no space, it's just an instruction without any arguments.
	if (idx === -1) {
		return [instruction];
	} else {
		var argument = instruction
			.slice(idx)
			.trim()
			.replace(/^["'](.*)['"]$/, "$1");
		return [instruction.slice(0, idx), argument];
	}
}

function parseLabel(line: string): string {
	return line.trim();
}

export { parse }