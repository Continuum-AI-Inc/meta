#!/usr/bin/env node

import * as fs from "fs";
import { Debugger } from "../../debugger/src/debugger.js";
import chalk from "chalk";
import { ReactiveTerminal } from "./terminal/ReactiveTerminal.js";

if (process.argv.length < 4) {
	console.log("Usage: meta-debug <compiler assembly code> <grammar>");
	process.exit(1);
}

var compiler = fs.readFileSync(process.argv[2], "utf-8");
var grammar = fs.readFileSync(process.argv[3], "utf-8");
var debug = new Debugger(compiler, grammar);

debug.addBreakpoint(1);
debug.addBreakpoint(2);
debug.addBreakpoint(3);
debug.addBreakpoint(4);
debug.addBreakpoint(5);
debug.addBreakpoint(6);
debug.addBreakpoint(7);

let terminal = new ReactiveTerminal();
terminal.grid({
	"code": {
		width: 100,
		height: 40,
		offsetX: 0,
		offsetY: 0,
		padding: [1, 2, 1, 2],
		border: "slim",
		title: "linked_list.h",
		borderBackground: chalk.bgWhite,
		borderForeground: chalk.black,
		margin: [0, 0, 0, 2]
	},
	"assembly": {
		width: 100,
		height: 40,
		offsetX: 0,
		offsetY: 40,
		padding: [1,2,1,2],
		border: "slim",
		borderBackground: chalk.bgWhite,
		borderForeground: chalk.black,
		margin: [-1,0,0,2]
	},
	"bottom": {
		width: 100,
		height: 40,
		offsetX: 0,
		offsetY: 80,
		padding: 0,
		margin: 0,
		border: "none"
	}
})

terminal.addCommand("breakpoint", (args) => {
	console.log(args);
});

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

debug.on("breakpoint", (resume, { lineno, colno, lines, assemblyLines, pc }) => {
	var text = "";

	const addLine = (line: string) => {
		text += line + "\n";
	}

	terminal.clear();
	addLine(`Hit breakpoint, halting execution! (${lineno}:${colno})`);
	addLine(lines[lineno - 1]);
	addLine(" ".repeat(colno - 1) + "^");
	addLine("Hit <r> to resume.");

	const displayableLines = terminal.getBoxHeight("code");

	let code = getSurroundingLines(lines, lineno, displayableLines - 3);
	let assembly = getSurroundingLines(assemblyLines, pc, terminal.getBoxHeight("assembly") - 3);

	const keypressListener = (key) => {
		if (key.name == "f") {
			terminal.toggleMenuActive("File");
		} else if (key.name == "c") {
			resume();
			terminal.off("keypress", keypressListener)
		}
	}

	terminal.on("keypress", keypressListener)

	terminal.overwrite({
		"code": code,
		"assembly": assembly,
		"bottom": text
	});

	setTimeout(() => {
		terminal.write("(dmeta) ")
	}, 10)
});

debug.step();
