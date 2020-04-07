

import * as Meta from "./Meta"

export interface ErrorObject {
	reason: string
	location?: number
}
export enum ErrorType {
	WRONG_SECTION_COUNT,
	MISSING_ONE_OF,
	MISSING_REQUIRED_ITEM,
	MISSING_REQUIRED_EVENT,
	WRONG_TYPE,
	INVALID_EVENT_ITEM,
	UNPAIRED_ANCHOR,
	WRONG_LYRICS,
	WRONG_NOTE_FLAG,
	DUPLICATE_NOTE_EVENT,
}

interface WrongSectionCountError {
	section: string
}

interface MissingOneOfError {
	sections: string[]
}

interface MissingItemError {
	section: string,
	itemKey: Meta.ItemKey
}

interface MissingEventError {
	section: string,
	eventKey: Meta.ItemEventKey
}

interface WrongTypeError {
	section: string,
	item: Meta.ParsedItem,
	expected: Meta.ValueType,
	found: Meta.ValueType
}

interface InvalidEventItemError {
	section: string,
	item: Meta.ParsedItem
}

interface UnpairedAnchorError {
	tick: number
}


interface WrongLyricsError {
	item: Meta.ParsedItem
	found: string
}

interface WrongNoteFlagError {
	section: string,
	tick: number
	foundValues: string[]
}

type ErrorData =
	| WrongSectionCountError
	| MissingOneOfError
	| MissingItemError
	| MissingEventError
	| UnpairedAnchorError
	| WrongTypeError
	| InvalidEventItemError
	| WrongLyricsError
	| WrongNoteFlagError

export function getErrorString(kind: ErrorType, errorData: ErrorData): string {
	// no default => error if not exhaustive
	switch(kind) {
		case ErrorType.WRONG_SECTION_COUNT:
			return getWrongSectionCountError(errorData as WrongSectionCountError)
		case ErrorType.MISSING_ONE_OF:
			return getMissingOneOfError(errorData as MissingOneOfError)
		case ErrorType.MISSING_REQUIRED_ITEM:
			return getMissingItemError(errorData as MissingItemError)
		case ErrorType.MISSING_REQUIRED_EVENT:
			return getMissingEventError(errorData as MissingEventError)
		case ErrorType.WRONG_TYPE:
			return getWrongTypeError(errorData as WrongTypeError)
		case ErrorType.INVALID_EVENT_ITEM:
			return getInvalidEventItemError(errorData as InvalidEventItemError)
		case ErrorType.UNPAIRED_ANCHOR:
			return getUnpairedAnchorError(errorData as UnpairedAnchorError)
		case ErrorType.WRONG_LYRICS:
			return getWrongLyricsError(errorData as WrongLyricsError)
		case ErrorType.WRONG_NOTE_FLAG:
			return getWrongNoteFlagError(errorData as WrongNoteFlagError)
		case ErrorType.DUPLICATE_NOTE_EVENT:
			return getDuplicateNoteError(errorData as WrongNoteFlagError)

	}
}

function getWrongSectionCountError(data: WrongSectionCountError) {
	return `A required section { ${data.section} } is missing or has multiple definitions`
}

function getMissingOneOfError(data: MissingOneOfError) {
	const sections = data.sections.join(",\n\t")
	return `At least one of the following sections is required and none was found {
	${sections}
}`
}

function getMissingItemError(data: MissingItemError) {
	return `A required item { ${data.itemKey} } is missing in section { ${data.section} }`
}

function getMissingEventError(data: MissingEventError) {
	const name = Meta.getEventKeyName(data.eventKey)
	return `A required event { ${data.eventKey} (${name}) } has to appear at least once in section { ${data.section} }`
}

function getUnpairedAnchorError(data: UnpairedAnchorError) {
	return `Tick { ${data.tick} } has defined an Anchor but not a BPM event. All anchors should be paired with a BPM event`
}

function getWrongTypeError(data: WrongTypeError) {
	const line = data.item.values[0].line
	return `Unexpected type found at line { ${line} } (section: ${data.section} key: ${data.item.key})
- Expected:
	${ Meta.typeToString(data.expected) }
- Found:
	${ Meta.typeToString(data.found) }`
}

function getInvalidEventItemError(data: InvalidEventItemError) {
	const values = data.item.values.join(" ")
	const line = data.item.values[0].line
	return `Invalid event { ${data.item.key} = ${values} } found at line { line } (section: ${data.section} )`
}

function getWrongLyricsError(data: WrongLyricsError) {
	const line = data.item.values[0].line
	return `'lyric' and 'phrase_end' events should happen inside a phrase. Found { ${data.found} } at line { ${line} } (key: ${data.item.key}) `
}

function getWrongNoteFlagError(data: WrongNoteFlagError) {
	const flags = data.foundValues.map(flag => Meta.GuitarNoteEventType[parseInt(flag)]).join(", ")
	return `Found flags { ${flags} } without notes in tick { ${data.tick} } in section { ${data.section} }.`
}

function getDuplicateNoteError(data: WrongNoteFlagError) {
	const events = data.foundValues.map(flag => Meta.GuitarNoteEventType[parseInt(flag)]).join(", ")
	return `Found duplicated events { ${events} } in tick { ${data.tick} } in section { ${data.section} }.`
}