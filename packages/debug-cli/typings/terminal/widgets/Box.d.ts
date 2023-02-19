import type { Reactive } from "../types.js";
import { ReactiveElement } from "../ReactiveElement.js";
declare class Box extends ReactiveElement {
    options: Reactive.ElementOptions;
    borderWidth: number;
    padding: number[];
    constructor(options: Reactive.ElementOptions);
    onBeforeRender(): void;
    onRender(): void;
    getBoxCharacters(border: Reactive.BorderStyle): string[];
}
export { Box };
//# sourceMappingURL=Box.d.ts.map