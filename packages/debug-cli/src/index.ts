#!/usr/bin/env node

import * as fs from "fs";
import { Debugger } from "@metalang/debugger";
import chalk from "chalk";
import blessed from "blessed";

if (process.argv.length < 4) {
	console.log("Usage: meta-debug <compiler assembly code> <grammar>");
	process.exit(1);
}

var compiler = fs.readFileSync(process.argv[2], "utf-8");
const assemblyLines = compiler.split("\n");
var grammar = fs.readFileSync(process.argv[3], "utf-8");
const lines = grammar.split("\n")
var debug = new Debugger(compiler, grammar);

debug.addBreakpoint(1);
debug.addBreakpoint(2);
debug.addBreakpoint(3);
debug.addBreakpoint(4);
debug.addBreakpoint(5);
debug.addBreakpoint(6);
debug.addBreakpoint(7);

let screen = blessed.screen({
	smartCSR: true,
	dockBorders: true
});

const boxCode = blessed.box({
	parent: screen,
	width: "100%-2",
	height: "40%",
	left: 2,
	top: 0,
	padding: {
		left: 2,
		right: 2,
		top: 1,
		bottom: 1
	},
	border: "line",
	content: ""
})

const boxAssembly = blessed.box({
	parent: screen,
	width: "100%-2",
	height: "40%",
	left: 2,
	top: "40%-1",
	padding: {
		left: 2,
		right: 2,
		top: 1,
		bottom: 1
	},
	border: "line"
})

const boxBottom = blessed.box({
	parent: screen,
	width: "100%",
	height: "40%",
	left: 0,
	top: "80%",
	padding: 0,
	margin: 0,
	border: "bg"
})

const input = blessed.textbox({
	parent: screen,
	left: 9,
	bottom: 0,
	name: 'input',
	input: true,
	keys: true,
	height: 1,
	width: "100%",
	inputOnFocus: true,
	content: "(meta)",
	style: {
		fg: 'white',
		bg: 'black'
	}
})

const commandOutput = blessed.text({
	parent: screen,
	left: 0,
	bottom: 1
})

blessed.text({
	parent: screen,
	left: 0,
	bottom: 0,
	content: "(meta) $ ",
})

function getSurroundingLines(lines: string[], lineno: number, lineCount: number) {
	// We can display a maximum of `lineCount` numbers
	let count = Math.ceil(lineCount / 2);
	let min = Math.max(0, lineno - count);
	let theoreticalMax = Math.min(lines.length, min + lineCount);
	
	let result = [];
	for (let i = min; i < lines.length; i++) {
		let text = lines[i];
		if (i + 1 == lineno) {
			text = chalk.bgWhite.black(text);
		}
		result.push(`${(i + 1).toString().padEnd(theoreticalMax.toString().length, " ")} ${text}`);
		if (i == theoreticalMax) {
			return result.join("\n")
		}
	}
	return result.join("\n")
}

debug.on("breakpoint", ({ lineno, colno, pc }) => {
	var text = "";

	const addLine = (line: string) => {
		text += line + "\n";
	}

	addLine(`Hit breakpoint, halting execution! (${lineno}:${colno})`);
	addLine(lines[lineno - 1]);
	addLine(" ".repeat(colno - 1) + "^");
	addLine("Hit <r> to resume.");
	
	const displayableLines = screen.rows * 0.4;

	let code = getSurroundingLines(lines, lineno, displayableLines - 3);
	let assembly = getSurroundingLines(assemblyLines, pc, displayableLines - 3);

	boxCode.setContent(code);
	boxAssembly.setContent(assembly);
	boxBottom.setContent(text);
	
	input.on("submit", (cmd) => {
		input.setValue("");

		if (cmd == "quit" || cmd == "q") {
			process.exit();
		} else if (cmd == "c" || cmd == "continue") {
			//debug.run();
		} else {
			commandOutput.setContent(`Command not found: ${cmd}`)
		}

		input.focus();
		screen.render();
	})

	input.focus();
	screen.render();
});

debug.run();
