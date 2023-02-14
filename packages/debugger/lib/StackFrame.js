var StackFrame = (function () {
    function StackFrame(name, args, line, parent) {
        this.name = name;
        this.args = args;
        this.parent = parent;
        this.line = line;
    }
    return StackFrame;
}());
export { StackFrame };
