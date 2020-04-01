import { Failable } from "./Failable";
export interface Chart {
    song: any;
}
export interface ParseError {
    error: any;
}
export default class Parser {
    static parse(text: string): Failable<Chart, ParseError>;
}
