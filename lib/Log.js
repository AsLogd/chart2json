"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Reset = "\x1b[0m";
const FgRed = "\x1b[31m";
const FgGreen = "\x1b[32m";
const FgYellow = "\x1b[33m";
const FgWhite = "\x1b[37m";
class Log {
    static info(msg) {
        console.info(FgWhite, msg, Reset);
    }
    static ok(msg) {
        console.info(FgGreen, msg, Reset);
    }
    static warn(msg) {
        console.info(FgYellow, msg, Reset);
    }
    static error(msg) {
        console.info(FgRed, msg, Reset);
    }
    static dump(obj) {
        console.info(obj);
    }
}
exports.default = Log;
