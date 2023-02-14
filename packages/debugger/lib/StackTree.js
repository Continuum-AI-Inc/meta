import { StackFrame } from "./StackFrame.js";
var StackTree = (function () {
    function StackTree() {
        this.root = null;
        this.current = null;
    }
    StackTree.prototype.push = function (name, args, line) {
        if (args === void 0) { args = []; }
        var frame = new StackFrame(name, args, line, this.current);
        if (!this.root) {
            this.root = frame;
        }
        this.current = frame;
    };
    StackTree.prototype.pop = function () {
        if (this.current === this.root) {
            this.root = null;
        }
        this.current = this.current.parent;
    };
    StackTree.prototype.toArray = function () {
        var result = [];
        var current = this.current;
        while (current) {
            result.push(current);
            current = current.parent;
        }
        return result.reverse();
    };
    return StackTree;
}());
export { StackTree };
