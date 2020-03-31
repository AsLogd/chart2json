

import * as Meta from "./Meta"

export interface IError {
	reason: string
	location?: number
}
export enum EError {
	MISSING_SECTION,
	MISSING_REQUIRED_ITEM,
	WRONG_TYPE,
}

interface IMissingSectionError {
	section: Meta.ESection
}

interface IMissingItemError {
	section: Meta.ESection,
	item: Meta.TKey
}

interface IWrongTypeError {
	section: Meta.ESection,
	item: Meta.TKey,
	expected: Meta.TValueType,
	found: Meta.TValueType
}

type TErrorData =
	| IMissingSectionError
	| IMissingItemError
	| IWrongTypeError

function getMissingSectionError(data: IMissingSectionError) {
	return `A required section { ${data.section} } is missing`
}

function getMissingItemError(data: IMissingItemError) {
	return `A required item { ${data.item} } is missing in section { ${data.section} }`
}



function getWrongTypeError(data: IWrongTypeError) {
	return `Unexpected type found in { ${data.section}:${data.item} }
- Expected:
	${ getTypeString(data.expected) }
- Found:
	${ getTypeString(data.found) }`
}

export function getErrorString(kind: EError, errorData: TErrorData): string {
	// no default => error if not exhaustive
	switch(kind) {
		case EError.MISSING_SECTION:
			return getMissingSectionError(errorData as IMissingSectionError)
		case EError.MISSING_REQUIRED_ITEM:
			return getMissingItemError(errorData as IMissingItemError)
		case EError.WRONG_TYPE:
			return getWrongTypeError(errorData as IWrongTypeError)

	}
}

export function getTypeString(type: Meta.TValueType): string {
	// no default => error if not exhaustive
	switch(type.kind) {
		case Meta.ETypeKind.STRING:
			return "String"
		case Meta.ETypeKind.NUMBER:
			return "Number"
		case Meta.ETypeKind.LITERAL:
			return `Literal<${ type.values.join(" | ") }>`
		case Meta.ETypeKind.TUPLE:
			const types = type.types.map(type => getTypeString(type))
			return `Tuple<[${ types.join(", ") }]>`
		case Meta.ETypeKind.ERROR:
			return `Error`
	}

}