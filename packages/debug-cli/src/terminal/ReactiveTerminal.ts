import readline from "readline";
import { EventEmitter } from "node:events";
import { DamageBuffer } from "./DamageBuffer.js";
import type { Reactive } from "./types.js";
import { ReactiveElement } from "./ReactiveElement.js";
import { hideCursor, showCursor } from "./helpers.js";

function chunkSubstr(str: string, size: number) {
	const numChunks = Math.ceil(str.length / size);
	const chunks = new Array(numChunks);

	for (let i = 0; i < numChunks; ++i) {
		chunks[i] = str.substring(i * size, size * (i + 1));
	}

	return chunks;
}

function clearScreen() {
	process.stdout.write("\u001Bc");
	process.stdout.write("\x1b[0f");
}

class Terminal extends ReactiveElement  implements Reactive.Terminal {
	public outerX: number = 0;
	public outerY: number = 0;
	public innerX: number = 0;
	public innerY: number = 0;
	public outerWidth: number;
	public outerHeight: number;
	public innerWidth: number;
	public innerHeight: number;
	public children: Reactive.Element[] = [];
	public focusedElement: Reactive.Element;
	public buffer: DamageBuffer = new DamageBuffer();
	public terminal: Reactive.Terminal = this;

	constructor() {
		super({
			parent: null,
			width: process.stdout.columns,
			height: process.stdout.rows,
			left: 0,
			top: 0
		});
		this.getDimensions();
		clearScreen();
		hideCursor();
		readline.emitKeypressEvents(process.stdin);
		process.stdin.setRawMode(true);

		process.stdin.on("keypress", (str, key) => {
			if (key.ctrl && key.name == "c") {
				process.exit(1);
			}

			this.focusedElement.emit("keypress", str, key);
		});

		process.on("exit", () => {
			clearScreen();
			showCursor();
		})

		this.addResizeListener();
	}

	public getOffsets() {
		this.outerX = 0;
		this.outerY = 0;
	}

	private getDimensions() {
		this.outerHeight = this.innerHeight = process.stdout.rows;
		this.outerWidth = this.innerWidth = process.stdout.columns;
	}

	private addResizeListener() {
		process.stdout.on("resize", () => {
			this.getDimensions();
			this.buffer.clear();
			clearScreen();
			this.render();
		});
	}

	public readonly render = () => {
		for (const element of this.children) {
			element.render();
		}
		this.buffer.applyChanges();
	}
}

export { Terminal };
