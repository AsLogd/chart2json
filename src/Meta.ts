
export type TChart = ISection[]

export interface ISection {
	title: 	string
	content:IItem[]
}

export interface IItem {
	key: 	TKey
	values:	IAtom[]
}

export type TRawType = "number" | "string"	| "literal"

export interface IAtom {
	type: 	TRawType
	value:	string
	line: 	number
	col: 	number
	//TODO: other values
}

export enum ESection {
	SONG 		= "Song",
	SYNC_TRACK 	= "SyncTrack",
	EVENTS		= "Events"
}

export enum EDifficulty {
	EASY 	= "Easy",
	MEDIUM 	= "Medium",
	HARD 	= "Hard",
	EXPERT 	= "Expert",
}

export enum EInstrument {
	SINGLE 			= "Single",
	DOUBLEGUITAR 	= "DoubleGuitar",
	DOUBLEBASS 		= "DoubleBass",
	DOUBLERHYTHM 	= "DoubleRhythm",
	DRUMS 			= "Drums",
	KEYBOARD 		= "Keyboard",
	GHLGUITAR 		= "GHLGuitar",
	GHLBASS 		= "GHLBass",
}

export enum EGuitarNoteEventType {
	LANE_1 	= 0,
	LANE_2 	= 1,
	LANE_3 	= 2,
	LANE_4 	= 3,
	LANE_5 	= 4,
	FORCED 	= 5,
	TAP		= 6,
	OPEN	= 7
}

export function getPossibleTrackNames(): string[] {
	return Object.keys(EDifficulty).map((dif) => {
		return Object.keys(EInstrument).map(instr => {
			//@ts-ignore weird stuff
			return ""+EDifficulty[dif]+EInstrument[instr]
		})
	}).flat() // requires node 12.4
}


///////////////
//// Key Types
///////////////
export type TTick = number
export type TKey =
	| TTick
	| ESongKey

///////////////
//// Value Types
///////////////
export enum ETypeKind {
	ERROR,
	STRING,
	NUMBER,
	LITERAL,
	TUPLE,
	EITHER,
}

export interface IErrorType {
	kind: ETypeKind.ERROR
}

export interface IStringType {
	kind: ETypeKind.STRING
}
export interface INumberType {
	kind: ETypeKind.NUMBER
}
export interface ILiteralType {
	kind: ETypeKind.LITERAL
	// List containing possible values
	// (string literals, empty for 'any')
	values: string[]
}
export interface ITupleType {
	kind: ETypeKind.TUPLE
	// Tuple with types found in the specified order
	types: TValueType[]
}

export interface IEitherType {
	kind: ETypeKind.EITHER
	// Value will be either of these types
	types: TValueType[]
}

export type TValueType =
	| IErrorType
	| IStringType
	| INumberType
	| ILiteralType
	| ITupleType
	| IEitherType

export function FError(): IErrorType {
	return {
		kind: ETypeKind.ERROR
	}
}
export function FString(): IStringType {
	return {
		kind: ETypeKind.STRING
	}
}
export function FNumber(): INumberType {
	return {
		kind: ETypeKind.NUMBER
	}
}

export function FLiteral(values: string[]): ILiteralType {
	return {
		kind: ETypeKind.LITERAL,
		values
	}
}
export function FTuple(types: TValueType[]): ITupleType {
	return {
		kind: ETypeKind.TUPLE,
		types
	}
}
export function FEither(types: TValueType[]): IEitherType {
	return {
		kind: ETypeKind.EITHER,
		types
	}
}
export function typeFromRawValue(rawValue: IAtom[]): TValueType {
	if (rawValue.length === 1) {
		switch(rawValue[0].type) {
			case "string":
				return FString()
			case "number":
				return FNumber()
			case "literal":
				return FLiteral([rawValue[0].value as string])
		}
	} else if (rawValue.length > 1) {
		const tupleTypes = rawValue.map(atom => typeFromRawValue([atom]))
		return FTuple(tupleTypes)
	}

	return FError()
}

