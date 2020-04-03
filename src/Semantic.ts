import {
	EError,
	IError,
	getErrorString
} from "./Error"

import * as Meta from "./Meta"

/*
 * Performs a semantic check on a syntactically correct chart file
 */
export default function semanticCheck(chart: Meta.TChart): null | IError {
	return checkChart(chart)
}

/*
 * Returns null if the chart is valid. Otherwise returns an error
 */
function checkChart(secs: Meta.ISection[]): null | IError {
	const requiredSectionError = checkRequiredSections(secs, [
		Meta.ESection.SONG,
		Meta.ESection.SYNC_TRACK
	])
	if (requiredSectionError) {
		return requiredSectionError
	}

	const songSection = getSection(secs, Meta.ESection.SONG)
	const songSectionError = checkSongTypes(Meta.SongTypes, songSection.content)
	if (songSectionError) {
		return songSectionError
	}

	const syncTrackSection = getSection(secs, Meta.ESection.SYNC_TRACK)
	const syncTrackSectionError = checkEventTypes(
		Meta.ESection.SYNC_TRACK,
		Meta.SyncTrackTypes,
		syncTrackSection.content
	)
	if (syncTrackSectionError) {
		return syncTrackSectionError
	}

	const eventsSection = getOptionalSection(secs, Meta.ESection.EVENTS)
	if (eventsSection) {
		const eventsSectionTypeError = checkEventTypes(
			Meta.ESection.EVENTS,
			Meta.EventTypes,
			eventsSection.content
		)
		if (eventsSectionTypeError) {
			return eventsSectionTypeError
		}
		const lyricsPhraseError = checkLyricsPhrases(eventsSection.content)
		if (lyricsPhraseError) {
			return lyricsPhraseError
		}
	}

	return null

}

function checkRequiredSections(secs: Meta.ISection[], required: Meta.ESection[]): null | IError {
	const wrongCountSection = required.find(reqSec =>
		!containsSectionExactlyOnce(secs, reqSec)
	)

	if (wrongCountSection) {
		return {
			reason: getErrorString(EError.WRONG_SECTION_COUNT, {
				section: wrongCountSection
			})
		}
	}

	return null
}

/*
 * Gets the specified section
 * @pre The section should exist
 */
function getSection(sections: Meta.ISection[], sectionName: Meta.ESection): Meta.ISection {
	return sections.find(x => x.title === sectionName) as Meta.ISection
}

function getOptionalSection(sections: Meta.ISection[], sectionName: Meta.ESection): Meta.ISection | undefined {
	return sections.find(x => x.title === sectionName)
}

function containsSectionExactlyOnce(sections: Meta.ISection[], sectionName: Meta.ESection) {
	return sections.filter(x => x.title === sectionName).length === 1
}

function checkSongTypes(types: Meta.ISongTypes, content: Meta.IItem[]): null | IError {
	const {
		required= [],
		string 	= [],
		number 	= [],
		literal = []
	} = types

	const requiredError = checkSongRequiredItems(required, content)
	if (requiredError) {
		return requiredError
	}
	const songStringError = checkSongStringItems(string, content)
	if (songStringError) {
		return songStringError
	}
	const songNumberError = checkSongNumberItems(number, content)
	if (songNumberError) {
		return songNumberError
	}
	const songLiteralError = checkSongLiteralItems(literal, content)
	if (songLiteralError) {
		return songLiteralError
	}

	return null
}

function checkSongRequiredItems(required: Meta.ESongKey[], content: Meta.IItem[]): null | IError {
	for (const reqItem of required) {
		const isFound = content.some(item =>
			item.key === reqItem
		)
		if (!isFound) {
			return {
				reason: getErrorString(EError.MISSING_REQUIRED_ITEM, {
					section: Meta.ESection.SONG,
					itemKey: reqItem
				})
			}
		}
	}
	return null
}

function checkSongStringItems(keys: Meta.ESongKey[], content: Meta.IItem[]): null | IError {
	const strItems = content.filter(item =>
		keys.some(key => item.key === key)
	)
	const itemWithErr = strItems.find(item => !isValidString(item.values))
	if (itemWithErr) {
		return {
			reason: getErrorString(EError.WRONG_TYPE, {
				section: Meta.ESection.SONG,
				item: itemWithErr.key,
				expected: Meta.FString(),
				found: Meta.typeFromRawValue(itemWithErr.values)
			})
		}
	}

	return null
}

function checkSongNumberItems(keys: Meta.ESongKey[], content: Meta.IItem[]): null | IError {
	const numItems = content.filter(item =>
		keys.some(key => item.key === key)
	)
	const itemWithErr = numItems.find(item => !isValidNumber(item.values))

	if (itemWithErr) {
		return {
			reason: getErrorString(EError.WRONG_TYPE, {
				section: Meta.ESection.SONG,
				item: itemWithErr.key,
				expected: Meta.FNumber(),
				found: Meta.typeFromRawValue(itemWithErr.values)
			})
		}
	}
	return null
}

