declare class PrettyConsole {
    closeByNewLine: boolean;
    useIcons: boolean;
    logsTitle: string;
    warningsTitle: string;
    errorsTitle: string;
    informationsTitle: string;
    successesTitle: string;
    debugsTitle: string;
    assertsTitle: string;
    constructor();
    private getColor;
    private getColorReset;
    print(foregroundColor?: string, backgroundColor?: string, ...strings: any): void;
    clear(): void;
    log(...strings: any): void;
    warn(...strings: any): void;
    error(...strings: any): void;
    info(...strings: any): void;
    success(...strings: any): void;
    debug(...strings: any): void;
    assert(...strings: any): void;
}
export { PrettyConsole };
//# sourceMappingURL=Console.d.ts.map