export function typeToString(type: TValueType): string {
	// no default => error if not exhaustive
	switch(type.kind) {
		case ETypeKind.STRING:
			return "String"
		case ETypeKind.NUMBER:
			return "Number"
		case ETypeKind.LITERAL:
			return `Literal<${ type.values.join(" | ") }>`
		case ETypeKind.TUPLE: {
			const types = type.types.map(type => typeToString(type))
			return `Tuple<[${ types.join(", ") }]>`
		}
		case ETypeKind.EITHER: {
			const types = type.types.map(type => typeToString(type))
			return `Either<[${ types.join(" | ") }]>`
		}
		case ETypeKind.ERROR:
			return `Error`
	}

}

///////////////
//// Section Types
///////////////

// Easier to write this than a 'key=>type' map
export interface ISongTypes {
	required?	: ESongKey[]
	string?		: ESongKey[]
	number?		: ESongKey[]
	literal?	: [ESongKey, ILiteralType][]
}

export enum ESongKey {
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

export const SongTypes: ISongTypes = {
	required: [
		ESongKey.RESOLUTION
	],
	string: [
		ESongKey.NAME,	ESongKey.ARTIST,	ESongKey.ALBUM,
		ESongKey.YEAR,	ESongKey.CHARTER,	ESongKey.GENRE,
		ESongKey.MEDIATYPE,
		// Audio Streams
		ESongKey.MUSICSTREAM, 	ESongKey.GUITARSTREAM,
		ESongKey.RHYTHMSTREAM,	ESongKey.BASSSTREAM,
		ESongKey.DRUMSTREAM,	ESongKey.DRUM2STREAM,
		ESongKey.DRUM3STREAM,	ESongKey.DRUM4STREAM,
		ESongKey.VOCALSTREAM,	ESongKey.KEYSSTREAM,
		ESongKey.CROWDSTREAM,
	],
	number: [
		ESongKey.OFFSET,		ESongKey.RESOLUTION,
		ESongKey.PREVIEWSTART, 	ESongKey.PREVIEWEND,
		ESongKey.DIFFICULTY
	],
	literal: [
		[ESongKey.PLAYER2, FLiteral(["bass", "guitar"])]
	]
}

// The rest of sections use the 'Tick = Key Value' pattern
export type EItemEventKey =
	| ESyncTrackKey
	| EEventsKey
	| ETrackKey

export function getEventKeyName(eventKey: EItemEventKey) {
	switch(eventKey) {
		case ESyncTrackKey.BPM:
			return "BPM"
		case ESyncTrackKey.TIME_SIGNATURE:
			return "Time Signature"
		case ESyncTrackKey.ANCHOR:
			return "Anchor"
		case EEventsKey.EVENT:
			return "Event"
	}
}

/*
 * Tuples of the 'Tick = Key Value' pattern
 * meaning [key, value, shouldAppearAtLeastOnce]
 */
export type TEventsSectionType = [EItemEventKey, TValueType, boolean]

// SyncTrack section
export enum ESyncTrackKey {
	BPM 			= "B",
	TIME_SIGNATURE 	= "TS",
	ANCHOR		 	= "A",
}

export const SyncTrackTypes: TEventsSectionType[] = [
	[ESyncTrackKey.BPM,
		FNumber(),
		true
	],
	[ESyncTrackKey.TIME_SIGNATURE,
		// One or two numbers
		FEither([
			FNumber(),
			FTuple( [FNumber(), FNumber()] )
		]),
		true
	],
	[ESyncTrackKey.ANCHOR,
		FNumber(),
		false
	],
]

// Events section
export enum EEventsKey {
	EVENT = "E",
}

export const EventTypes: TEventsSectionType[] = [
	[EEventsKey.EVENT, FString(), false],
]

// Track sections
export enum ETrackKey {
	NOTE 		= "N",
	SPECIAL 	= "S",
	TRACK_EVENT = "E"
}

export const TrackTypes: TEventsSectionType[] = [
	[ETrackKey.NOTE,
		FTuple([
			FNumber(),
			FNumber()
		]),
		true
	],
	[ETrackKey.SPECIAL,
		FTuple([
			FNumber(),
			FNumber()
		]),
		false
	],
	[EEventsKey.EVENT,
		FLiteral([]),
		false
	],
]

