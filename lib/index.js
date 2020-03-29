"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nearley_1 = __importDefault(require("nearley"));
//the chart module will be available after build step
//@ts-ignore
const chart_1 = __importDefault(require("./chart"));
const failable_1 = require("./failable");
class Parser {
    static parse(text) {
        const parser = new nearley_1.default.Parser(nearley_1.default.Grammar.fromCompiled(chart_1.default));
        try {
            parser.feed(text);
        }
        catch (err) {
            return failable_1.Failure({ error: err });
        }
        if (parser.results.length < 1) {
            return failable_1.Failure({ error: "Invalid Chart file" });
        }
        return failable_1.Success(parser.results[0]);
    }
}
exports.default = Parser;
