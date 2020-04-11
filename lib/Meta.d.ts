export declare type ParsedChart = ParsedSection[];
export interface ParsedSection {
    title: string;
    content: ParsedItem[];
}
export interface ParsedItem {
    key: ItemKey;
    values: ParsedAtom[];
}
export declare type AtomType = "number" | "string" | "literal";
export interface ParsedAtom {
    type: AtomType;
    value: string;
    line: number;
    col: number;
}
export declare enum SectionTitle {
    SONG = "Song",
    SYNC_TRACK = "SyncTrack",
    EVENTS = "Events"
}
export declare enum Difficulty {
    EASY = "Easy",
    MEDIUM = "Medium",
    HARD = "Hard",
    EXPERT = "Expert"
}
export declare enum Instrument {
    SINGLE = "Single",
    DOUBLEGUITAR = "DoubleGuitar",
    DOUBLEBASS = "DoubleBass",
    DOUBLERHYTHM = "DoubleRhythm",
    DRUMS = "Drums",
    KEYBOARD = "Keyboard",
    GHLGUITAR = "GHLGuitar",
    GHLBASS = "GHLBass"
}
export declare enum GuitarNoteEventType {
    LANE_1 = 0,
    LANE_2 = 1,
    LANE_3 = 2,
    LANE_4 = 3,
    LANE_5 = 4,
    FORCED = 5,
    TAP = 6,
    OPEN = 7
}
export declare enum GhlNoteEventType {
    WHITE_1 = 0,
    WHITE_2 = 1,
    WHITE_3 = 2,
    BLACK_1 = 3,
    BLACK_2 = 4,
    FORCED = 5,
    TAP = 6,
    OPEN = 7,
    BLACK_3 = 8
}
export declare enum DrumsNoteEventType {
    OPEN = 0,
    LANE_1 = 1,
    LANE_2 = 2,
    LANE_3 = 3,
    LANE_4 = 4,
    LANE_5 = 5
}
export declare function getPossibleTrackNames(): string[];
export declare type Tick = number;
export declare type ItemKey = Tick | SongKey;
export declare enum TypeKind {
    ERROR = 0,
    STRING = 1,
    NUMBER = 2,
    LITERAL = 3,
    TUPLE = 4,
    EITHER = 5
}
export interface ErrorType {
    kind: TypeKind.ERROR;
}
export interface StringType {
    kind: TypeKind.STRING;
}
export interface NumberType {
    kind: TypeKind.NUMBER;
}
export interface LiteralType {
    kind: TypeKind.LITERAL;
    values: string[];
}
export interface TupleType {
    kind: TypeKind.TUPLE;
    types: ValueType[];
}
export interface EitherType {
    kind: TypeKind.EITHER;
    types: ValueType[];
}
export declare type ValueType = ErrorType | StringType | NumberType | LiteralType | TupleType | EitherType;
export declare function TError(): ErrorType;
export declare function TString(): StringType;
export declare function TNumber(): NumberType;
export declare function TLiteral(values: string[]): LiteralType;
export declare function TTuple(types: ValueType[]): TupleType;
export declare function TEither(types: ValueType[]): EitherType;
export declare function typeFromRawValue(rawValue: ParsedAtom[]): ValueType;
export declare function typeToString(type: ValueType): string;
export interface SongTypes {
    required?: SongKey[];
    string?: SongKey[];
    number?: SongKey[];
    literal?: [SongKey, LiteralType][];
}
export declare enum SongKey {
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
export declare const SongTypes: SongTypes;
export declare type ItemEventKey = SyncTrackKey | EventsKey | TrackKey;
export declare function getEventKeyName(eventKey: ItemEventKey): "Event" | "BPM" | "Time Signature" | "Anchor" | undefined;
export declare type EventsSectionType = [ItemEventKey, ValueType, boolean];
export declare enum SyncTrackKey {
    BPM = "B",
    TIME_SIGNATURE = "TS",
    ANCHOR = "A"
}
export declare const SyncTrackTypes: EventsSectionType[];
export declare enum EventsKey {
    EVENT = "E"
}
export declare const EventTypes: EventsSectionType[];
export declare enum TrackKey {
    NOTE = "N",
    SPECIAL = "S",
    TRACK_EVENT = "E"
}
export declare const TrackTypes: EventsSectionType[];
