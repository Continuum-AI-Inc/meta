import type { Reactive } from "./types";

/**
 * Convert the `Reactive.Unit` type to an actual number representation.
 * This conversion supports following cases:
 *	 50%+23
 *	 50%+1
 *	 24.5%
 *	 24.5%+2
 *	 26.7%-2
 *	 26.7%-14
 *
 * @date 2/15/2023 - 9:29:05 PM
 *
 * @param {Reactive.Unit} unit
 * @param {number} baseMeasurement e.g. the width/height that percentages should be based upon.
 */
function UnitToPixels(unit: Reactive.Unit, baseMeasurement: number) {
	if (typeof unit == "string") {
		const [_, num, op, as] = unit.match(/^([0-9.]+)%([\-+]?)([0-9.]*)$/);
		const absolute = (parseFloat(num) / 100) * baseMeasurement;

		// Check if there is an operand and something to assign to it.
		if (op && as) {
			if (op == "+") {
				// Handle addition.
				return Math.floor(absolute + parseFloat(as));
			} else if (op == "-") {
				// Handle subtraction
				return Math.floor(absolute - parseFloat(as));
			}
		}

		return Math.floor(absolute);
	}

	return Math.floor(unit);
}

function expandPadding(padding: Reactive.Padding, width: number, height: number) {
	let paddingArray = [];
	if (Array.isArray(padding)) {
		if (padding.length !== 4) {
			throw new Error("Invalid padding length encountered. Expected to see 4 but saw " + padding.length);
		}

		paddingArray.push(UnitToPixels(padding[0], height));
		paddingArray.push(UnitToPixels(padding[1], width));
		paddingArray.push(UnitToPixels(padding[2], height));
		paddingArray.push(UnitToPixels(padding[3], width));
	} else {
		let widthUnit = UnitToPixels(padding, width);
		let heightUnit = UnitToPixels(padding, height);
		paddingArray.push(heightUnit, widthUnit, heightUnit, widthUnit);
	}

	return paddingArray;
}

function cursorTo(x: number, y: number) {
	process.stdout.cursorTo(x,y);
}

function hideCursor() {
	process.stdout.write("\u001B[?25l");
}

function showCursor() {
	process.stdout.write("\u001B[?25h");
}

export { UnitToPixels, expandPadding, cursorTo, hideCursor, showCursor };
