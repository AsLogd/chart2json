

import * as Meta from "./Meta"

export interface IError {
	reason: string
	location?: number
}
export enum EError {
	WRONG_SECTION_COUNT,
	MISSING_REQUIRED_ITEM,
	MISSING_REQUIRED_EVENT,
	WRONG_TYPE,
	INVALID_EVENT_ITEM,
	WRONG_LYRICS,
	WRONG_NOTE_FLAG,
	DUPLICATE_NOTE_EVENT,
}

interface IWrongSectionCountError {
	section: string
}

interface IMissingItemError {
	section: string,
	itemKey: Meta.TKey
}

interface IMissingEventError {
	section: string,
	eventKey: Meta.EItemEventKey
}

interface IWrongTypeError {
	section: string,
	item: Meta.IItem,
	expected: Meta.TValueType,
	found: Meta.TValueType
}

interface IInvalidEventItemError {
	section: string,
	item: Meta.IItem
}

interface IWrongLyricsError {
	item: Meta.IItem
	found: string
}

interface IWrongNoteFlagError {
	section: string,
	tick: number
	foundValues: string[]
}

type TErrorData =
	| IWrongSectionCountError
	| IMissingItemError
	| IMissingEventError
	| IWrongTypeError
	| IInvalidEventItemError
	| IWrongLyricsError
	| IWrongNoteFlagError

export function getErrorString(kind: EError, errorData: TErrorData): string {
	// no default => error if not exhaustive
	switch(kind) {
		case EError.WRONG_SECTION_COUNT:
			return getWrongSectionCountError(errorData as IWrongSectionCountError)
		case EError.MISSING_REQUIRED_ITEM:
			return getMissingItemError(errorData as IMissingItemError)
		case EError.MISSING_REQUIRED_EVENT:
			return getMissingEventError(errorData as IMissingEventError)
		case EError.WRONG_TYPE:
			return getWrongTypeError(errorData as IWrongTypeError)
		case EError.INVALID_EVENT_ITEM:
			return getInvalidEventItemError(errorData as IInvalidEventItemError)
		case EError.WRONG_LYRICS:
			return getWrongLyricsError(errorData as IWrongLyricsError)
		case EError.WRONG_NOTE_FLAG:
			return getWrongNoteFlagError(errorData as IWrongNoteFlagError)
		case EError.DUPLICATE_NOTE_EVENT:
			return getDuplicateNoteError(errorData as IWrongNoteFlagError)

	}
}

function getWrongSectionCountError(data: IWrongSectionCountError) {
	return `A required section { ${data.section} } is missing or has multiple definitions`
}

function getMissingItemError(data: IMissingItemError) {
	return `A required item { ${data.itemKey} } is missing in section { ${data.section} }`
}

function getMissingEventError(data: IMissingEventError) {
	const name = Meta.getEventKeyName(data.eventKey)
	return `A required event { ${data.eventKey} (${name}) } has to appear at least once in section { ${data.section} }`
}

function getWrongTypeError(data: IWrongTypeError) {
	const line = data.item.values[0].line
	return `Unexpected type found at line { ${line} } (section: ${data.section} key: ${data.item.key})
- Expected:
	${ Meta.typeToString(data.expected) }
- Found:
	${ Meta.typeToString(data.found) }`
}

function getInvalidEventItemError(data: IInvalidEventItemError) {
	const values = data.item.values.join(" ")
	const line = data.item.values[0].line
	return `Invalid event { ${data.item.key} = ${values} } found at line { line } (section: ${data.section} )`
}

function getWrongLyricsError(data: IWrongLyricsError) {
	const line = data.item.values[0].line
	return `'lyric' and 'phrase_end' events should happen inside a phrase. Found { ${data.found} } at line { ${line} } (key: ${data.item.key}) `
}

function getWrongNoteFlagError(data: IWrongNoteFlagError) {
	const flags = data.foundValues.map(flag => Meta.EGuitarNoteEventType[parseInt(flag)]).join(", ")
	return `Found flags { ${flags} } without notes in tick { ${data.tick} } in section { ${data.section} }.`
}

function getDuplicateNoteError(data: IWrongNoteFlagError) {
	const events = data.foundValues.map(flag => Meta.EGuitarNoteEventType[parseInt(flag)]).join(", ")
	return `Found duplicated events { ${events} } in tick { ${data.tick} } in section { ${data.section} }.`
}