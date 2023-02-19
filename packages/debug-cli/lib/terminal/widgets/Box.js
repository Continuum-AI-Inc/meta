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
import { expandPadding, UnitToPixels } from "../helpers.js";
var Box = (function (_super) {
    __extends(Box, _super);
    function Box(options) {
        var _this = _super.call(this, options) || this;
        _this.options = options;
        return _this;
    }
    Box.prototype.onBeforeRender = function () {
        this.borderWidth = this.options.border == "none" ? 0 : 1;
        this.outerWidth = UnitToPixels(this.options.width, this.parent.innerWidth);
        this.outerHeight = UnitToPixels(this.options.height, this.parent.innerHeight);
        this.padding = expandPadding(this.options.padding, this.outerWidth, this.outerHeight);
        this.innerHeight = this.outerHeight - this.padding[0] - this.padding[2] - this.borderWidth * 2;
        this.innerWidth = this.outerWidth - this.padding[1] - this.padding[3] - this.borderWidth * 2;
        this.getOffsets();
        this.innerX = this.outerX + this.borderWidth + this.padding[3];
        this.innerY = this.outerY + this.borderWidth + this.padding[0];
        if (this.options.border !== "none") {
            this.innerHeight -= 2;
            this.innerWidth -= 2;
        }
    };
    Box.prototype.onRender = function () {
        if (this.options.border !== "none") {
            var boxCharacters = this.getBoxCharacters(this.options.border);
            for (var i = 0; i < this.outerHeight; i++) {
                var x = this.outerX, y = this.outerY + i;
                if (i == 0) {
                    this.buffer.add(boxCharacters[2] +
                        boxCharacters[0].repeat(this.outerWidth - 2) +
                        boxCharacters[3], x, y);
                }
                else if (i == this.outerHeight - 1) {
                    this.buffer.add(boxCharacters[4] +
                        boxCharacters[0].repeat(this.outerWidth - 2) +
                        boxCharacters[5], x, y);
                }
                else {
                    this.buffer.add(boxCharacters[1], x, y);
                    this.buffer.add(boxCharacters[1], x + this.outerWidth - 1, y);
                }
            }
        }
        var lines = this.content.split("\n");
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            this.buffer.add(line, this.innerX, this.innerY + i);
        }
    };
    Box.prototype.getBoxCharacters = function (border) {
        var borderCharacterMap = {
            "slim": ["─", "│", "┌", "┐", "└", "┘"],
            "double": ["═", "║", "╔", "╗", "╚", "╝"]
        };
        return borderCharacterMap[border];
    };
    return Box;
}(ReactiveElement));
export { Box };