function checkSongLiteralItems(literalTuples: [Meta.ESongKey, Meta.ILiteralType][], content: Meta.IItem[]): null | IError {
	let literalValues: string[] = []
	const tupleItemMap = literalTuples.map(tuple => ({
		tuple,
		items: content.filter(item => tuple[0] === item.key)
	}))
	for (const ti of tupleItemMap) {
		for (const item of ti.items) {
			if (!isValidLiteral(item.values, ti.tuple[1])) {
				return {
					reason: getErrorString(EError.WRONG_TYPE, {
						section: Meta.ESection.SONG,
						item: item.key,
						expected: Meta.FLiteral(literalValues),
						found: Meta.typeFromRawValue(item.values)
					})
				}
			}
		}
	}
	return null
}

function checkEventTypes(section: Meta.ESection, types: Meta.TEventsSectionType[], content: Meta.IItem[]): null | IError {
	const itemError = content.find(item => !isValidEventItem(item))
	if (itemError) {
		return {
			reason: getErrorString(EError.INVALID_EVENT_ITEM, {
				section,
				item: itemError
			})
		}
	}

	for (const type of types) {
		const [ eventKey, expectedType, isRequired ] = type
		const relevantItems = content.filter(item =>
			item.values[0].value === type[0]
		)
		if (isRequired && relevantItems.length === 0) {
			return {
				reason: getErrorString(EError.MISSING_REQUIRED_EVENT, {
					section: section,
					eventKey: type[0]
				})
			}
		}
		for (const item of relevantItems) {
			const eventValues = item.values.slice(1)
			if (!isValidType(eventValues, expectedType)) {
				return({
					reason: getErrorString(EError.WRONG_TYPE, {
						section,
						item: item.key,
						expected: expectedType,
						found: Meta.typeFromRawValue(eventValues)
					})
				})
			}

		}
	}

	return null
}

function isValidType(values: Meta.IAtom[], type: Meta.TValueType): boolean {
	switch(type.kind) {
		case Meta.ETypeKind.NUMBER:
			return isValidNumber(values)
		case Meta.ETypeKind.STRING:
			return isValidString(values)
		case Meta.ETypeKind.LITERAL:
			return isValidLiteral(values, type)
		case Meta.ETypeKind.TUPLE:
			return isValidTuple(values, type)
		case Meta.ETypeKind.EITHER:
			return isValidEither(values, type)
		case Meta.ETypeKind.ERROR:
			return false
	}
}

function isValidNumber(values: Meta.IAtom[]): boolean {
	return 	values.length === 1
		&& 	values[0].type === "number"
}

function isValidString(values: Meta.IAtom[]): boolean {
	return 	values.length === 1
		&& 	values[0].type === "string"
}

function isValidLiteral(values: Meta.IAtom[], definition: Meta.ILiteralType): boolean {
	return 	values.length === 1
		&& 	values[0].type === "literal"
		// value is equal to some of the defined values
		&&	definition.values.some(val => values[0].value === val)
}

function isValidTuple(values: Meta.IAtom[], definition: Meta.ITupleType): boolean {
	return 	values.length > 0
		&&	values.every((value, idx) =>
			isValidType([value], definition.types[idx])
		)
}

function isValidEither(values: Meta.IAtom[], definition: Meta.IEitherType): boolean {
	return 	values.length > 0
		&&	definition.types.some(type =>
			isValidType(values, type)
		)
}

/*
 * Check whether the key is a valid positive finite integer
 */
function isValidEventItem(item: Meta.IItem) {
	const n = parseInt(""+item.key)
	const hasValidItemKey = !isNaN(n) && isFinite(n) && n >= 0
	const hasValidValueKey = item.values
		&& item.values.length > 0
		&& item.values[0].type === "literal"

	return hasValidItemKey && hasValidValueKey
}

/*
 * lyric and phrase_end events should be preceded by a phrase_start
 *
 */
function checkLyricsPhrases(content: Meta.IItem[]): IError | null {
	let inPhrase = false
	const errorItem = content.find(item => {
		const eventType = item.values[0].value
		if (eventType === Meta.EEventsKey.EVENT) {
			// We already checked that all events are strings
			const eventValue = item.values[1].value as string
			const eventSubtype = eventValue.split(" ")[0]
			switch (eventSubtype) {
				case "phrase_start":
					inPhrase = true
					return false
				case "phrase_end":
					if (inPhrase) {
						inPhrase = false
						return false
					} else {
						// Error. phrase_end not in phrase
						return true
					}
				case "lyric":
					// Error only if not in frase
					return !inPhrase
			}
		}
	})
	if(errorItem) {
		const eventValue = errorItem.values[1].value as string
		const eventSubtype = eventValue.split(" ")[0]
		return ({
			reason: getErrorString(EError.WRONG_LYRICS, {
				item: errorItem,
				found: eventSubtype
			})
		})
	}

	return null
}

//tsc semanticCheck.ts --lib 'es2018','dom' --module 'commonjs'
//npx nearleyc chart.ne -o chart.js
//npx nearley-test chart.js