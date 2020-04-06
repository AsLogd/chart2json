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
    UNPAIRED_ANCHOR = 6,
    WRONG_LYRICS = 7,
    WRONG_NOTE_FLAG = 8,
    DUPLICATE_NOTE_EVENT = 9
}
interface IWrongSectionCountError {
    section: string;
}
interface IMissingOneOfError {
    sections: string[];
}
interface IMissingItemError {
    section: string;
    itemKey: Meta.ItemKey;
}
interface IMissingEventError {
    section: string;
    eventKey: Meta.ItemEventKey;
}
interface IWrongTypeError {
    section: string;
    item: Meta.Item;
    expected: Meta.ValueType;
    found: Meta.ValueType;
}
interface IInvalidEventItemError {
    section: string;
    item: Meta.Item;
}
interface IUnpairedAnchorError {
    tick: number;
}
interface IWrongLyricsError {
    item: Meta.Item;
    found: string;
}
interface IWrongNoteFlagError {
    section: string;
    tick: number;
    foundValues: string[];
}
declare type TErrorData = IWrongSectionCountError | IMissingOneOfError | IMissingItemError | IMissingEventError | IUnpairedAnchorError | IWrongTypeError | IInvalidEventItemError | IWrongLyricsError | IWrongNoteFlagError;
export declare function getErrorString(kind: EError, errorData: TErrorData): string;
export {};
