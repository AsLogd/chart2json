export declare type TChart = ISection[];
export interface ISection {
    title: string;
    content: IItem[];
}
export interface IItem {
    key: TKey;
    values: IAtom[];
}
export declare type TRawType = "number" | "string" | "literal";
export interface IAtom {
    type: TRawType;
    value: string | number;
}
export declare enum ESection {
    SONG = "Song",
    SYNC_TRACK = "SyncTrack",
    EVENTS = "Events"
}
export declare type TTick = number;
export declare type TKey = TTick | ESongKey;
export declare enum ETypeKind {
    ERROR = 0,
    STRING = 1,
    NUMBER = 2,
    LITERAL = 3,
    TUPLE = 4,
    EITHER = 5
}
export interface IErrorType {
    kind: ETypeKind.ERROR;
}
export interface IStringType {
    kind: ETypeKind.STRING;
}
export interface INumberType {
    kind: ETypeKind.NUMBER;
}
export interface ILiteralType {
    kind: ETypeKind.LITERAL;
    values: string[];
}
export interface ITupleType {
    kind: ETypeKind.TUPLE;
    types: TValueType[];
}
export interface IEitherType {
    kind: ETypeKind.EITHER;
    types: TValueType[];
}
export declare type TValueType = IErrorType | IStringType | INumberType | ILiteralType | ITupleType | IEitherType;
export declare function isError(type: TValueType): type is IErrorType;
export declare function isString(type: TValueType): type is IStringType;
export declare function isNumber(type: TValueType): type is INumberType;
export declare function isLiteral(type: TValueType): type is ILiteralType;
export declare function isTuple(type: TValueType): type is ITupleType;
export declare function isEither(type: TValueType): type is IEitherType;
export declare function FError(): IErrorType;
export declare function FString(): IStringType;
export declare function FNumber(): INumberType;
export declare function FLiteral(values: string[]): ILiteralType;
export declare function FTuple(types: TValueType[]): ITupleType;
export declare function FEither(types: TValueType[]): IEitherType;
export declare function typeFromRawValue(rawValue: IAtom[]): TValueType;
export declare function typeToString(type: TValueType): string;
export interface ISongTypes {
    required?: ESongKey[];
    string?: ESongKey[];
    number?: ESongKey[];
    literal?: [ESongKey, ILiteralType][];
}
export declare enum ESongKey {
    NAME = "Name",
    ARTIST = "Artist",
    ALBUM = "Album",
    YEAR = "Year",
    CHARTER = "Charter",
    OFFSET = "Offset",
    RESOLUTION = "Resolution",
    PLAYER2 = "Player2",
    DIFFICULTY = "Difficulty",
    PREVIEWSTART = "PreviewStart",
    PREVIEWEND = "PreviewEnd",
    GENRE = "Genre",
    MEDIATYPE = "MediaType",
    MUSICSTREAM = "MusicStream",
    GUITARSTREAM = "GuitarStream",
    RHYTHMSTREAM = "RhythmStream",
    BASSSTREAM = "BassStream",
    DRUMSTREAM = "DrumStream",
    DRUM2STREAM = "Drum2Stream",
    DRUM3STREAM = "Drum3Stream",
    DRUM4STREAM = "Drum4Stream",
    VOCALSTREAM = "VocalStream",
    KEYSSTREAM = "KeysStream",
    CROWDSTREAM = "CrowdStream"
}
export declare const SongTypes: ISongTypes;
export declare type EEventKey = ESyncTrackKey;
export declare function getEventKeyName(eventKey: EEventKey): "BPM" | "Time Signature" | "Anchor";
export declare enum ESyncTrackKey {
    BPM = "B",
    TIME_SIGNATURE = "TS",
    ANCHOR = "A"
}
export declare type TEventsSectionType = [EEventKey, TValueType, boolean];
export declare const SyncTrackTypes: TEventsSectionType[];
