"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nearley_1 = __importDefault(require("nearley"));
//the grammar module will be available after build step
//@ts-ignore
const grammar_1 = __importDefault(require("./grammar"));
const Failable_1 = require("./Failable");
const Semantic_1 = __importDefault(require("./Semantic"));
class Parser {
    static parse(text) {
        const parser = new nearley_1.default.Parser(nearley_1.default.Grammar.fromCompiled(grammar_1.default));
        try {
            parser.feed(text);
        }
        catch (err) {
            return Failable_1.Failure({ error: err });
        }
        if (parser.results.length < 1) {
            return Failable_1.Failure({ error: "Invalid Chart file" });
        }
        const semanticError = Semantic_1.default(parser.results[0]);
        if (semanticError) {
            return Failable_1.Failure({ error: semanticError });
        }
        return Failable_1.Success(parser.results[0]);
    }
}
exports.default = Parser;
