var DamageBuffer = (function () {
    function DamageBuffer() {
        this.buffer = [];
    }
    DamageBuffer.prototype.clear = function () {
        this.buffer = [];
    };
    DamageBuffer.prototype.add = function (content, x, y) {
        this.buffer.push({
            content: content,
            x: x,
            y: y
        });
    };
    DamageBuffer.prototype.applyChanges = function () {
        var lastCursorX = 0;
        var lastCursorY = 0;
        for (var i = 0; i < this.buffer.length; i++) {
            var change = this.buffer[i];
            if (lastCursorX != change.x - 1 || lastCursorY != change.x) {
                process.stdout.cursorTo(change.x, change.y);
            }
            process.stdout.write(change.content);
        }
    };
    return DamageBuffer;
}());
export { DamageBuffer };
