import { Failable } from "./Failable";
import { Chart } from "./Chart";
export interface ParseError {
    error: any;
}
export default class Parser {
    static parse(text: string): Failable<Chart, ParseError>;
}
