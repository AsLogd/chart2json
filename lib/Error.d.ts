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
    WRONG_LYRICS = 5,
    WRONG_NOTE_FLAG = 6,
    DUPLICATE_NOTE_EVENT = 7
}
interface IWrongSectionCountError {
    section: string;
}
interface IMissingItemError {
    section: string;
    itemKey: Meta.TKey;
}
interface IMissingEventError {
    section: string;
    eventKey: Meta.EItemEventKey;
}
interface IWrongTypeError {
    section: string;
    item: Meta.IItem;
    expected: Meta.TValueType;
    found: Meta.TValueType;
}
interface IInvalidEventItemError {
    section: string;
    item: Meta.IItem;
}
interface IWrongLyricsError {
    item: Meta.IItem;
    found: string;
}
interface IWrongNoteFlagError {
    section: string;
    tick: number;
    foundValues: string[];
}
declare type TErrorData = IWrongSectionCountError | IMissingItemError | IMissingEventError | IWrongTypeError | IInvalidEventItemError | IWrongLyricsError | IWrongNoteFlagError;
export declare function getErrorString(kind: EError, errorData: TErrorData): string;
export {};
