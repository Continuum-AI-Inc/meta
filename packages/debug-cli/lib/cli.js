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
var assemblyLines = compiler.split("\n");
var grammar = fs.readFileSync(process.argv[3], "utf-8");
var lines = grammar.split("\n");
var debug = new Debugger(compiler, grammar);
debug.addBreakpoint(1);
debug.addBreakpoint(2);
debug.addBreakpoint(3);
debug.addBreakpoint(4);
debug.addBreakpoint(5);
debug.addBreakpoint(6);
debug.addBreakpoint(7);
var screen = blessed.screen({
    smartCSR: true
});
var boxCode = blessed.box({
    width: "100%",
    height: "40%",
    left: 0,
    top: 0,
    padding: {
        left: 2,
        right: 2,
        top: 1,
        bottom: 1
    },
    border: "line",
    content: ""
});
var boxAssembly = blessed.box({
    width: "100%",
    height: "40%",
    left: 0,
    top: "40%",
    padding: {
        left: 2,
        right: 2,
        top: 1,
        bottom: 1
    },
    border: "line"
});
var boxBottom = blessed.box({
    width: "100%",
    height: "40%",
    left: 0,
    top: "80%",
    padding: 0,
    margin: 0,
    border: "line"
});
screen.append(boxCode);
screen.append(boxAssembly);
screen.append(boxBottom);
function getSurroundingLines(lines, lineno, lineCount) {
    var count = Math.ceil(lineCount / 2);
    var min = Math.max(0, lineno - count);
    var theoreticalMax = Math.min(lines.length, min + lineCount);
    var result = [];
    for (var i = min; i < lines.length; i++) {
        var text = lines[i];
        if (i + 1 == lineno) {
            text = chalk.bgWhite.black(text);
        }
        result.push("".concat((i + 1).toString().padEnd(theoreticalMax.toString().length, " "), " ").concat(text));
        if (i == theoreticalMax) {
            return result.join("\n");
        }
    }
    return result.join("\n");
}
debug.on("breakpoint", function (_a) {
    var lineno = _a.lineno, colno = _a.colno, pc = _a.pc;
    var text = "";
    var addLine = function (line) {
        text += line + "\n";
    };
    addLine("Hit breakpoint, halting execution! (".concat(lineno, ":").concat(colno, ")"));
    addLine(lines[lineno - 1]);
    addLine(" ".repeat(colno - 1) + "^");
    addLine("Hit <r> to resume.");
    var displayableLines = boxCode.getScrollHeight();
    var code = getSurroundingLines(lines, lineno, displayableLines - 3);
    var assembly = getSurroundingLines(assemblyLines, pc, boxAssembly.getScrollHeight() - 3);
    boxCode.setContent(code);
    boxAssembly.setContent(assembly);
    boxBottom.setContent(text);
    screen.render();
});
debug.step();
