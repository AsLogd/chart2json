import * as Chart from "./Chart";
import * as RawChart from "./RawChart";
import { Failable } from "./Failable";
export interface ParseError {
    error: any;
}
export default class Parser {
    static parseRaw(text: string, semanticCheck?: boolean): Failable<RawChart.RawChart, ParseError>;
    static parse(text: string): Failable<Chart.Chart, ParseError>;
}
