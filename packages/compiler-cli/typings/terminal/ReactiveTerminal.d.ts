interface Box {
    width: number;
    height: number;
    offsetX: number;
    offsetY: number;
    padding: number[] | number;
    title?: string;
    border?: "none" | "slim" | "double";
    borderBackground?: (x: string) => string;
    borderForeground?: (x: string) => string;
    margin?: number[] | number;
}
interface Menu {
    active: boolean;
    callback: () => any;
}
declare type Content = {
    [name: string]: string;
} | string;
declare class ReactiveTerminal {
    width: number;
    height: number;
    layout: {
        [name: string]: Box;
    };
    content: Content;
    private commands;
    private renderPositions;
    private menus;
    private hasMenu;
    constructor();
    private getHeight;
    private getWidth;
    private addResizeListener;
    private onResize;
    newline(): void;
    render(content: Content): void;
    private renderContent;
    write(content: string): void;
    private emitter;
    on(event: "keypress", callback: (...args: any[]) => any): void;
    off(event: "keypress", callback: (...args: any[]) => any): void;
    once(event: "keypress", callback: (...args: any[]) => any): void;
    private emit;
    addCommand(name: string, callback: (...args: any[]) => any): void;
    removeCommand(name: string): void;
    grid(sizes: {
        [name: string]: Box;
    }): void;
    getBoxHeight(name: string): number;
    getBoxWidth(name: string): number;
    position(x: number, y: number): void;
    private renderMenu;
    toggleMenuActive(name: string): void;
    setMenuActive(name: string): void;
    private renderLayout;
    private getBoxCharacters;
    private writeHorizontal;
    private writeVertical;
    add(content: Content): void;
    overwrite(content: Content): void;
    menu(menu: {
        [name: string]: Menu;
    }): void;
    box(name: string, box: Box): void;
    clear(): void;
}
export { ReactiveTerminal };
//# sourceMappingURL=ReactiveTerminal.d.ts.map