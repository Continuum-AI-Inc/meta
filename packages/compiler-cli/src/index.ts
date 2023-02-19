#!/usr/env/bin node

import { colarg } from "colarg";
import { Compile } from "./Commands/Compile.js";
import { Create } from "./Commands/Create.js";

let terminal = new colarg(process.argv.slice(2));

terminal.addCommand({
	name: "create",
	description: "Create a new Metalang project.",
	args: []
}, Create)

terminal.addCommand({
	name: "compile",
	description: "Use the standard compiler or the given one to compile another file.",
	args: [{
		name: "output",
		alias: "o",
		type: "string",
		description: "An optional file path to output the compiled file to.",
		required: false
	},
	{
		name: "grammar",
		alias: "g",
		type: "string",
		description: "The file that should be used as a grammar, if not set the default Metalang grammar will be used.",
		defaults: "default",
		required: false
	},{
		name: "binary",
		alias: "b",
		type: "boolean",
		description: "Whether to output binary instead of '.masm'",
		defaults: false,
		required: false
	},{
		name: "mls",
		alias: "l",
		type: "boolean",
		defaults: false,
		description: "Whether the compiled file follows the Meta Language Specification, must be true to allow for binary output.",
		required: false
	},{
		name: "debug",
		alias: "d",
		type: "boolean",
		defaults: false,
		description: "Whether to compile using debug mode, this will allow for debugging later on.",
		required: false
	}]
}, Compile)

terminal.enableHelp();

terminal.run();