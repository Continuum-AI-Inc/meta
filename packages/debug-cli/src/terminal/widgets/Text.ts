import type { Reactive } from "../types.js";
import { ReactiveElement } from "../ReactiveElement.js";
import { UnitToPixels } from "../helpers.js";

class Text extends ReactiveElement {
	constructor(public options: Reactive.ElementOptions) {
		super(options);
	}

	onBeforeRender() {
		this.innerWidth = this.outerWidth = UnitToPixels(this.options.width, this.parent.innerWidth);
		this.innerHeight = this.outerHeight = UnitToPixels(this.options.height, this.parent.innerHeight);

		this.getOffsets();

		this.innerX = this.outerX;
		this.innerY = this.outerY;
	}

	public onRender() {
		// Add content
		// Split the content into lines so they don't wrap around automatically
		// and mess up our borders
		let lines = this.content.split("\n");
		for (let i = 0; i < lines.length; i++) {
			let line = lines[i];
			this.buffer.add(line, this.innerX, this.innerY + i);
		}
	}
}

export { Text }