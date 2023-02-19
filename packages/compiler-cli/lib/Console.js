var PrettyConsole = (function () {
    function PrettyConsole() {
        this.closeByNewLine = true;
        this.useIcons = true;
        this.logsTitle = "LOGS";
        this.warningsTitle = "WARNINGS";
        this.errorsTitle = "ERRORS";
        this.informationsTitle = "INFORMATIONS";
        this.successesTitle = "SUCCESS";
        this.debugsTitle = "DEBUG";
        this.assertsTitle = "ASSERT";
    }
    PrettyConsole.prototype.getColor = function (foregroundColor, backgroundColor) {
        if (foregroundColor === void 0) { foregroundColor = ""; }
        if (backgroundColor === void 0) { backgroundColor = ""; }
        var fgc = "\x1b[37m";
        switch (foregroundColor.trim().toLowerCase()) {
            case "black":
                fgc = "\x1b[30m";
                break;
            case "red":
                fgc = "\x1b[31m";
                break;
            case "green":
                fgc = "\x1b[32m";
                break;
            case "yellow":
                fgc = "\x1b[33m";
                break;
            case "blue":
                fgc = "\x1b[34m";
                break;
            case "magenta":
                fgc = "\x1b[35m";
                break;
            case "cyan":
                fgc = "\x1b[36m";
                break;
            case "white":
                fgc = "\x1b[37m";
                break;
        }
        var bgc = "";
        switch (backgroundColor.trim().toLowerCase()) {
            case "black":
                bgc = "\x1b[40m";
                break;
            case "red":
                bgc = "\x1b[44m";
                break;
            case "green":
                bgc = "\x1b[44m";
                break;
            case "yellow":
                bgc = "\x1b[43m";
                break;
            case "blue":
                bgc = "\x1b[44m";
                break;
            case "magenta":
                bgc = "\x1b[45m";
                break;
            case "cyan":
                bgc = "\x1b[46m";
                break;
            case "white":
                bgc = "\x1b[47m";
                break;
        }
        return "".concat(fgc).concat(bgc);
    };
    PrettyConsole.prototype.getColorReset = function () {
        return "\x1b[0m";
    };
    PrettyConsole.prototype.print = function (foregroundColor, backgroundColor) {
        if (foregroundColor === void 0) { foregroundColor = "white"; }
        if (backgroundColor === void 0) { backgroundColor = "black"; }
        var strings = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            strings[_i - 2] = arguments[_i];
        }
        var c = this.getColor(foregroundColor, backgroundColor);
        strings = strings.map(function (item) {
            if (typeof item === "object")
                item = JSON.stringify(item);
            return item;
        });
        console.log(c, strings.join(""), this.getColorReset());
        if (this.closeByNewLine) {
            console.log("");
        }
    };
    PrettyConsole.prototype.clear = function () {
        console.clear();
    };
    PrettyConsole.prototype.log = function () {
        var _this = this;
        var strings = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            strings[_i] = arguments[_i];
        }
        var fg = "white";
        var bg = "";
        var icon = "\u25ce";
        var groupTile = " ".concat(this.logsTitle);
        if (strings.length > 1) {
            var c = this.getColor(fg, bg);
            console.group(c, (this.useIcons ? icon : "") + groupTile);
            var nl = this.closeByNewLine;
            this.closeByNewLine = false;
            strings.forEach(function (item) {
                _this.print(fg, bg, item, _this.getColorReset());
            });
            this.closeByNewLine = nl;
            console.groupEnd();
            if (nl) {
                console.log();
            }
        }
        else {
            this.print(fg, bg, strings.map(function (item) {
                return "".concat(_this.useIcons ? "".concat(icon, " ") : "").concat(item);
            }));
        }
    };
    PrettyConsole.prototype.warn = function () {
        var _this = this;
        var strings = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            strings[_i] = arguments[_i];
        }
        var fg = "yellow";
        var bg = "";
        var icon = "\u26a0";
        var groupTile = " ".concat(this.warningsTitle);
        if (strings.length > 1) {
            var c = this.getColor(fg, bg);
            console.group(c, (this.useIcons ? icon : "") + groupTile);
            var nl = this.closeByNewLine;
            this.closeByNewLine = false;
            strings.forEach(function (item) {
                _this.print(fg, bg, item, _this.getColorReset());
            });
            this.closeByNewLine = nl;
            console.groupEnd();
            if (nl) {
                console.log();
            }
        }
        else {
            this.print(fg, bg, strings.map(function (item) {
                return "".concat(_this.useIcons ? "".concat(icon, " ") : "").concat(item);
            }));
        }
    };
    PrettyConsole.prototype.error = function () {
        var _this = this;
        var strings = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            strings[_i] = arguments[_i];
        }
        var fg = "red";
        var bg = "";
        var icon = "\u26D4";
        var groupTile = " ".concat(this.errorsTitle);
        if (strings.length > 1) {
            var c = this.getColor(fg, bg);
            console.group(c, (this.useIcons ? icon : "") + groupTile);
            var nl = this.closeByNewLine;
            this.closeByNewLine = false;
            strings.forEach(function (item) {
                _this.print(fg, bg, item);
            });
            this.closeByNewLine = nl;
            console.groupEnd();
            if (nl) {
                console.log();
            }
        }
        else {
            this.print(fg, bg, strings.map(function (item) {
                return "".concat(_this.useIcons ? "".concat(icon, " ") : "").concat(item);
            }));
        }
    };
    PrettyConsole.prototype.info = function () {
        var _this = this;
        var strings = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            strings[_i] = arguments[_i];
        }
        var fg = "blue";
        var bg = "";
        var icon = "\u2139";
        var groupTile = " ".concat(this.informationsTitle);
        if (strings.length > 1) {
            var c = this.getColor(fg, bg);
            console.group(c, (this.useIcons ? icon : "") + groupTile);
            var nl = this.closeByNewLine;
            this.closeByNewLine = false;
            strings.forEach(function (item) {
                _this.print(fg, bg, item);
            });
            this.closeByNewLine = nl;
            console.groupEnd();
            if (nl) {
                console.log();
            }
        }
        else {
            this.print(fg, bg, strings.map(function (item) {
                return "".concat(_this.useIcons ? "".concat(icon, " ") : "").concat(item);
            }));
        }
    };
    PrettyConsole.prototype.success = function () {
        var _this = this;
        var strings = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            strings[_i] = arguments[_i];
        }
        var fg = "green";
        var bg = "";
        var icon = "\u2713";
        var groupTile = " ".concat(this.successesTitle);
        if (strings.length > 1) {
            var c = this.getColor(fg, bg);
            console.group(c, (this.useIcons ? icon : "") + groupTile);
            var nl = this.closeByNewLine;
            this.closeByNewLine = false;
            strings.forEach(function (item) {
                _this.print(fg, bg, item);
            });
            this.closeByNewLine = nl;
            console.groupEnd();
            if (nl) {
                console.log();
            }
        }
        else {
            this.print(fg, bg, strings.map(function (item) {
                return "".concat(_this.useIcons ? "".concat(icon, " ") : "").concat(item);
            }));
        }
    };
    PrettyConsole.prototype.debug = function () {
        var _this = this;
        var strings = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            strings[_i] = arguments[_i];
        }
        var fg = "magenta";
        var bg = "";
        var icon = "\u1367";
        var groupTile = " ".concat(this.debugsTitle);
        if (strings.length > 1) {
            var c = this.getColor(fg, bg);
            console.group(c, (this.useIcons ? icon : "") + groupTile);
            var nl = this.closeByNewLine;
            this.closeByNewLine = false;
            strings.forEach(function (item) {
                _this.print(fg, bg, item);
            });
            this.closeByNewLine = nl;
            console.groupEnd();
            if (nl) {
                console.log();
            }
        }
        else {
            this.print(fg, bg, strings.map(function (item) {
                return "".concat(_this.useIcons ? "".concat(icon, " ") : "").concat(item);
            }));
        }
    };
    PrettyConsole.prototype.assert = function () {
        var _this = this;
        var strings = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            strings[_i] = arguments[_i];
        }
        var fg = "cyan";
        var bg = "";
        var icon = "\u0021";
        var groupTile = " ".concat(this.assertsTitle);
        if (strings.length > 1) {
            var c = this.getColor(fg, bg);
            console.group(c, (this.useIcons ? icon : "") + groupTile);
            var nl = this.closeByNewLine;
            this.closeByNewLine = false;
            strings.forEach(function (item) {
                _this.print(fg, bg, item);
            });
            this.closeByNewLine = nl;
            console.groupEnd();
            if (nl) {
                console.log();
            }
        }
        else {
            this.print(fg, bg, strings.map(function (item) {
                return "".concat(_this.useIcons ? "".concat(icon, " ") : "").concat(item);
            }));
        }
    };
    return PrettyConsole;
}());
export { PrettyConsole };
