import readline from "readline";
import { EventEmitter } from "node:events";
import chalk from "chalk";

interface Box {
	width: number;
	height: number;
	offsetX: number;
	offsetY: number;
	padding: number[] | number;
	title?: string;
	border?: "none" | "slim" | "double";
	borderBackground?: (x: string) => string;
	borderForeground?: (x: string) => string;
	margin?: number[] | number;
}

interface Position {
	x: number;
	y: number;
	width: number;
	height: number;
}

interface Menu {
	active: boolean;
	callback: () => any;
}

type Content = { [name: string]: string } | string;

type BorderStyle = "slim" | "double" | "none";

function chunkSubstr(str: string, size: number) {
	const numChunks = Math.ceil(str.length / size);
	const chunks = new Array(numChunks);

	for (let i = 0; i < numChunks; ++i) {
		chunks[i] = str.substring(i * size, size * (i + 1));
	}

	return chunks;
}

class ReactiveTerminal {
	public width: number;
	public height: number;
	public layout: { [name: string]: Box };
	public content: Content;
	private commands: { [name: string]: (...args: any[]) => any } = {};
	private renderPositions: { [name: string]: Position };
	private menus: { [name: string]: Menu };
	private hasMenu: boolean;

	constructor() {
		this.width = this.getWidth();
		this.height = this.getHeight();
		this.renderPositions = {};
		readline.emitKeypressEvents(process.stdin);
		process.stdin.setRawMode(false);

		process.stdin.on("keypress", (str, key) => {
			if (key.ctrl && key.name == "c") {
				process.exit(1);
			} else {
				this.emit("keypress", key);
			}
		});

		const rl = readline.createInterface({
			input: process.stdin,
		});
		rl.on("line", (line) => {
			let [command] = line.split(" ");
			if (this.commands.hasOwnProperty(command)) {
				this.commands[command](line);
			}
			console.clear();
			this.render(this.content)
		});

		this.addResizeListener();
	}

	private getHeight() {
		return process.stdout.rows;
	}

	private getWidth() {
		return process.stdout.columns;
	}

	private addResizeListener() {
		process.stdout.on("resize", this.onResize.bind(this));
	}

	private onResize() {
		this.height = this.getHeight();
		this.width = this.getWidth();
		this.clear();
		this.render(this.content);
	}

	public newline() {
		this.write("\n");
	}

	public render(content: Content) {
		this.content = content;
		this.renderMenu();
		this.renderLayout();
		this.renderContent(content);
		this.newline();
		this.position(0, this.height + 1);
	}

	private renderContent(content: Content) {
		if (typeof content == "string") {
			this.write(content);
		} else {
			for (const name in content) {
				let position = this.renderPositions[name];
				if (!position || !content[name]) {
					continue;
				}

				// Split at every new line character
				let lines = content[name].split("\n");
				// And sort into chunks if the line would
				// cause overflow otherwise.
				lines = lines
					.map((x) => chunkSubstr(x, position.width))
					.flat(Infinity);

				for (let i = 0; i < lines.length; i++) {
					const line = lines[i];
					readline.cursorTo(
						process.stdout,
						position.x,
						position.y + i
					);
					this.write(line);
				}
			}
		}
	}

	public write(content: string) {
		process.stdout.write(content);
	}

	private emitter = new EventEmitter();
	public on(event: "keypress", callback: (...args: any[]) => any) {
		this.emitter.on(event, callback);
	}

	public off(event: "keypress", callback: (...args: any[]) => any) {
		this.emitter.off(event, callback);
	}

	public once(event: "keypress", callback: (...args: any[]) => any) {
		this.emitter.once(event, callback);
	}

	private emit(event: string, ...args: any[]) {
		this.emitter.emit(event, ...args);
	}

	public addCommand(name: string, callback: (...args: any[]) => any) {
		this.commands[name] = callback;
	}

	public removeCommand(name: string) {
		delete this.commands[name];
	}

	/**
	 * Draws a grid to the screen given an object of names
	 * and sizes as percentage values.
	 */
	public grid(sizes: { [name: string]: Box }) {
		this.clear();
		this.layout = sizes;
		this.renderLayout();
	}

	public getBoxHeight(name: string) {
		if (this.renderPositions.hasOwnProperty(name)) {
			return this.renderPositions[name].height;
		}
	}

	public getBoxWidth(name: string) {
		if (this.renderPositions.hasOwnProperty(name)) {
			return this.renderPositions[name].width;
		}
	}

	public position(x: number, y: number) {
		readline.cursorTo(process.stdout, x, y);
	}

