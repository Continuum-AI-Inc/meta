function UnitToPixels(unit, baseMeasurement) {
    if (typeof unit == "string") {
        var _a = unit.match(/^([0-9.]+)%([\-+]?)([0-9.]*)$/), _ = _a[0], num = _a[1], op = _a[2], as = _a[3];
        var absolute = (parseFloat(num) / 100) * baseMeasurement;
        if (op && as) {
            if (op == "+") {
                return Math.floor(absolute + parseFloat(as));
            }
            else if (op == "-") {
                return Math.floor(absolute - parseFloat(as));
            }
        }
        return Math.floor(absolute);
    }
    return Math.floor(unit);
}
function expandPadding(padding, width, height) {
    var paddingArray = [];
    if (Array.isArray(padding)) {
        if (padding.length !== 4) {
            throw new Error("Invalid padding length encountered. Expected to see 4 but saw " + padding.length);
        }
        paddingArray.push(UnitToPixels(padding[0], height));
        paddingArray.push(UnitToPixels(padding[1], width));
        paddingArray.push(UnitToPixels(padding[2], height));
        paddingArray.push(UnitToPixels(padding[3], width));
    }
    else {
        var widthUnit = UnitToPixels(padding, width);
        var heightUnit = UnitToPixels(padding, height);
        paddingArray.push(heightUnit, widthUnit, heightUnit, widthUnit);
    }
    return paddingArray;
}
function cursorTo(x, y) {
    process.stdout.cursorTo(x, y);
}
function hideCursor() {
    process.stdout.write("\u001B[?25l");
}
function showCursor() {
    process.stdout.write("\u001B[?25h");
}
export { UnitToPixels, expandPadding, cursorTo, hideCursor, showCursor };
