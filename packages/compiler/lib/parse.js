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
export { parse };
