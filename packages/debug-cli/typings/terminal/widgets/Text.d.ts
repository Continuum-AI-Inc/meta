import type { Reactive } from "../types.js";
import { ReactiveElement } from "../ReactiveElement.js";
declare class Text extends ReactiveElement {
    options: Reactive.ElementOptions;
    constructor(options: Reactive.ElementOptions);
    onBeforeRender(): void;
    onRender(): void;
}
export { Text };
//# sourceMappingURL=Text.d.ts.map