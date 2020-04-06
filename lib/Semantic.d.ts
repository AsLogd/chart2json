import { ErrorObject } from "./Error";
import * as Meta from "./Meta";
export default function semanticCheck(chart: Meta.Chart): null | ErrorObject;
export declare function groupBy<T extends any>(list: T[], key: string): {
    [key: string]: T[];
};
