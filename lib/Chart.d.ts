import * as Meta from "./Meta";
export { Difficulty, Instrument } from "./Meta";
export declare type GuitarInstrument = Meta.Instrument.SINGLE | Meta.Instrument.DOUBLEGUITAR | Meta.Instrument.DOUBLEBASS | Meta.Instrument.DOUBLERHYTHM | Meta.Instrument.KEYBOARD;
export declare function isGuitar(instrument: Meta.Instrument): instrument is GuitarInstrument;
export declare type DrumsInstrument = Meta.Instrument.DRUMS;
export declare function isDrums(instrument: Meta.Instrument): instrument is DrumsInstrument;
export declare type GHLInstrument = Meta.Instrument.GHLGUITAR | Meta.Instrument.GHLBASS;
export declare function isGHL(instrument: Meta.Instrument): instrument is GHLInstrument;
export interface Chart {
    song: SongSection;
    syncTrack: SyncTrackSection;
    events?: EventsSection;
    difficulties: Difficulties;
}
export declare type Difficulties = {
    [difficulty in Meta.Difficulty]?: InstrumentTracks;
};
export declare type AudioStreams = {
    [stream in AudioStream]?: string;
};
export declare type SongSection = {
    audioStreams: AudioStreams;
    resolution: number;
    name?: string;
    artist?: string;
    album?: string;
    charter?: string;
    player2?: string;
    genre?: string;
    mediaType?: string;
    year?: number;
    offset?: number;
    difficulty?: number;
    previewStart?: number;
    previewEnd?: number;
};
export declare enum AudioStream {
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
export declare type Tick<T> = T[];
export interface SyncTrackSection {
    [tick: number]: Tick<SyncTrackEvent>;
}
export declare type SyncTrackEvent = Bpm | TimeSignature;
export declare enum SyncTrackEventType {
    BPM = 0,
    TIME_SIGNATURE = 1
}
export interface Bpm {
    kind: SyncTrackEventType.BPM;
    bpm: number;
    anchorMicroSeconds?: number;
}
export interface TimeSignature {
    kind: SyncTrackEventType.TIME_SIGNATURE;
    signature: Signature;
}
export interface Signature {
    numerator: number;
    denominator: number;
}
export interface EventsSection {
    [tick: number]: Tick<EventsEvent>;
}
export declare type EventsEvent = SectionEvent | PhraseStart | Lyric | PhraseEnd | ValueEvent;
export declare enum EventsEventType {
    SECTION = 0,
    PHRASE_START = 1,
    LYRIC = 2,
    PHRASE_END = 3,
    VALUE_EVENT = 4
}
export interface SectionEvent {
    kind: EventsEventType.SECTION;
    name: string;
}
export interface PhraseStart {
    kind: EventsEventType.PHRASE_START;
}
export interface PhraseEnd {
    kind: EventsEventType.PHRASE_END;
}
export interface Lyric {
    kind: EventsEventType.LYRIC;
    lyric: string;
}
export interface ValueEvent {
    kind: EventsEventType.VALUE_EVENT;
    value: string;
}
export declare type InstrumentTracks = {
    [guitar in GuitarInstrument]?: Track<StringNote<GuitarLane>>;
} & {
    [drums in DrumsInstrument]?: Track<DrumsNote>;
} & {
    [ghl in GHLInstrument]?: Track<StringNote<GHLLane>>;
};
export interface Track<N> {
    [tick: number]: Tick<TrackEvent<N>>;
}
export declare type TrackEvent<N> = N | SpecialEvent | LiteralEvent;
export declare enum GuitarLane {
    OPEN = 0,
    LANE_1 = 1,
    LANE_2 = 2,
    LANE_3 = 3,
    LANE_4 = 4,
    LANE_5 = 5
}
export interface Lane<T> {
    lane: T;
    sustain: number;
}
export interface StringNote<T> {
    lanes: Lane<T>[];
    forced: boolean;
    tap: boolean;
}
export declare enum DrumsLane {
    PEDAL = 0,
    SNARE = 1,
    CYMBAL_1 = 2,
    TOM_1 = 3,
    CYMBAL_2 = 4,
    TOM_2 = 5
}
export interface DrumsNote {
    lanes: Lane<DrumsLane>[];
}
export declare enum GHLLane {
    OPEN = 0,
    WHITE_1 = 1,
    WHITE_2 = 2,
    WHITE_3 = 3,
    BLACK_1 = 4,
    BLACK_2 = 5,
    BLACK_3 = 6
}
export declare enum SpecialEventType {
    PLAYER1 = 0,
    PLAYER2 = 1,
    START_POWER = 2
}
export interface SpecialEvent {
    type: SpecialEventType;
    duration: number;
}
export interface LiteralEvent {
    value: string;
}
export declare function fromParsedChart(pc: Meta.ParsedChart): Chart;