	private renderMenu() {
		let text = "";
		for (const name in this.menus) {
			const { active } = this.menus[name];

			if (active) {
				text += chalk.bgGreenBright(name);
			} else {
				text += chalk.bgWhiteBright(name);
			}
			text += chalk.bgWhiteBright(" ");
		}
		text += chalk.reset();
		this.writeHorizontal(chalk.black(text), 0, 0);
	}

	public toggleMenuActive(name: string) {
		if (this.menus.hasOwnProperty(name)) {
			this.menus[name].active = !this.menus[name].active;
			this.render(this.content);
		}
	}

	public setMenuActive(name: string) {
		if (this.menus.hasOwnProperty(name)) {
			this.menus[name].active = true;
			this.render(this.content);
		}
	}

	private renderLayout() {
		for (const name in this.layout) {
			var {
				width: widthPercent,
				height: heightPercent,
				offsetX,
				offsetY,
				padding = 0,
				title = "",
				border = "slim",
				borderBackground = chalk.bgBlack,
				borderForeground = chalk.white,
				margin = 0,
			} = this.layout[name];
			// Default value "slim"
			const marginArray = Array.isArray(margin)
				? margin
				: Array(4).fill(margin || 0);
			const paddingArray = Array.isArray(padding)
				? padding
				: Array(4).fill(padding || 0);

			// Convert the relative width to absolute width.
			const charWidth =
				Math.floor(this.width * (widthPercent / 100)) -
				marginArray[1] -
				marginArray[3];
			const charHeight =
				Math.floor(this.height * (heightPercent / 100)) -
				marginArray[2] -
				marginArray[0];

			const borderWidth = border == "none" ? 0 : 1;

			offsetX = Math.floor(this.width * (offsetX / 100)) + marginArray[3];
			offsetY = Math.floor(this.height * (offsetY / 100)) + marginArray[0];

			offsetY += this.hasMenu ? 1 : 0;

			this.renderPositions[name] = {
				x: offsetX + paddingArray[3] + borderWidth,
				y: offsetY + paddingArray[0] + borderWidth,
				width: charWidth - paddingArray[1] - paddingArray[3],
				height: charHeight - paddingArray[0] - paddingArray[2],
			};

			if (border == "none") {
				continue;
			}

			let boxCharacters = this.getBoxCharacters(border);

			boxCharacters = boxCharacters.map((x: string) => borderBackground(borderForeground(x)));

			for (let i = 0; i < charHeight; i++) {
				readline.cursorTo(process.stdout, offsetX, offsetY + i);
				if (i == 0) {
					this.write(
						boxCharacters[2] +
							boxCharacters[0].repeat(charWidth - 2) +
							boxCharacters[3]
					);
				} else if (i == charHeight - 1) {
					this.write(
						boxCharacters[4] +
							boxCharacters[0].repeat(charWidth - 2) +
							boxCharacters[5]
					);
				} else {
					this.write(boxCharacters[1]);
					readline.cursorTo(
						process.stdout,
						offsetX + charWidth - 1,
						offsetY + i
					);
					this.write(boxCharacters[1]);
				}
			}

			if (title) {
				this.writeHorizontal(borderBackground(borderForeground(title)), offsetX + 2, offsetY);
			}
		}
	}

	private getBoxCharacters(border: BorderStyle): string[] {
		let borderCharacterMap = {
			"slim": ["─", "│", "┌", "┐", "└", "┘"],
			"double": ["═", "║", "╔", "╗", "╚", "╝"]
		}

		return borderCharacterMap[border];
	}

	private writeHorizontal(content: string, x: number, y: number) {
		this.position(x, y);
		this.write(content);
	}

	private writeVertical(content: string, x: number, y: number) {
		for (let i = 0; i < content.length; i++) {
			const char = content[i];
			this.position(x, y + i);
			this.write(char);
		}
	}

	public add(content: Content) {
		if (typeof content == "string") {
			this.content += content;
		} else {
			for (const name in content) {
				let value = content[name];
				if (!this.content.hasOwnProperty(name)) {
					this.content[name] = value;
				} else {
					this.content[name] += value;
				}
			}
		}

		this.render(this.content);
	}

	public overwrite(content: Content) {
		if (typeof content == "string") {
			this.content = content;
		} else {
			this.content = Object.assign(this.content || {}, content);
		}

		this.render(this.content);
	}

	public menu(menu: { [name: string]: Menu }) {
		this.menus = menu;
		this.hasMenu = true;
		this.render(this.content);
	}

	public box(name: string, box: Box) {
		this.layout[name] = box;
		this.render(this.content);
	}

	public clear() {
		this.write("\x1B[2J");
		readline.cursorTo(process.stdout, 0, 0);
		readline.clearScreenDown(process.stdout);
	}
}

export { ReactiveTerminal };
