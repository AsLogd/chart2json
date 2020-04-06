import * as Meta from "./Meta"

export type Difficulty = Meta.Difficulty
export type Instrument = Meta.Instrument

export type GuitarInstrument =
	| Meta.Instrument.SINGLE
	| Meta.Instrument.DOUBLEGUITAR
	| Meta.Instrument.DOUBLEBASS
	| Meta.Instrument.DOUBLERHYTHM
	| Meta.Instrument.KEYBOARD

export type DrumsInstrument =
	| Meta.Instrument.DRUMS

export type GHLInstrument =
	| Meta.Instrument.GHLGUITAR
	| Meta.Instrument.GHLBASS

export interface Chart {
	song: SongSection
	syncTrack: SyncTrackSection
	events?: EventsSection
	difficulties: {
		[difficulty in Difficulty]: InstrumentTracks
	}
}

export interface SongSection {
	resolution: 	number
	name?:			string
	artist?:		string
	album?:			string
	year?:			string
	charter?:		string
	offset?:		string
	player2?:		string
	difficulty?:	string
	previewStart?:	string
	previewEnd?:	string
	genre?:			string
	mediaType?:		string
	audioStreams?:	{[stream in AudioStream]: string}
}

export enum AudioStream {
	MUSICSTREAM	 = "MusicStream",
	GUITARSTREAM = "GuitarStream",
	RHYTHMSTREAM = "RhythmStream",
	BASSSTREAM	 = "BassStream",
	DRUMSTREAM	 = "DrumStream",
	DRUM2STREAM	 = "Drum2Stream",
	DRUM3STREAM	 = "Drum3Stream",
	DRUM4STREAM	 = "Drum4Stream",
	VOCALSTREAM	 = "VocalStream",
	KEYSSTREAM	 = "KeysStream",
	CROWDSTREAM	 = "CrowdStream",
}

export interface Tick<T>{
	events: T[]
}

export interface SyncTrackSection {
	ticks: Tick<SyncTrackEvent>[]
}

export type SyncTrackEvent =
	| Bpm
	| TimeSignature
	| Anchor


export enum SyncTrackEventType {
	BPM,
	TIME_SIGNATURE,
	ANCHOR
}

export interface Bpm {
	kind: SyncTrackEventType.BPM
	bpm: number
}

export interface TimeSignature {
	kind: SyncTrackEventType.TIME_SIGNATURE
	signature: [number, number]
}

export interface Anchor {
	kind: SyncTrackEventType.ANCHOR
	microSeconds: number
}

export interface EventsSection {
	ticks: Tick<EventsEvent>[]
}

export type EventsEvent =
	| SectionEvent
	| PhraseStart
	| Lyric
	| PhraseEnd


export enum EventsEventType {
	SECTION,
	PHRASE_START,
	LYRIC,
	PHRASE_END
}

export interface SectionEvent {
	kind: EventsEventType.SECTION
	name: string
}

export interface PhraseStart {
	kind: EventsEventType.PHRASE_START
}

export interface PhraseEnd {
	kind: EventsEventType.PHRASE_END
}

export interface Lyric {
	kind: EventsEventType.LYRIC,
	lyric: string
}

export type InstrumentTracks =
	& {[guitar in GuitarInstrument]: Track<GuitarNote>}
	& {[drums in DrumsInstrument]: Track<DrumsNote>}
	& {[ghl in GHLInstrument]: Track<GHLNote>}


export interface Track<N> {
	[tick: number]: Tick< TrackEvent<N> >[]
}

export type TrackEvent<N> =
	| N
	| SpecialEvent
	| LiteralEvent

export interface Note {
	sustain: number
}

export enum GuitarLane {
	OPEN,
	LANE_1,
	LANE_2,
	LANE_3,
	LANE_4,
	LANE_5,
}

export interface GuitarNote extends Note {
	lanes: 	GuitarLane[]
	forced: boolean
	tap: 	boolean
}

export enum DrumsLane {
	PEDAL,
	SNARE,
	CYMBAL_1,
	TOM_1,
	CYMBAL_2,
	TOM_2
}

export interface DrumsNote extends Note {
	lanes: 	DrumsLane[]
}

export enum GHLLane {
	OPEN,
	WHITE_1,
	WHITE_2,
	WHITE_3,
	BLACK_1,
	BLACK_2,
	BLACK_3
}

export interface GHLNote extends Note {
	lanes: 	GHLLane[]
	forced: boolean
	tap: 	boolean
}


export enum ESpecialEventType {
	PLAYER1,
	PLAYER2,
	START_POWER
}

export interface SpecialEvent {
	type: ESpecialEventType
	duration: number
}

export interface LiteralEvent {
	value: string
}