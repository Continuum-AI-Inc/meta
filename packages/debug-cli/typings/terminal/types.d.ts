/// <reference types="node" />
import { DamageBuffer } from "./DamageBuffer";
import { EventEmitter } from "events";
declare namespace Reactive {
    type Unit = number | string;
    type Padding = Unit | Unit[];
    type BorderStyle = "slim" | "none" | "double";
    interface Element extends EventEmitter {
        outerWidth: number;
        outerHeight: number;
        innerWidth: number;
        innerHeight: number;
        outerX: number;
        outerY: number;
        innerX: number;
        innerY: number;
        parent: Element | Terminal;
        children: Element[];
        content: string;
        focused: boolean;
        buffer: DamageBuffer;
        terminal: Terminal;
        renderChildren(): any;
        setContent(content: string): any;
        getOffsets(): void;
        onRender(): any;
        onBeforeRender(): any;
        onAfterRender(): any;
        render(): any;
        append(...elements: Element[]): void;
        focus(): boolean;
        unfocus(): boolean;
        toggleFocus(): boolean;
    }
    interface Terminal extends Element {
        focusedElement: Element | Terminal;
    }
    interface GridOptions {
        mergeCollidingBoxes: boolean;
    }
    interface ElementOptions {
        parent: Terminal | Element;
        top?: Unit;
        left?: Unit;
        bottom?: Unit;
        right?: Unit;
        content?: string;
        width: Unit;
        height: Unit;
        border?: BorderStyle;
        padding?: Padding;
        title?: string;
    }
}
export { Reactive };
//# sourceMappingURL=types.d.ts.map