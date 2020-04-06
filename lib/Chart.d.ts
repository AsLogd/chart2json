import * as Meta from "./Meta";
export declare type Difficulty = Meta.Difficulty;
export declare type Instrument = Meta.Instrument;
export declare type GuitarInstrument = Meta.Instrument.SINGLE | Meta.Instrument.DOUBLEGUITAR | Meta.Instrument.DOUBLEBASS | Meta.Instrument.DOUBLERHYTHM | Meta.Instrument.KEYBOARD;
export declare type DrumsInstrument = Meta.Instrument.DRUMS;
export declare type GHLInstrument = Meta.Instrument.GHLGUITAR | Meta.Instrument.GHLBASS;
export interface Chart {
    song: SongSection;
    syncTrack: SyncTrackSection;
    events?: EventsSection;
    difficulties: {
        [difficulty in Difficulty]: InstrumentTracks;
    };
}
export interface SongSection {
    resolution: number;
    name?: string;
    artist?: string;
    album?: string;
    year?: string;
    charter?: string;
    offset?: string;
    player2?: string;
    difficulty?: string;
    previewStart?: string;
    previewEnd?: string;
    genre?: string;
    mediaType?: string;
    audioStreams?: {
        [stream in AudioStream]: string;
    };
}
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
export interface Tick<T> {
    events: T[];
}
export interface SyncTrackSection {
    ticks: Tick<SyncTrackEvent>[];
}
export declare type SyncTrackEvent = Bpm | TimeSignature | Anchor;
export declare enum SyncTrackEventType {
    BPM = 0,
    TIME_SIGNATURE = 1,
    ANCHOR = 2
}
export interface Bpm {
    kind: SyncTrackEventType.BPM;
    bpm: number;
}
export interface TimeSignature {
    kind: SyncTrackEventType.TIME_SIGNATURE;
    signature: [number, number];
}
export interface Anchor {
    kind: SyncTrackEventType.ANCHOR;
    microSeconds: number;
}
export interface EventsSection {
    ticks: Tick<EventsEvent>[];
}
export declare type EventsEvent = SectionEvent | PhraseStart | Lyric | PhraseEnd;
export declare enum EventsEventType {
    SECTION = 0,
    PHRASE_START = 1,
    LYRIC = 2,
    PHRASE_END = 3
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
export declare type InstrumentTracks = {
    [guitar in GuitarInstrument]: Track<GuitarNote>;
} & {
    [drums in DrumsInstrument]: Track<DrumsNote>;
} & {
    [ghl in GHLInstrument]: Track<GHLNote>;
};
export interface Track<N> {
    [tick: number]: Tick<TrackEvent<N>>[];
}
export declare type TrackEvent<N> = N | SpecialEvent | LiteralEvent;
export interface Note {
    sustain: number;
}
export declare enum GuitarLane {
    OPEN = 0,
    LANE_1 = 1,
    LANE_2 = 2,
    LANE_3 = 3,
    LANE_4 = 4,
    LANE_5 = 5
}
export interface GuitarNote extends Note {
    lanes: GuitarLane[];
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
export interface DrumsNote extends Note {
    lanes: DrumsLane[];
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
export interface GHLNote extends Note {
    lanes: GHLLane[];
    forced: boolean;
    tap: boolean;
}
export declare enum ESpecialEventType {
    PLAYER1 = 0,
    PLAYER2 = 1,
    START_POWER = 2
}
export interface SpecialEvent {
    type: ESpecialEventType;
    duration: number;
}
export interface LiteralEvent {
    value: string;
}
