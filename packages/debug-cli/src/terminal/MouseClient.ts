/**
 * gpmclient.js - support the gpm mouse protocol
 * Copyright (c) 2013-2015, Christopher Jeffrey and contributors (MIT License).
 * https://github.com/chjj/blessed
 */

import * as net from "net";
import * as fs from "fs";
import EventEmitter from "events";

var GPM_MOVE = 1,
	GPM_DRAG = 2,
	GPM_DOWN = 4,
	GPM_UP = 8;

var GPM_DOUBLE = 32,
	GPM_MFLAG = 128;

var GPM_REQ_NOPASTE = 3,
	GPM_HARD = 256;

var GPM_MAGIC = 0x47706d4c;
var GPM_SOCKET = "/dev/gpmctl";

// typedef struct Gpm_Connect {
//   unsigned short eventMask, defaultMask;
//   unsigned short minMod, maxMod;
//   int pid;
//   int vc;
// } Gpm_Connect;

function send_config(socket: net.Socket, Gpm_Connect, callback) {
	var buffer: Buffer;
		buffer = Buffer.alloc(16);
		buffer.writeUInt16LE(Gpm_Connect.eventMask, 0);
		buffer.writeUInt16LE(Gpm_Connect.defaultMask, 2);
		buffer.writeUInt16LE(Gpm_Connect.minMod, 4);
		buffer.writeUInt16LE(Gpm_Connect.maxMod, 6);
		buffer.writeInt32LE(process.pid, 8);
		buffer.writeInt16LE(Gpm_Connect.vc, 12);
	socket.write(buffer, function () {
		if (callback) callback();
	});
}

// typedef struct Gpm_Event {
//   unsigned char buttons, modifiers;  // try to be a multiple of 4
//   unsigned short vc;
//   short dx, dy, x, y; // displacement x,y for this event, and absolute x,y
//   enum Gpm_Etype type;
//    clicks e.g. double click are determined by time-based processing
//   int clicks;
//   enum Gpm_Margin margin;
//    wdx/y: displacement of wheels in this event. Absolute values are not
//    required, because wheel movement is typically used for scrolling
//    or selecting fields, not for cursor positioning. The application
//    can determine when the end of file or form is reached, and not
//    go any further.
//    A single mouse will use wdy, "vertical scroll" wheel.
//   short wdx, wdy;
// } Gpm_Event;

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

class MouseClient extends EventEmitter {
	private gpm: net.Socket;

	public constructor() {
		super();
		var pid = process.pid;

		// check tty for /dev/tty[n]
		let path: string;

		try {
			path = fs.readlinkSync("/proc/" + pid + "/fd/0");
		} catch (e) {}

		var tty: string | RegExpExecArray = /tty[0-9]+$/.exec(path);
		if (tty === null) {
			tty = /[0-9]+$/.exec(path);
		}

		var vc;
		if (tty) {
			tty = tty[0];
			vc = +/[0-9]+$/.exec(tty)[0];
		}

		

		if (tty) {
			fs.stat(GPM_SOCKET, (err, stat) => {
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
				this.gpm = gpm;
				

				gpm.on("connect", function () {
					send_config(gpm, conf, function () {
						conf.pid = 0;
						conf.vc = GPM_REQ_NOPASTE;
						//send_config(gpm, conf);
					});
				});

				gpm.on("data", function (packet) {
					console.log(packet);
					
					var evnt = parseEvent(packet);
					switch (evnt.type & 15) {
						case GPM_MOVE:
							if (evnt.dx || evnt.dy) {
								this.emit(
									"move",
									evnt.buttons,
									evnt.modifiers,
									evnt.x,
									evnt.y
								);
							}
							if (evnt.wdx || evnt.wdy) {
								this.emit(
									"mousewheel",
									evnt.buttons,
									evnt.modifiers,
									evnt.x,
									evnt.y,
									evnt.wdx,
									evnt.wdy
								);
							}
							break;
						case GPM_DRAG:
							if (evnt.dx || evnt.dy) {
								this.emit(
									"drag",
									evnt.buttons,
									evnt.modifiers,
									evnt.x,
									evnt.y
								);
							}
							if (evnt.wdx || evnt.wdy) {
								this.emit(
									"mousewheel",
									evnt.buttons,
									evnt.modifiers,
									evnt.x,
									evnt.y,
									evnt.wdx,
									evnt.wdy
								);
							}
							break;
						case GPM_DOWN:
							this.emit(
								"btndown",
								evnt.buttons,
								evnt.modifiers,
								evnt.x,
								evnt.y
							);
							if (evnt.type & GPM_DOUBLE) {
								this.emit(
									"dblclick",
									evnt.buttons,
									evnt.modifiers,
									evnt.x,
									evnt.y
								);
							}
							break;
						case GPM_UP:
							this.emit(
								"btnup",
								evnt.buttons,
								evnt.modifiers,
								evnt.x,
								evnt.y
							);
							if (!(evnt.type & GPM_MFLAG)) {
								this.emit(
									"click",
									evnt.buttons,
									evnt.modifiers,
									evnt.x,
									evnt.y
								);
							}
							break;
					}
				});

				gpm.on("error", function () {
					this.stop();
				});
			});
		}
	}

	public stop() {
		if (this.gpm) {
			this.gpm.end();
		}
		delete this.gpm;
	}

	public hasShiftKey(mod: number) {
		return mod & 1 ? true : false;
	}

	public hasCtrlKey(mod: number) {
		return mod & 4 ? true : false;
	}

	public hasMetaKey(mod: number) {
		return mod & 8 ? true : false;
	}
}

export { MouseClient };
