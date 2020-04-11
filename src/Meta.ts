
export type ParsedChart = ParsedSection[]

export interface ParsedSection {
	title: 	string
	content:ParsedItem[]
}

export interface ParsedItem {
	key: 	ItemKey
	values:	ParsedAtom[]
}

export type AtomType = "number" | "string"	| "literal"

export interface ParsedAtom {
	type: 	AtomType
	value:	string
	line: 	number
	col: 	number
	//TODO: other values
}

export enum SectionTitle {
	SONG 		= "Song",
	SYNC_TRACK 	= "SyncTrack",
	EVENTS		= "Events"
}

export enum Difficulty {
	EASY 	= "Easy",
	MEDIUM 	= "Medium",
	HARD 	= "Hard",
	EXPERT 	= "Expert",
}

export enum Instrument {
	SINGLE 			= "Single",
	DOUBLEGUITAR 	= "DoubleGuitar",
	DOUBLEBASS 		= "DoubleBass",
	DOUBLERHYTHM 	= "DoubleRhythm",
	DRUMS 			= "Drums",
	KEYBOARD 		= "Keyboard",
	GHLGUITAR 		= "GHLGuitar",
	GHLBASS 		= "GHLBass",
}

export enum GuitarNoteEventType {
	LANE_1 	= 0,
	LANE_2 	= 1,
	LANE_3 	= 2,
	LANE_4 	= 3,
	LANE_5 	= 4,
	FORCED 	= 5,
	TAP		= 6,
	OPEN	= 7,
}

export enum GhlNoteEventType {
	WHITE_1 = 0,
	WHITE_2 = 1,
	WHITE_3	= 2,
	BLACK_1	= 3,
	BLACK_2 = 4,
	FORCED 	= 5,
	TAP		= 6,
	OPEN	= 7,
	BLACK_3 = 8
}

export enum DrumsNoteEventType {
	OPEN	= 0,
	LANE_1 	= 1,
	LANE_2 	= 2,
	LANE_3 	= 3,
	LANE_4 	= 4,
	LANE_5 	= 5,
}

export function getPossibleTrackNames(): string[] {
	return Object.keys(Difficulty).map((dif) => {
		return Object.keys(Instrument).map(instr => {
			//@ts-ignore weird stuff
			return ""+Difficulty[dif]+Instrument[instr]
		})
	}).flat() // requires node 12.4
}


///////////////
//// Key Types
///////////////
export type Tick = number
export type ItemKey =
	| Tick
	| SongKey

///////////////
//// Value Types
///////////////
export enum TypeKind {
	ERROR,
	STRING,
	NUMBER,
	LITERAL,
	TUPLE,
	EITHER,
}

export interface ErrorType {
	kind: TypeKind.ERROR
}

export interface StringType {
	kind: TypeKind.STRING
}
export interface NumberType {
	kind: TypeKind.NUMBER
}
export interface LiteralType {
	kind: TypeKind.LITERAL
	// List containing possible values
	// (string literals, empty for 'any')
	values: string[]
}
export interface TupleType {
	kind: TypeKind.TUPLE
	// Tuple with types found in the specified order
	types: ValueType[]
}

export interface EitherType {
	kind: TypeKind.EITHER
	// Value will be either of these types
	types: ValueType[]
}

export type ValueType =
	| ErrorType
	| StringType
	| NumberType
	| LiteralType
	| TupleType
	| EitherType

export function TError(): ErrorType {
	return {
		kind: TypeKind.ERROR
	}
}
export function TString(): StringType {
	return {
		kind: TypeKind.STRING
	}
}
export function TNumber(): NumberType {
	return {
		kind: TypeKind.NUMBER
	}
}

export function TLiteral(values: string[]): LiteralType {
	return {
		kind: TypeKind.LITERAL,
		values
	}
}
export function TTuple(types: ValueType[]): TupleType {
	return {
		kind: TypeKind.TUPLE,
		types
	}
}
export function TEither(types: ValueType[]): EitherType {
	return {
		kind: TypeKind.EITHER,
		types
	}
}
export function typeFromRawValue(rawValue: ParsedAtom[]): ValueType {
	if (rawValue.length === 1) {
		switch(rawValue[0].type) {
			case "string":
				return TString()
			case "number":
				return TNumber()
			case "literal":
				return TLiteral([rawValue[0].value as string])
		}
	} else if (rawValue.length > 1) {
		const tupleTypes = rawValue.map(atom => typeFromRawValue([atom]))
		return TTuple(tupleTypes)
	}

	return TError()
}

export function typeToString(type: ValueType): string {
	// no default => error if not exhaustive
	switch(type.kind) {
		case TypeKind.STRING:
			return "String"
		case TypeKind.NUMBER:
			return "Number"
		case TypeKind.LITERAL:
			return `Literal<${ type.values.join(" | ") }>`
		case TypeKind.TUPLE: {
			const types = type.types.map(type => typeToString(type))
			return `Tuple<[${ types.join(", ") }]>`
		}
		case TypeKind.EITHER: {
			const types = type.types.map(type => typeToString(type))
			return `Either<[${ types.join(" | ") }]>`
		}
		case TypeKind.ERROR:
			return `Error`
	}

}

