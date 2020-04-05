import * as Meta from "./Meta";
export interface IError {
    reason: string;
    location?: number;
}
export declare enum EError {
    WRONG_SECTION_COUNT = 0,
    MISSING_ONE_OF = 1,
    MISSING_REQUIRED_ITEM = 2,
    MISSING_REQUIRED_EVENT = 3,
    WRONG_TYPE = 4,
    INVALID_EVENT_ITEM = 5,
    WRONG_LYRICS = 6,
    WRONG_NOTE_FLAG = 7,
    DUPLICATE_NOTE_EVENT = 8
}
interface IWrongSectionCountError {
    section: string;
}
interface IMissingOneOfError {
    sections: string[];
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
declare type TErrorData = IWrongSectionCountError | IMissingOneOfError | IMissingItemError | IMissingEventError | IWrongTypeError | IInvalidEventItemError | IWrongLyricsError | IWrongNoteFlagError;
export declare function getErrorString(kind: EError, errorData: TErrorData): string;
export {};
