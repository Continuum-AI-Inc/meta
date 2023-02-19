import type { Reactive } from "../types.js";
import { ReactiveElement } from "../ReactiveElement.js";
declare class TextInput extends ReactiveElement {
    options: Reactive.ElementOptions;
    constructor(options: Reactive.ElementOptions);
    clear(): void;
    setContent: (content: string) => void;
    onBeforeRender(): void;
    onRender(): void;
}
export { TextInput };
//# sourceMappingURL=TextInput.d.ts.map