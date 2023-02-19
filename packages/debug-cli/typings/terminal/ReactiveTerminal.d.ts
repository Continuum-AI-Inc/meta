import { DamageBuffer } from "./DamageBuffer.js";
import type { Reactive } from "./types.js";
import { ReactiveElement } from "./ReactiveElement.js";
declare class Terminal extends ReactiveElement implements Reactive.Terminal {
    outerX: number;
    outerY: number;
    innerX: number;
    innerY: number;
    outerWidth: number;
    outerHeight: number;
    innerWidth: number;
    innerHeight: number;
    children: Reactive.Element[];
    focusedElement: Reactive.Element;
    buffer: DamageBuffer;
    terminal: Reactive.Terminal;
    constructor();
    getOffsets(): void;
    private getDimensions;
    private addResizeListener;
    readonly render: () => void;
}
export { Terminal };
//# sourceMappingURL=ReactiveTerminal.d.ts.map