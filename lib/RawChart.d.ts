import * as Meta from "./Meta";
export interface RawChart {
    sections: RawSection[];
}
export interface RawSection {
    title: string;
    content: RawContent;
}
export interface RawContent {
    [key: string]: RawAtom[];
}
export declare type RawAtom = string | number;
export declare function fromParsedChart(pc: Meta.ParsedChart): RawChart;
