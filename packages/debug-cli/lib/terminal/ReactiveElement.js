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
import { EventEmitter } from "events";
import { UnitToPixels } from "./helpers.js";
var ReactiveElement = (function (_super) {
    __extends(ReactiveElement, _super);
    function ReactiveElement(options) {
        var _this = _super.call(this) || this;
        _this.options = options;
        _this.outerWidth = 0;
        _this.outerHeight = 0;
        _this.innerWidth = 0;
        _this.innerHeight = 0;
        _this.outerX = 0;
        _this.outerY = 0;
        _this.innerX = 0;
        _this.innerY = 0;
        _this.padding = 0;
        _this.children = [];
        _this.content = "";
        _this.render = function () {
            _this.onBeforeRender();
            _this.onRender();
            _this.renderChildren();
            _this.onAfterRender();
        };
        _this.renderChildren = function () {
            for (var _i = 0, _a = _this.children; _i < _a.length; _i++) {
                var child = _a[_i];
                child.render();
            }
        };
        _this.setContent = function (content) {
            _this.content = content;
            _this.render();
        };
        _this.append = function () {
            var elements = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                elements[_i] = arguments[_i];
            }
            for (var _a = 0, elements_1 = elements; _a < elements_1.length; _a++) {
                var element = elements_1[_a];
                _this.children.push(element);
                element.buffer = _this.buffer;
                element.terminal = _this.terminal;
                element.parent = _this;
            }
        };
        _this.content = options.content || "";
        if (options.parent) {
            options.parent.append(_this);
        }
        return _this;
    }
    ReactiveElement.prototype.focus = function () {
        if (this.terminal.focusedElement) {
            this.terminal.focusedElement.emit("blur");
        }
        this.terminal.focusedElement = this;
        this.emit("focus");
        return this.focused = true;
    };
    ReactiveElement.prototype.toggleFocus = function () {
        if (this.terminal.focusedElement) {
            this.terminal.focusedElement.emit("blur");
        }
        this.focused = !this.focused;
        this.terminal.focusedElement = this.focused ? this : null;
        if (this.focused) {
            this.emit("focus");
        }
        return this.focused;
    };
    ReactiveElement.prototype.unfocus = function () {
        if (this.terminal.focusedElement) {
            this.terminal.focusedElement.emit("blur");
        }
        this.terminal.focusedElement = null;
        return this.focused = false;
    };
    ReactiveElement.prototype.onRender = function () {
        throw new Error("Method not implemented.");
    };
    ReactiveElement.prototype.onBeforeRender = function () {
    };
    ReactiveElement.prototype.onAfterRender = function () {
    };
    ReactiveElement.prototype.getOffsets = function () {
        if (this.options.left !== undefined) {
            this.outerX = UnitToPixels(this.options.left, this.parent.innerWidth) + this.parent.innerX;
        }
        if (this.options.top !== undefined) {
            this.outerY = UnitToPixels(this.options.top, this.parent.innerHeight) + this.parent.innerY;
        }
        if (this.options.right !== undefined) {
            var rightAbsolute = UnitToPixels(this.options.right, this.parent.innerWidth);
            this.outerX = this.parent.innerWidth - this.outerWidth - rightAbsolute + this.parent.innerX;
        }
        if (this.options.bottom !== undefined) {
            var bottomAbsolute = UnitToPixels(this.options.bottom, this.parent.innerHeight);
            this.outerY = this.parent.innerHeight - this.outerHeight - bottomAbsolute + this.parent.innerY;
        }
    };
    return ReactiveElement;
}(EventEmitter));
export { ReactiveElement };
