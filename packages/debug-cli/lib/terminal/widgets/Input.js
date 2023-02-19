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
import { UnitToPixels } from "../helpers.js";
var TextInput = (function (_super) {
    __extends(TextInput, _super);
    function TextInput(options) {
        var _this = _super.call(this, options) || this;
        _this.options = options;
        return _this;
    }
    TextInput.prototype.parseValues = function () {
        this.innerWidth = this.outerWidth = UnitToPixels(this.options.width, this.parent.innerWidth);
        this.innerHeight = this.outerHeight = UnitToPixels(this.options.height, this.parent.innerHeight);
        this.getOffsets();
        this.innerX = this.outerX;
        this.innerY = this.outerY;
    };
    TextInput.prototype.render = function (buffer) {
        this.parseValues();
        var lines = this.content.split("\n");
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            buffer.add(line, this.innerX, this.innerY + i);
        }
    };
    return TextInput;
}(ReactiveElement));
export { TextInput };
