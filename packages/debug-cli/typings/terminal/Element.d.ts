/// <reference types="node" />
import { EventEmitter } from "events";
import { Reactive } from "./types.js";
declare abstract class Element extends EventEmitter implements Reactive.Element {
    constructor(options: Reactive.ElementOptions);
    render(...args: any[]): any;
}
export { Element };
//# sourceMappingURL=Element.d.ts.map