///////////////
//// Section Types
///////////////

// Easier to write this than a 'key=>type' map
export interface SongTypes {
	required?	: SongKey[]
	string?		: SongKey[]
	number?		: SongKey[]
	literal?	: [SongKey, LiteralType][]
}

export enum SongKey {
	NAME			= "Name",
	ARTIST			= "Artist",
	ALBUM			= "Album",
	YEAR			= "Year",
	CHARTER			= "Charter",
	OFFSET			= "Offset",
	RESOLUTION		= "Resolution",
	PLAYER2			= "Player2",
	DIFFICULTY		= "Difficulty",
	PREVIEWSTART	= "PreviewStart",
	PREVIEWEND		= "PreviewEnd",
	GENRE			= "Genre",
	MEDIATYPE		= "MediaType",

	// Audio streams
	MUSICSTREAM		= "MusicStream",
	GUITARSTREAM	= "GuitarStream",
	RHYTHMSTREAM	= "RhythmStream",
	BASSSTREAM		= "BassStream",
	DRUMSTREAM		= "DrumStream",
	DRUM2STREAM		= "Drum2Stream",
	DRUM3STREAM		= "Drum3Stream",
	DRUM4STREAM		= "Drum4Stream",
	VOCALSTREAM		= "VocalStream",
	KEYSSTREAM		= "KeysStream",
	CROWDSTREAM		= "CrowdStream",
}

export const SongTypes: SongTypes = {
	required: [
		SongKey.RESOLUTION
	],
	string: [
		SongKey.NAME,	SongKey.ARTIST,	SongKey.ALBUM,
		SongKey.YEAR,	SongKey.CHARTER,	SongKey.GENRE,
		SongKey.MEDIATYPE,
		// Audio Streams
		SongKey.MUSICSTREAM, 	SongKey.GUITARSTREAM,
		SongKey.RHYTHMSTREAM,	SongKey.BASSSTREAM,
		SongKey.DRUMSTREAM,	SongKey.DRUM2STREAM,
		SongKey.DRUM3STREAM,	SongKey.DRUM4STREAM,
		SongKey.VOCALSTREAM,	SongKey.KEYSSTREAM,
		SongKey.CROWDSTREAM,
	],
	number: [
		SongKey.OFFSET,		SongKey.RESOLUTION,
		SongKey.PREVIEWSTART, 	SongKey.PREVIEWEND,
		SongKey.DIFFICULTY
	],
	literal: [
		[SongKey.PLAYER2, TLiteral(["bass", "guitar"])]
	]
}

// The rest of sections use the 'Tick = Key Value' pattern
export type ItemEventKey =
	| SyncTrackKey
	| EventsKey
	| TrackKey

export function getEventKeyName(eventKey: ItemEventKey) {
	switch(eventKey) {
		case SyncTrackKey.BPM:
			return "BPM"
		case SyncTrackKey.TIME_SIGNATURE:
			return "Time Signature"
		case SyncTrackKey.ANCHOR:
			return "Anchor"
		case EventsKey.EVENT:
			return "Event"
	}
}

/*
 * Tuples of the 'Tick = Key Value' pattern
 * meaning [key, value, shouldAppearAtLeastOnce]
 */
export type EventsSectionType = [ItemEventKey, ValueType, boolean]

// SyncTrack section
export enum SyncTrackKey {
	BPM 			= "B",
	TIME_SIGNATURE 	= "TS",
	ANCHOR		 	= "A",
}

export const SyncTrackTypes: EventsSectionType[] = [
	[SyncTrackKey.BPM,
		TNumber(),
		true
	],
	[SyncTrackKey.TIME_SIGNATURE,
		// One or two numbers
		TEither([
			TNumber(),
			TTuple( [TNumber(), TNumber()] )
		]),
		true
	],
	[SyncTrackKey.ANCHOR,
		TNumber(),
		false
	],
]

// Events section
export enum EventsKey {
	EVENT = "E",
}

export const EventTypes: EventsSectionType[] = [
	[EventsKey.EVENT, TString(), false],
]

// Track sections
export enum TrackKey {
	NOTE 		= "N",
	SPECIAL 	= "S",
	TRACK_EVENT = "E"
}

export const TrackTypes: EventsSectionType[] = [
	[TrackKey.NOTE,
		TTuple([
			TNumber(),
			TNumber()
		]),
		true
	],
	[TrackKey.SPECIAL,
		TTuple([
			TNumber(),
			TNumber()
		]),
		false
	],
	[EventsKey.EVENT,
		TLiteral([]),
		false
	],
]

