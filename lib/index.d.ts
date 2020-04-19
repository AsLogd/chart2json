import * as Chart from "./Chart";
import * as RawChart from "./RawChart";
import { ErrorObject } from "./Error";
import { Failable } from "./Failable";
export * as Meta from "./Meta";
export * as Chart from "./Chart";
export * as RawChart from "./RawChart";
export * as Failable from "./Failable";
export { ErrorObject } from "./Error";
export default class Parser {
    static parseRaw(text: string, semanticCheck?: boolean): Failable<RawChart.RawChart, ErrorObject>;
    static parse(text: string): Failable<Chart.Chart, ErrorObject>;
}
