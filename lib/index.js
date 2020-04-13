"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const nearley_1 = __importDefault(require("nearley"));
//the grammar module will be available after build step
//@ts-ignore
const grammar_1 = __importDefault(require("./grammar"));
const Chart = __importStar(require("./Chart"));
const RawChart = __importStar(require("./RawChart"));
const Failable_1 = require("./Failable");
const Semantic_1 = __importDefault(require("./Semantic"));
function executeParser(text) {
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
    else if (parser.results.length > 1) {
        console.warn("chart2json: Ambiguous input");
    }
    return Failable_1.Success(parser.results[0]);
}
function parseChart(text, semanticCheck) {
    const shouldCheckSemantics = semanticCheck !== undefined ? semanticCheck : false;
    const parseResult = executeParser(text);
    if (!parseResult.ok) {
        return parseResult;
    }
    const parsedChart = parseResult.value;
    if (shouldCheckSemantics) {
        const semanticError = Semantic_1.default(parsedChart);
        if (semanticError) {
            return Failable_1.Failure({ error: semanticError });
        }
    }
    return Failable_1.Success(parsedChart);
}
class Parser {
    static parseRaw(text, semanticCheck) {
        const parseResult = parseChart(text, semanticCheck);
        if (!parseResult.ok) {
            return parseResult;
        }
        return Failable_1.Success(RawChart.fromParsedChart(parseResult.value));
    }
    static parse(text) {
        const parseResult = parseChart(text, true);
        if (!parseResult.ok) {
            return parseResult;
        }
        return Failable_1.Success(Chart.fromParsedChart(parseResult.value));
    }
}
exports.default = Parser;
