/// <reference types="node" />
import EventEmitter from "events";
declare class MouseClient extends EventEmitter {
    private gpm;
    constructor();
    stop(): void;
    hasShiftKey(mod: number): boolean;
    hasCtrlKey(mod: number): boolean;
    hasMetaKey(mod: number): boolean;
}
export { MouseClient };
//# sourceMappingURL=MouseClient.d.ts.map