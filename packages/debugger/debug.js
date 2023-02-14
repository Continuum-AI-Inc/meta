import { METALANG } from "@metalang/core";
import { Debugger } from "./lib/index.js"

const testGrammar = `
.SYNTAX PROGRAM

PROGRAM = EX $EX;

EX = "Hello" $ "World";

.END
`

let debug = new Debugger(METALANG, testGrammar);

debug.addBreakpoint(4);

debug.on("step", ({ lineno, colno, pc, metadata: {isJumpInstruction} })  => {
	console.log(METALANG.split("\n")[pc], isJumpInstruction)
})

debug.on("breakpoint", ({ lineno, colno, metadata: {isJumpInstruction} })  => {
	let lines = testGrammar.split("\n");
	let line = lines[lineno - 1];

	if (isJumpInstruction) {
		console.log("INTO", debug.stepInto());
	} else {
		console.log("NEXT", debug.run());
	}
})

debug.run();