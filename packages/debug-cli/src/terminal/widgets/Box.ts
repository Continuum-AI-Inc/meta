import type { Reactive } from "../types.js";
import { ReactiveElement } from "../ReactiveElement.js";
import { expandPadding, UnitToPixels } from "../helpers.js";

class Box extends ReactiveElement {
	public borderWidth: number;
	public padding: number[];

	constructor(public options: Reactive.ElementOptions) {
		super(options);
	}

	onBeforeRender() {
		this.borderWidth = this.options.border == "none" ? 0 : 1;

		this.outerWidth = UnitToPixels(this.options.width, this.parent.innerWidth);
		this.outerHeight = UnitToPixels(this.options.height, this.parent.innerHeight);
		this.padding = expandPadding(this.options.padding, this.outerWidth, this.outerHeight);
		this.innerHeight = this.outerHeight - this.padding[0] - this.padding[2] - this.borderWidth * 2;
		this.innerWidth = this.outerWidth - this.padding[1] - this.padding[3] - this.borderWidth * 2;

		this.getOffsets()

		this.innerX = this.outerX + this.borderWidth + this.padding[3];
		this.innerY = this.outerY + this.borderWidth + this.padding[0];

		if (this.options.border !== "none") {
			this.innerHeight -= 2;
			this.innerWidth -= 2;
		}
	}

	public onRender() {
		if (this.options.border !== "none") {
			let boxCharacters = this.getBoxCharacters(this.options.border);

			for (let i = 0; i < this.outerHeight; i++) {
				let x = this.outerX, y = this.outerY + i;
				if (i == 0) {
					this.buffer.add(boxCharacters[2] +
						boxCharacters[0].repeat(this.outerWidth - 2) +
						boxCharacters[3], x, y);
				} else if (i == this.outerHeight - 1) {
					this.buffer.add(boxCharacters[4] +
						boxCharacters[0].repeat(this.outerWidth - 2) +
						boxCharacters[5], x, y)
				} else {
					this.buffer.add(boxCharacters[1], x, y);
					this.buffer.add(boxCharacters[1], x + this.outerWidth - 1, y);
				}
			}
		}

		// Add content
		// Split the content into lines so they don't wrap around automatically
		// and mess up our borders
		let lines = this.content.split("\n");
		for (let i = 0; i < lines.length; i++) {
			let line = lines[i];
			this.buffer.add(line, this.innerX, this.innerY + i);
		}
	}
	
	getBoxCharacters(border: Reactive.BorderStyle): string[] {
		let borderCharacterMap = {
			"slim": ["─", "│", "┌", "┐", "└", "┘"],
			"double": ["═", "║", "╔", "╗", "╚", "╝"]
		}

		return borderCharacterMap[border];
	}
}

export { Box }