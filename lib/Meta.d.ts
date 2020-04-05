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
    value: string;
    line: number;
    col: number;
}
export declare enum ESection {
    SONG = "Song",
    SYNC_TRACK = "SyncTrack",
    EVENTS = "Events"
}
export declare enum EDifficulty {
    EASY = "Easy",
    MEDIUM = "Medium",
    HARD = "Hard",
    EXPERT = "Expert"
}
export declare enum EInstrument {
    SINGLE = "Single",
    DOUBLEGUITAR = "DoubleGuitar",
    DOUBLEBASS = "DoubleBass",
    DOUBLERHYTHM = "DoubleRhythm",
    DRUMS = "Drums",
    KEYBOARD = "Keyboard",
    GHLGUITAR = "GHLGuitar",
    GHLBASS = "GHLBass"
}
export declare enum EGuitarNoteEventType {
    LANE_1 = 0,
    LANE_2 = 1,
    LANE_3 = 2,
    LANE_4 = 3,
    LANE_5 = 4,
    FORCED = 5,
    TAP = 6,
    OPEN = 7
}
export declare function getPossibleTrackNames(): string[];
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
export declare type EItemEventKey = ESyncTrackKey | EEventsKey | ETrackKey;
export declare function getEventKeyName(eventKey: EItemEventKey): "Event" | "BPM" | "Time Signature" | "Anchor" | undefined;
export declare type TEventsSectionType = [EItemEventKey, TValueType, boolean];
export declare enum ESyncTrackKey {
    BPM = "B",
    TIME_SIGNATURE = "TS",
    ANCHOR = "A"
}
export declare const SyncTrackTypes: TEventsSectionType[];
export declare enum EEventsKey {
    EVENT = "E"
}
export declare const EventTypes: TEventsSectionType[];
export declare enum ETrackKey {
    NOTE = "N",
    SPECIAL = "S",
    TRACK_EVENT = "E"
}
export declare const TrackTypes: TEventsSectionType[];
