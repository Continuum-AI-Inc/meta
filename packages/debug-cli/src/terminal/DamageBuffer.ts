
interface Change {
	x: number,
	y: number,
	content: string,
}

class DamageBuffer {
	private buffer: Array<Change> = [];

	public clear() {
		// Scrap the old buffer, we don't need it anymore.
		this.buffer = [];
	}

	public add(content: string, x: number, y: number) {
		this.buffer.push({
			content,
			x,
			y
		})
	}

	public applyChanges() {
		let lastCursorX: number = 0;
		let lastCursorY: number = 0;
		// Split the content at each newline character to wrap lines.
		for (let i = 0; i < this.buffer.length; i++) {
			const change = this.buffer[i];
			
			if (lastCursorX != change.x - 1 || lastCursorY != change.x) {
				// We need to adjust the cursor position before continuing writing to the screen.
				process.stdout.cursorTo(change.x, change.y);
			}

			process.stdout.write(change.content);
		}
	}
}

export { DamageBuffer }