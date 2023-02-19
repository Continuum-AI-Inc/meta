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
import { ReactiveElement } from "../ReactiveElement.js";
import { cursorTo, hideCursor, showCursor, UnitToPixels } from "../helpers.js";
var TextInput = (function (_super) {
    __extends(TextInput, _super);
    function TextInput(options) {
        var _this = _super.call(this, options) || this;
        _this.options = options;
        _this.setContent = function (content) {
            _this.content = content;
        };
        _this.on("focus", function () {
            showCursor();
            cursorTo(_this.outerX + _this.content.length, _this.outerY);
        });
        _this.on("blur", function () {
            hideCursor();
        });
        _this.on("keypress", function (str, key) {
            if (key.sequence.charCodeAt(0) == 127) {
                if (_this.content.length > 0) {
                    process.stdout.write("\b \b");
                    _this.content = _this.content.substring(0, _this.content.length - 1);
                }
            }
            else if (key.name == "return" || key.name == "enter") {
                var content = _this.content;
                _this.clear();
                _this.emit("submit", content);
            }
            else {
                _this.content += str;
                process.stdout.write(str);
            }
        });
        return _this;
    }
    TextInput.prototype.clear = function () {
        cursorTo(this.outerX + this.content.length, this.outerY);
        process.stdout.write("\b \b".repeat(this.content.length));
        this.setContent("");
    };
    TextInput.prototype.onBeforeRender = function () {
        this.innerWidth = this.outerWidth = UnitToPixels(this.options.width, this.parent.innerWidth);
        this.innerHeight = this.outerHeight = UnitToPixels(this.options.height, this.parent.innerHeight);
        this.getOffsets();
        this.innerX = this.outerX;
        this.innerY = this.outerY;
    };
    TextInput.prototype.onRender = function () {
        this.buffer.add(this.content, this.outerX, this.outerY);
    };
    return TextInput;
}(ReactiveElement));
export { TextInput };
