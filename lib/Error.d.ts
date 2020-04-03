import * as Meta from "./Meta";
export interface IError {
    reason: string;
    location?: number;
}
export declare enum EError {
    WRONG_SECTION_COUNT = 0,
    MISSING_REQUIRED_ITEM = 1,
    MISSING_REQUIRED_EVENT = 2,
    WRONG_TYPE = 3,
    INVALID_EVENT_ITEM = 4,
    WRONG_LYRICS = 5
}
interface IWrongSectionCountError {
    section: Meta.ESection;
}
interface IMissingItemError {
    section: Meta.ESection;
    itemKey: Meta.TKey;
}
interface IMissingEventError {
    section: Meta.ESection;
    eventKey: Meta.EItemEventKey;
}
interface IWrongTypeError {
    section: Meta.ESection;
    item: Meta.TKey;
    expected: Meta.TValueType;
    found: Meta.TValueType;
}
interface IInvalidEventItemError {
    section: Meta.ESection;
    item: Meta.IItem;
}
interface IWrongLyricsError {
    item: Meta.IItem;
    found: string;
}
declare type TErrorData = IWrongSectionCountError | IMissingItemError | IMissingEventError | IWrongTypeError | IInvalidEventItemError | IWrongLyricsError;
export declare function getErrorString(kind: EError, errorData: TErrorData): string;
export {};
