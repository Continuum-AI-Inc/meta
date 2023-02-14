const red = function(str: string) {
	return `\x1b[41m${str}\x1b[0m`;
}

const invert = function(str: string) {
	return `\x1b[47m${str}\x1b[0m`
}

const markup = function(str: string) {
	return str.replace(/`(.*?)`/g, (all, match) => {
		return invert(match);
	})
}

const error = function (message: string, text: string, source: string, lineno: number, colno: number) {
	const lineIndex = lineno - 1;
	console.clear();
	console.group("An Error Occured in your Application!");
	console.error("[ERROR]  ", message);
	console.error("[SOURCE] ", source);
	console.error("[LINE]   ", lineno);
	console.error("[COLUMN] ", colno);

	console.groupCollapsed("Context");
	const lines = text.split("\n");
	let startLine = Math.max(lineIndex - 5, 0);
	let endLine = Math.min(lineIndex + 5, lines.length - 1);
	for (let i = startLine; i <= endLine; i++) {
		let text = `${i + 1}: ${lines[i]}`;
		if (i == lineIndex) {
			console.log(red(text));
			console.log(" ".repeat(colno) + "^")
		} else {
			console.log(text);
		}
	}
	console.groupEnd();

	console.groupCollapsed("Advice");
	console.warn("Here is some advice to help you resolve this error: ");

	const instruction = lines[lineIndex].trim().split(" ")[0];
	const instructionInfo = INSTRUCTIONS[instruction];

	if (instructionInfo) {
		console.warn(markup(instructionInfo));
	}

	console.groupEnd();

	console.groupEnd();

	process.exit(1);
}

const INSTRUCTIONS = {
	"BF": "BRANCH IF FALSE - Branch to given location if `branch` flag is `false`, otherwise continue in sequence.",
	"BT": "BRANCH IF TRUE - Branch to given location if `branch` flag is `true`, otherwise continue in sequence.",
	"BE": "BRANCH TO ERROR IF FALSE - Branch to error message if `branch` flag is `false`, otherwise continue in sequence.",
}

export { error }