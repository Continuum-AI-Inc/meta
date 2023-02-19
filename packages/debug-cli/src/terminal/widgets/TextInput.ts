import type { Reactive } from "../types.js";
import { ReactiveElement } from "../ReactiveElement.js";
import { cursorTo, hideCursor, showCursor, UnitToPixels } from "../helpers.js";

class TextInput extends ReactiveElement {
	constructor(public options: Reactive.ElementOptions) {
		super(options);
		this.on("focus", () => {
			showCursor();
			cursorTo(this.outerX + this.content.length, this.outerY);
		})

		this.on("blur", () => {
			hideCursor()
		})

		this.on("keypress", (str, key) => {
			if (key.sequence.charCodeAt(0) == 127) {
				if (this.content.length > 0) {
					process.stdout.write("\b \b");
					this.content = this.content.substring(0, this.content.length - 1);
				}
			} else if (key.name == "return" || key.name == "enter") {
				let content = this.content;
				this.clear();
				this.emit("submit", content);
			} else {
				this.content += str;
				process.stdout.write(str);
			} 
		})
	}

	public clear() {
		cursorTo(this.outerX + this.content.length, this.outerY);
		process.stdout.write("\b \b".repeat(this.content.length));
		this.setContent("");
	}

	public setContent = (content: string) => {
		this.content = content;
	}

	onBeforeRender() {
		this.innerWidth = this.outerWidth = UnitToPixels(this.options.width, this.parent.innerWidth);
		this.innerHeight = this.outerHeight = UnitToPixels(this.options.height, this.parent.innerHeight);

		this.getOffsets();

		this.innerX = this.outerX;
		this.innerY = this.outerY;
	}

	public onRender() {
		// Add content Value.
		this.buffer.add(this.content, this.outerX, this.outerY);
	}
}

export { TextInput }