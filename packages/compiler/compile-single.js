#!/usr/bin/env node

import * as fs from "fs";
import { parse } from "./lib/program.js";
import { MetaCompiler } from "./lib/index.js";

if (process.argv.length < 4) {
	console.log('Usage: meta <compiler assembly code> <grammar>');
	process.exit(1);
}

var t = fs.readFileSync(process.argv[2], 'utf-8');
var program = parse(t);
var compiler = new MetaCompiler(program);
var grammar = fs.readFileSync(process.argv[3], 'utf-8');
console.log(compiler.compile(grammar));