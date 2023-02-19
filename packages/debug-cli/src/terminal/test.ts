
import { Terminal } from "./ReactiveTerminal.js";
import { Box } from "./widgets/Box.js";
import { Text } from "./widgets/Text.js";
import { TextInput } from "./widgets/TextInput.js";

let terminal = new Terminal();

const code = new Box({
	parent: terminal,
	width: "100%",
	height: "50%",
	left: 0,
	top: 0,
	padding: 0,
	border: "slim"
})

const inner = new Box({
	parent: code,
	width: "50%",
	height: "100%",
	left: 0,
	top: 0,
	padding: 0,
	border: "slim"
})

const inner2 = new Box({
	parent: code,
	width: "50%",
	height: "100%",
	right: 0,
	top: 0,
	padding: 0,
	border: "slim"
})

const input = new TextInput({
	parent: terminal,
	width: "100%",
	height: 1,
	left: 7,
	bottom: 0
})

const uh = new Text({
	parent: terminal,
	width: 7,
	height: 1,
	left: 0,
	bottom: 0,
	content: "(meta) "
})



input.on("submit", (str) => {
	inner.setContent("Trying to execute command: " + str);
	
	terminal.render()
})

terminal.render()
input.focus()


setInterval(() => {
	let text = "";
	let height = inner.innerHeight;
	let width = inner.innerWidth;
	for (let i = 0; i <= height; i++) {
		for (let j = 0; j <= width; j++) {
			text += Math.random().toString()[3];
		}
		text += "\n";
	}

	//inner.setContent(text);
	//terminal.render()
}, 1000)