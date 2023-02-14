var parse = function (text) {
    var program = [];
    var lines = text.split("\n");
    for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
        var line = lines_1[_i];
        if (line.trim().length == 0) {
            continue;
        }
        if (line[0] == " ") {
            program.push(parseInstruction(line));
        }
        else {
            program[parseLabel(line)] = program.length;
        }
    }
    return program;
};
function parseInstruction(line) {
    var instruction = line.trim();
    var idx = instruction.indexOf(" ");
    if (idx === -1) {
        return [instruction];
    }
    else {
        var argument = instruction
            .slice(idx)
            .trim()
            .replace(/^["'](.*)['"]$/, "$1");
        return [instruction.slice(0, idx), argument];
    }
}
function parseLabel(line) {
    return line.trim();
}
var Builder = (function () {
    function Builder() {
        this.text = "       ";
    }
    Builder.prototype.copy = function (string) {
        this.text += string;
    };
    Builder.prototype.label = function () {
        this.text = this.text.slice(0, -7);
    };
    Builder.prototype.newLine = function () {
        this.text += "\n       ";
    };
    Builder.prototype.getProgram = function () {
        return parse(this.text);
    };
    return Builder;
}());
export { Builder, parse };
