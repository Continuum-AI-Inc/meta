var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import readline from "readline";
import { EventEmitter } from "node:events";
import chalk from "chalk";
function chunkSubstr(str, size) {
    var numChunks = Math.ceil(str.length / size);
    var chunks = new Array(numChunks);
    for (var i = 0; i < numChunks; ++i) {
        chunks[i] = str.substring(i * size, size * (i + 1));
    }
    return chunks;
}
var ReactiveTerminal = (function () {
    function ReactiveTerminal() {
        var _this = this;
        this.commands = {};
        this.emitter = new EventEmitter();
        this.width = this.getWidth();
        this.height = this.getHeight();
        this.renderPositions = {};
        readline.emitKeypressEvents(process.stdin);
        process.stdin.setRawMode(false);
        process.stdin.on("keypress", function (str, key) {
            if (key.ctrl && key.name == "c") {
                process.exit(1);
            }
            else {
                _this.emit("keypress", key);
            }
        });
        var rl = readline.createInterface({
            input: process.stdin
        });
        rl.on("line", function (line) {
            var command = line.split(" ")[0];
            if (_this.commands.hasOwnProperty(command)) {
                _this.commands[command](line);
            }
            console.clear();
            _this.render(_this.content);
        });
        this.addResizeListener();
    }
    ReactiveTerminal.prototype.getHeight = function () {
        return process.stdout.rows;
    };
    ReactiveTerminal.prototype.getWidth = function () {
        return process.stdout.columns;
    };
    ReactiveTerminal.prototype.addResizeListener = function () {
        process.stdout.on("resize", this.onResize.bind(this));
    };
    ReactiveTerminal.prototype.onResize = function () {
        this.height = this.getHeight();
        this.width = this.getWidth();
        this.clear();
        this.render(this.content);
    };
    ReactiveTerminal.prototype.newline = function () {
        this.write("\n");
    };
    ReactiveTerminal.prototype.render = function (content) {
        this.content = content;
        this.renderMenu();
        this.renderLayout();
        this.renderContent(content);
        this.newline();
        this.position(0, this.height + 1);
    };
    ReactiveTerminal.prototype.renderContent = function (content) {
        if (typeof content == "string") {
            this.write(content);
        }
        else {
            var _loop_1 = function (name_1) {
                var position = this_1.renderPositions[name_1];
                if (!position || !content[name_1]) {
                    return "continue";
                }
                var lines = content[name_1].split("\n");
                lines = lines
                    .map(function (x) { return chunkSubstr(x, position.width); })
                    .flat(Infinity);
                for (var i = 0; i < lines.length; i++) {
                    var line = lines[i];
                    readline.cursorTo(process.stdout, position.x, position.y + i);
                    this_1.write(line);
                }
            };
            var this_1 = this;
            for (var name_1 in content) {
                _loop_1(name_1);
            }
        }
    };
    ReactiveTerminal.prototype.write = function (content) {
        process.stdout.write(content);
    };
    ReactiveTerminal.prototype.on = function (event, callback) {
        this.emitter.on(event, callback);
    };
    ReactiveTerminal.prototype.off = function (event, callback) {
        this.emitter.off(event, callback);
    };
    ReactiveTerminal.prototype.once = function (event, callback) {
        this.emitter.once(event, callback);
    };
    ReactiveTerminal.prototype.emit = function (event) {
        var _a;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        (_a = this.emitter).emit.apply(_a, __spreadArray([event], args, false));
    };
    ReactiveTerminal.prototype.addCommand = function (name, callback) {
        this.commands[name] = callback;
    };
    ReactiveTerminal.prototype.removeCommand = function (name) {
        delete this.commands[name];
    };
    ReactiveTerminal.prototype.grid = function (sizes) {
        this.clear();
        this.layout = sizes;
        this.renderLayout();
    };
    ReactiveTerminal.prototype.getBoxHeight = function (name) {
        if (this.renderPositions.hasOwnProperty(name)) {
            return this.renderPositions[name].height;
        }
    };
    ReactiveTerminal.prototype.getBoxWidth = function (name) {
        if (this.renderPositions.hasOwnProperty(name)) {
            return this.renderPositions[name].width;
        }
    };
    ReactiveTerminal.prototype.position = function (x, y) {
        readline.cursorTo(process.stdout, x, y);
    };
    ReactiveTerminal.prototype.renderMenu = function () {
        var text = "";
        for (var name_2 in this.menus) {
            var active = this.menus[name_2].active;
            if (active) {
                text += chalk.bgGreenBright(name_2);
            }
            else {
                text += chalk.bgWhiteBright(name_2);
            }
            text += chalk.bgWhiteBright(" ");
        }
        text += chalk.reset();
        this.writeHorizontal(chalk.black(text), 0, 0);
    };
    ReactiveTerminal.prototype.toggleMenuActive = function (name) {
        if (this.menus.hasOwnProperty(name)) {
            this.menus[name].active = !this.menus[name].active;
            this.render(this.content);
        }
    };
    ReactiveTerminal.prototype.setMenuActive = function (name) {
        if (this.menus.hasOwnProperty(name)) {
            this.menus[name].active = true;
            this.render(this.content);
        }
    };
    ReactiveTerminal.prototype.renderLayout = function () {
        for (var name_3 in this.layout) {
            var _a = this.layout[name_3], widthPercent = _a.width, heightPercent = _a.height, offsetX = _a.offsetX, offsetY = _a.offsetY, _b = _a.padding, padding = _b === void 0 ? 0 : _b, _c = _a.title, title = _c === void 0 ? "" : _c, _d = _a.border, border = _d === void 0 ? "slim" : _d, _e = _a.borderBackground, borderBackground = _e === void 0 ? chalk.bgBlack : _e, _f = _a.borderForeground, borderForeground = _f === void 0 ? chalk.white : _f, _g = _a.margin, margin = _g === void 0 ? 0 : _g;
            var marginArray = Array.isArray(margin)
                ? margin
                : Array(4).fill(margin || 0);
            var paddingArray = Array.isArray(padding)
                ? padding
                : Array(4).fill(padding || 0);
            var charWidth = Math.floor(this.width * (widthPercent / 100)) -
                marginArray[1] -
                marginArray[3];
            var charHeight = Math.floor(this.height * (heightPercent / 100)) -
                marginArray[2] -
                marginArray[0];
            var borderWidth = border == "none" ? 0 : 1;
            offsetX = Math.floor(this.width * (offsetX / 100)) + marginArray[3];
            offsetY = Math.floor(this.height * (offsetY / 100)) + marginArray[0];
            offsetY += this.hasMenu ? 1 : 0;
            this.renderPositions[name_3] = {
                x: offsetX + paddingArray[3] + borderWidth,
                y: offsetY + paddingArray[0] + borderWidth,
                width: charWidth - paddingArray[1] - paddingArray[3],
                height: charHeight - paddingArray[0] - paddingArray[2]
            };
            if (border == "none") {
                continue;
            }
            var boxCharacters = this.getBoxCharacters(border);
            boxCharacters = boxCharacters.map(function (x) { return borderBackground(borderForeground(x)); });
            for (var i = 0; i < charHeight; i++) {
                readline.cursorTo(process.stdout, offsetX, offsetY + i);
                if (i == 0) {
                    this.write(boxCharacters[2] +
                        boxCharacters[0].repeat(charWidth - 2) +
                        boxCharacters[3]);
                }
                else if (i == charHeight - 1) {
                    this.write(boxCharacters[4] +
                        boxCharacters[0].repeat(charWidth - 2) +
                        boxCharacters[5]);
                }
                else {
                    this.write(boxCharacters[1]);
                    readline.cursorTo(process.stdout, offsetX + charWidth - 1, offsetY + i);
                    this.write(boxCharacters[1]);
                }
            }
            if (title) {
                this.writeHorizontal(borderBackground(borderForeground(title)), offsetX + 2, offsetY);
            }
        }
    };
    ReactiveTerminal.prototype.getBoxCharacters = function (border) {
        var borderCharacterMap = {
            "slim": ["─", "│", "┌", "┐", "└", "┘"],
            "double": ["═", "║", "╔", "╗", "╚", "╝"]
        };
        return borderCharacterMap[border];
    };
    ReactiveTerminal.prototype.writeHorizontal = function (content, x, y) {
        this.position(x, y);
        this.write(content);
    };
    ReactiveTerminal.prototype.writeVertical = function (content, x, y) {
        for (var i = 0; i < content.length; i++) {
            var char = content[i];
            this.position(x, y + i);
            this.write(char);
        }
    };
    ReactiveTerminal.prototype.add = function (content) {
        if (typeof content == "string") {
            this.content += content;
        }
        else {
            for (var name_4 in content) {
                var value = content[name_4];
                if (!this.content.hasOwnProperty(name_4)) {
                    this.content[name_4] = value;
                }
                else {
                    this.content[name_4] += value;
                }
            }
        }
        this.render(this.content);
    };
    ReactiveTerminal.prototype.overwrite = function (content) {
        if (typeof content == "string") {
            this.content = content;
        }
        else {
            this.content = Object.assign(this.content || {}, content);
        }
        this.render(this.content);
    };
    ReactiveTerminal.prototype.menu = function (menu) {
        this.menus = menu;
        this.hasMenu = true;
        this.render(this.content);
    };
    ReactiveTerminal.prototype.box = function (name, box) {
        this.layout[name] = box;
        this.render(this.content);
    };
    ReactiveTerminal.prototype.clear = function () {
        this.write("\x1B[2J");
        readline.cursorTo(process.stdout, 0, 0);
        readline.clearScreenDown(process.stdout);
    };
    return ReactiveTerminal;
}());
export { ReactiveTerminal };
