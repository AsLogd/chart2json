import * as Meta from "./Meta";
export interface IError {
    reason: string;
    location?: number;
}
export declare enum EError {
    MISSING_SECTION = 0,
    MISSING_REQUIRED_ITEM = 1,
    WRONG_TYPE = 2
}
interface IMissingSectionError {
    section: Meta.ESection;
}
interface IMissingItemError {
    section: Meta.ESection;
    item: Meta.TKey;
}
interface IWrongTypeError {
    section: Meta.ESection;
    item: Meta.TKey;
    expected: Meta.TValueType;
    found: Meta.TValueType;
}
declare type TErrorData = IMissingSectionError | IMissingItemError | IWrongTypeError;
export declare function getErrorString(kind: EError, errorData: TErrorData): string;
export declare function getTypeString(type: Meta.TValueType): string;
export {};
