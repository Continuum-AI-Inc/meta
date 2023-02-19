import type { Reactive } from "./types";
declare function UnitToPixels(unit: Reactive.Unit, baseMeasurement: number): number;
declare function expandPadding(padding: Reactive.Padding, width: number, height: number): any[];
declare function cursorTo(x: number, y: number): void;
declare function hideCursor(): void;
declare function showCursor(): void;
export { UnitToPixels, expandPadding, cursorTo, hideCursor, showCursor };
//# sourceMappingURL=helpers.d.ts.map