import * as Meta from "./Meta";
export interface ErrorObject {
    reason: string;
    location?: number;
}
export declare enum ErrorType {
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
interface WrongSectionCountError {
    section: string;
}
interface MissingOneOfError {
    sections: string[];
}
interface MissingItemError {
    section: string;
    itemKey: Meta.ItemKey;
}
interface MissingEventError {
    section: string;
    eventKey: Meta.ItemEventKey;
}
interface WrongTypeError {
    section: string;
    item: Meta.ParsedItem;
    expected: Meta.ValueType;
    found: Meta.ValueType;
}
interface InvalidEventItemError {
    section: string;
    item: Meta.ParsedItem;
}
interface UnpairedAnchorError {
    tick: number;
}
interface WrongLyricsError {
    item: Meta.ParsedItem;
    found: string;
}
interface WrongNoteFlagError {
    section: string;
    tick: number;
    foundValues: string[];
}
declare type ErrorData = WrongSectionCountError | MissingOneOfError | MissingItemError | MissingEventError | UnpairedAnchorError | WrongTypeError | InvalidEventItemError | WrongLyricsError | WrongNoteFlagError;
export declare function getErrorString(kind: ErrorType, errorData: ErrorData): string;
export {};
