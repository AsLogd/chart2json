import { IError } from "./Error";
import * as Meta from "./Meta";
export default function semanticCheck(chart: Meta.TChart): null | IError;
export declare function groupBy<T extends any>(list: T[], key: string): {
    [key: string]: T[];
};
