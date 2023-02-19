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
var Text = (function (_super) {
    __extends(Text, _super);
    function Text(options) {
        var _this = _super.call(this, options) || this;
        _this.options = options;
        return _this;
    }
    Text.prototype.onBeforeRender = function () {
        this.innerWidth = this.outerWidth = UnitToPixels(this.options.width, this.parent.innerWidth);
        this.innerHeight = this.outerHeight = UnitToPixels(this.options.height, this.parent.innerHeight);
        this.getOffsets();
        this.innerX = this.outerX;
        this.innerY = this.outerY;
    };
    Text.prototype.onRender = function () {
        var lines = this.content.split("\n");
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            this.buffer.add(line, this.innerX, this.innerY + i);
        }
    };
    return Text;
}(ReactiveElement));
export { Text };
