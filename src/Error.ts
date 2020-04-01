

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
}

interface IWrongSectionCountError {
	section: Meta.ESection
}

interface IMissingItemError {
	section: Meta.ESection,
	itemKey: Meta.TKey
}

interface IMissingEventError {
	section: Meta.ESection,
	eventKey: Meta.EEventKey
}

interface IWrongTypeError {
	section: Meta.ESection,
	item: Meta.TKey,
	expected: Meta.TValueType,
	found: Meta.TValueType
}

interface IInvalidEventItemError {
	section: Meta.ESection,
	item: Meta.IItem
}

type TErrorData =
	| IWrongSectionCountError
	| IMissingItemError
	| IMissingEventError
	| IWrongTypeError
	| IInvalidEventItemError

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
	return `A required event { ${data.eventKey} } (${name}) has to appear at least once in section { ${data.section} }`
}

function getWrongTypeError(data: IWrongTypeError) {
	return `Unexpected type found in { ${data.section}:${data.item} }
- Expected:
	${ Meta.typeToString(data.expected) }
- Found:
	${ Meta.typeToString(data.found) }`
}

function getInvalidEventItemError(data: IInvalidEventItemError) {
	const values = data.item.values.join(" ")
	return `Invalid event { ${data.item.key} = ${values} } found in section { ${data.section} }`
}