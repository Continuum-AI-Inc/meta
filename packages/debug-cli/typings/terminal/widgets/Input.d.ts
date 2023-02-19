import { DamageBuffer } from "../DamageBuffer.js";
import type { Reactive } from "../types.js";
import { ReactiveElement } from "../ReactiveElement.js";
declare class TextInput extends ReactiveElement {
    options: Reactive.ElementOptions;
    constructor(options: Reactive.ElementOptions);
    private parseValues;
    render(buffer: DamageBuffer): void;
}
export { TextInput };
//# sourceMappingURL=Input.d.ts.map