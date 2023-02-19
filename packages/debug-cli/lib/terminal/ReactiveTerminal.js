var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import readline from "readline";
import { DamageBuffer } from "./DamageBuffer.js";
import { ReactiveElement } from "./ReactiveElement.js";
import { hideCursor, showCursor } from "./helpers.js";
function chunkSubstr(str, size) {
    var numChunks = Math.ceil(str.length / size);
    var chunks = new Array(numChunks);
    for (var i = 0; i < numChunks; ++i) {
        chunks[i] = str.substring(i * size, size * (i + 1));
    }
    return chunks;
}
function clearScreen() {
    process.stdout.write("\u001Bc");
    process.stdout.write("\x1b[0f");
}
var Terminal = (function (_super) {
    __extends(Terminal, _super);
    function Terminal() {
        var _this = _super.call(this, {
            parent: null,
            width: process.stdout.columns,
            height: process.stdout.rows,
            left: 0,
            top: 0
        }) || this;
        _this.outerX = 0;
        _this.outerY = 0;
        _this.innerX = 0;
        _this.innerY = 0;
        _this.children = [];
        _this.buffer = new DamageBuffer();
        _this.terminal = _this;
        _this.render = function () {
            for (var _i = 0, _a = _this.children; _i < _a.length; _i++) {
                var element = _a[_i];
                element.render();
            }
            _this.buffer.applyChanges();
        };
        _this.getDimensions();
        clearScreen();
        hideCursor();
        readline.emitKeypressEvents(process.stdin);
        process.stdin.setRawMode(true);
        process.stdin.on("keypress", function (str, key) {
            if (key.ctrl && key.name == "c") {
                process.exit(1);
            }
            _this.focusedElement.emit("keypress", str, key);
        });
        process.on("exit", function () {
            clearScreen();
            showCursor();
        });
        _this.addResizeListener();
        return _this;
    }
    Terminal.prototype.getOffsets = function () {
        this.outerX = 0;
        this.outerY = 0;
    };
    Terminal.prototype.getDimensions = function () {
        this.outerHeight = this.innerHeight = process.stdout.rows;
        this.outerWidth = this.innerWidth = process.stdout.columns;
    };
    Terminal.prototype.addResizeListener = function () {
        var _this = this;
        process.stdout.on("resize", function () {
            _this.getDimensions();
            _this.buffer.clear();
            clearScreen();
            _this.render();
        });
    };
    return Terminal;
}(ReactiveElement));
export { Terminal };
