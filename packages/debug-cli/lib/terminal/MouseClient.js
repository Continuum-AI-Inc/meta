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
import * as net from "net";
import * as fs from "fs";
import EventEmitter from "events";
var GPM_MOVE = 1, GPM_DRAG = 2, GPM_DOWN = 4, GPM_UP = 8;
var GPM_DOUBLE = 32, GPM_MFLAG = 128;
var GPM_REQ_NOPASTE = 3, GPM_HARD = 256;
var GPM_MAGIC = 0x47706d4c;
var GPM_SOCKET = "/dev/gpmctl";
function send_config(socket, Gpm_Connect, callback) {
    var buffer;
    buffer = Buffer.alloc(16);
    buffer.writeUInt16LE(Gpm_Connect.eventMask, 0);
    buffer.writeUInt16LE(Gpm_Connect.defaultMask, 2);
    buffer.writeUInt16LE(Gpm_Connect.minMod, 4);
    buffer.writeUInt16LE(Gpm_Connect.maxMod, 6);
    buffer.writeInt32LE(process.pid, 8);
    buffer.writeInt16LE(Gpm_Connect.vc, 12);
    socket.write(buffer, function () {
        if (callback)
            callback();
    });
}
function parseEvent(raw) {
    var evnt = {
        buttons: raw[0],
        modifiers: raw[1],
        vc: raw.readUInt16LE(2),
        dx: raw.readInt16LE(4),
        dy: raw.readInt16LE(6),
        x: raw.readInt16LE(8),
        y: raw.readInt16LE(10),
        type: raw.readInt16LE(12),
        clicks: raw.readInt32LE(16),
        margin: raw.readInt32LE(20),
        wdx: raw.readInt16LE(24),
        wdy: raw.readInt16LE(26),
    };
    return evnt;
}
var MouseClient = (function (_super) {
    __extends(MouseClient, _super);
    function MouseClient() {
        var _this = _super.call(this) || this;
        var pid = process.pid;
        var path;
        try {
            path = fs.readlinkSync("/proc/" + pid + "/fd/0");
        }
        catch (e) { }
        var tty = /tty[0-9]+$/.exec(path);
        if (tty === null) {
            tty = /[0-9]+$/.exec(path);
        }
        var vc;
        if (tty) {
            tty = tty[0];
            vc = +/[0-9]+$/.exec(tty)[0];
        }
        if (tty) {
            fs.stat(GPM_SOCKET, function (err, stat) {
                if (err) {
                    throw new Error("Couldn't find /dev/gpmctl is the GPM package installed? Do so by running `sudo apt install gpm`.");
                }
                if (!stat.isSocket()) {
                    return;
                }
                var conf = {
                    eventMask: 0xffff,
                    defaultMask: GPM_MOVE | GPM_HARD,
                    minMod: 0,
                    maxMod: 0xffff,
                    pid: pid,
                    vc: vc,
                };
                var gpm = net.createConnection(GPM_SOCKET);
                _this.gpm = gpm;
                gpm.on("connect", function () {
                    send_config(gpm, conf, function () {
                        conf.pid = 0;
                        conf.vc = GPM_REQ_NOPASTE;
                    });
                });
                gpm.on("data", function (packet) {
                    console.log(packet);
                    var evnt = parseEvent(packet);
                    switch (evnt.type & 15) {
                        case GPM_MOVE:
                            if (evnt.dx || evnt.dy) {
                                this.emit("move", evnt.buttons, evnt.modifiers, evnt.x, evnt.y);
                            }
                            if (evnt.wdx || evnt.wdy) {
                                this.emit("mousewheel", evnt.buttons, evnt.modifiers, evnt.x, evnt.y, evnt.wdx, evnt.wdy);
                            }
                            break;
                        case GPM_DRAG:
                            if (evnt.dx || evnt.dy) {
                                this.emit("drag", evnt.buttons, evnt.modifiers, evnt.x, evnt.y);
                            }
                            if (evnt.wdx || evnt.wdy) {
                                this.emit("mousewheel", evnt.buttons, evnt.modifiers, evnt.x, evnt.y, evnt.wdx, evnt.wdy);
                            }
                            break;
                        case GPM_DOWN:
                            this.emit("btndown", evnt.buttons, evnt.modifiers, evnt.x, evnt.y);
                            if (evnt.type & GPM_DOUBLE) {
                                this.emit("dblclick", evnt.buttons, evnt.modifiers, evnt.x, evnt.y);
                            }
                            break;
                        case GPM_UP:
                            this.emit("btnup", evnt.buttons, evnt.modifiers, evnt.x, evnt.y);
                            if (!(evnt.type & GPM_MFLAG)) {
                                this.emit("click", evnt.buttons, evnt.modifiers, evnt.x, evnt.y);
                            }
                            break;
                    }
                });
                gpm.on("error", function () {
                    this.stop();
                });
            });
        }
        return _this;
    }
    MouseClient.prototype.stop = function () {
        if (this.gpm) {
            this.gpm.end();
        }
        delete this.gpm;
    };
    MouseClient.prototype.hasShiftKey = function (mod) {
        return mod & 1 ? true : false;
    };
    MouseClient.prototype.hasCtrlKey = function (mod) {
        return mod & 4 ? true : false;
    };
    MouseClient.prototype.hasMetaKey = function (mod) {
        return mod & 8 ? true : false;
    };
    return MouseClient;
}(EventEmitter));
export { MouseClient };
