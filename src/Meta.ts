
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
	value:	string | number
	//TODO: other values
}

export enum ESection {
	SONG 		= "Song",
	SYNC_TRACK 	= "SyncTrack",
	EVENTS		= "Events"
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
	// List containing possible values (string literals)
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


// Convenient functions
export function isError(type: TValueType): type is IErrorType {
	return type.kind === ETypeKind.ERROR
}
export function isString(type: TValueType): type is IStringType {
	return type.kind === ETypeKind.STRING
}
export function isNumber(type: TValueType): type is INumberType {
	return type.kind === ETypeKind.NUMBER
}
export function isLiteral(type: TValueType): type is ILiteralType {
	return type.kind === ETypeKind.LITERAL
}
export function isTuple(type: TValueType): type is ITupleType {
	return type.kind === ETypeKind.TUPLE
}
export function isEither(type: TValueType): type is IEitherType {
	return type.kind === ETypeKind.EITHER
}

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
export type EEventKey = ESyncTrackKey
export function getEventKeyName(eventKey: EEventKey) {
	switch(eventKey) {
		case ESyncTrackKey.BPM:
			return "BPM"
		case ESyncTrackKey.TIME_SIGNATURE:
			return "Time Signature"
		case ESyncTrackKey.ANCHOR:
			return "Anchor"
	}
}

export enum ESyncTrackKey {
	BPM 			= "B",
	TIME_SIGNATURE 	= "TS",
	ANCHOR		 	= "A",
}

/*
 * Tuples of the 'Tick = Key Value' pattern
 * meaning [key, value, shouldAppearAtLeastOnce]
 */
export type TEventsSectionType = [EEventKey, TValueType, boolean]
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