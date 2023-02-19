import type { Reactive } from "./types.js";
import { EventEmitter } from "events";
import { DamageBuffer } from "./DamageBuffer.js";
import { UnitToPixels } from "./helpers.js";

abstract class ReactiveElement extends EventEmitter implements Reactive.Element {
	public outerWidth: number = 0;
	public outerHeight: number = 0;
	public innerWidth: number = 0;
	public innerHeight: number = 0;
	public outerX: number = 0;
	public outerY: number = 0;
	public innerX: number = 0;
	public innerY: number = 0;
	public padding: Reactive.Padding = 0;
	public parent: Reactive.Element | Reactive.Terminal;
	public children: Reactive.Element[] = [];
	public content: string = "";
	public focused: boolean;
	public buffer: DamageBuffer;
	public terminal: Reactive.Terminal;

	constructor(public options: Reactive.ElementOptions) {
		super();

		this.content = options.content || "";
		if (options.parent) {
			options.parent.append(this);
		}
	}

	public focus(): boolean {
		if (this.terminal.focusedElement) {
			this.terminal.focusedElement.emit("blur");
		}
		this.terminal.focusedElement = this;
		this.emit("focus");
		return this.focused = true;
	}
	public toggleFocus(): boolean {
		if (this.terminal.focusedElement) {
			this.terminal.focusedElement.emit("blur");
		}
		this.focused = !this.focused;
		this.terminal.focusedElement = this.focused ? this : null;
		if (this.focused) {
			this.emit("focus")
		}
		return this.focused;
	}
	public unfocus(): boolean {
		if (this.terminal.focusedElement) {
			this.terminal.focusedElement.emit("blur");
		}
		this.terminal.focusedElement = null;
		return this.focused = false;
	}

	onRender() {
		throw new Error("Method not implemented.");
	}

	onBeforeRender() {
		
	}

	onAfterRender() {
		
	}
	
	getOffsets() {
		// We need to determine the upper left x/y coordinate.
		// This is trickier than you might think since we may only have information about the bottom
		// or the right hand side.
		// So we need to subtract the width/height from that to get our left/top distances.
		if (this.options.left !== undefined) {
			this.outerX = UnitToPixels(this.options.left, this.parent.innerWidth) + this.parent.innerX;
		}

		if (this.options.top !== undefined) {
			this.outerY = UnitToPixels(this.options.top, this.parent.innerHeight) + this.parent.innerY;
		}

		if (this.options.right !== undefined) {
			let rightAbsolute = UnitToPixels(this.options.right, this.parent.innerWidth);
			this.outerX = this.parent.innerWidth - this.outerWidth - rightAbsolute + this.parent.innerX;
		}

		if (this.options.bottom !== undefined) {
			let bottomAbsolute = UnitToPixels(this.options.bottom, this.parent.innerHeight);
			this.outerY = this.parent.innerHeight - this.outerHeight - bottomAbsolute + this.parent.innerY;
		}
	}
	

	public readonly render = (): void => {
		this.onBeforeRender();
		this.onRender();
		this.renderChildren();
		this.onAfterRender();
	}

	public readonly renderChildren = () => {
		for (const child of this.children) {
			child.render();
		}
	}

	public readonly setContent = (content: string) => {
		this.content = content;
		this.render();
	}

	public readonly append = (...elements: Reactive.Element[]) => {
		for (const element of elements) {
			this.children.push(element);
			element.buffer = this.buffer;
			element.terminal = this.terminal;
			element.parent = this;
		}
	}
}

export { ReactiveElement }