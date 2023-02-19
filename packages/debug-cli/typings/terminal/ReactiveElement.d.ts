/// <reference types="node" />
import type { Reactive } from "./types.js";
import { EventEmitter } from "events";
import { DamageBuffer } from "./DamageBuffer.js";
declare abstract class ReactiveElement extends EventEmitter implements Reactive.Element {
    options: Reactive.ElementOptions;
    outerWidth: number;
    outerHeight: number;
    innerWidth: number;
    innerHeight: number;
    outerX: number;
    outerY: number;
    innerX: number;
    innerY: number;
    padding: Reactive.Padding;
    parent: Reactive.Element | Reactive.Terminal;
    children: Reactive.Element[];
    content: string;
    focused: boolean;
    buffer: DamageBuffer;
    terminal: Reactive.Terminal;
    constructor(options: Reactive.ElementOptions);
    focus(): boolean;
    toggleFocus(): boolean;
    unfocus(): boolean;
    onRender(): void;
    onBeforeRender(): void;
    onAfterRender(): void;
    getOffsets(): void;
    readonly render: () => void;
    readonly renderChildren: () => void;
    readonly setContent: (content: string) => void;
    readonly append: (...elements: Reactive.Element[]) => void;
}
export { ReactiveElement };
//# sourceMappingURL=ReactiveElement.d.ts.map