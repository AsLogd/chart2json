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
	const trackNames = Meta.getPossibleTrackNames()

	{ // Check required sections
		const requiredSectionError = checkRequiredSections(secs,
			[Meta.ESection.SONG, Meta.ESection.SYNC_TRACK],
			trackNames,
		)
		if (requiredSectionError) {
			return requiredSectionError
		}

	}

	{ // Check Song section
		const songSection = getSection(secs, Meta.ESection.SONG)
		const songSectionError = checkSongTypes(Meta.SongTypes, songSection.content)
		if (songSectionError) {
			return songSectionError
		}

	}

	{ // Check SyncTrack section
		const syncTrackSection = getSection(secs, Meta.ESection.SYNC_TRACK)
		const syncTrackSectionError = checkEventTypes(
			Meta.ESection.SYNC_TRACK,
			Meta.SyncTrackTypes,
			syncTrackSection.content
		)
		if (syncTrackSectionError) {
			return syncTrackSectionError
		}
	}

	{ // Check Events section
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
	}

	{ // Check Tracks (Difficulty+Instrument) sections
		for (const name of trackNames) {
			const currentTrackSection = getOptionalSection(secs, name)
			if (!currentTrackSection)
				continue
			const currentTrackSectionError = checkEventTypes(
				name,
				Meta.TrackTypes,
				currentTrackSection.content
			)
			if (currentTrackSectionError) {
				return currentTrackSectionError
			}
			// Non-drums instruments have flags that require notes (tap and forced)
			if (!name.includes(Meta.EInstrument.DRUMS)) {
				const noteFlagsError = checkGuitarNoteFlags(name, currentTrackSection.content)
				if(noteFlagsError) {
					return noteFlagsError
				}
			}
		}
	}

	return null

}

function checkRequiredSections(secs: Meta.ISection[], required: Meta.ESection[], oneOf: string[]): null | IError {
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

	const hasOneSectionOf = oneOf.some(sectionName =>
		!!(getOptionalSection(secs, sectionName))
	)

	if (!hasOneSectionOf) {
		return {
			reason: getErrorString(EError.MISSING_ONE_OF, {
				sections: oneOf
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

function getOptionalSection(sections: Meta.ISection[], sectionName: string): Meta.ISection | undefined {
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
				item: itemWithErr,
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
				item: itemWithErr,
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
						item: item,
						expected: Meta.FLiteral(literalValues),
						found: Meta.typeFromRawValue(item.values)
					})
				}
			}
		}
	}
	return null
}

function checkEventTypes(section: string, types: Meta.TEventsSectionType[], content: Meta.IItem[]): null | IError {
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
						item: item,
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
		&&	(
			// this is a free literal
			definition.values.length === 0
			// or value is equal to some of the defined values
			|| definition.values.some(val => values[0].value === val)
		)
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
			// We already checked that the event value is a string
			const eventSubtype = getEventSubtype(item)
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
		const eventSubtype = getEventSubtype(errorItem)
		return ({
			reason: getErrorString(EError.WRONG_LYRICS, {
				item: errorItem,
				found: eventSubtype
			})
		})
	}

	return null
}

function checkGuitarNoteFlags(section: string, content: Meta.IItem[]): IError | null {
	const notes = content.filter(item => item.values[0].value === Meta.ETrackKey.NOTE)
	const ticks = groupBy(notes, "key")

	const repeatedError = checkRepeatedNoteEvent(section, ticks)
	if (repeatedError) {
		return repeatedError
	}

	const tickFlagError = checkNoteFlags(section, ticks)
	if (tickFlagError) {
		return tickFlagError
	}

	return null
}

function checkRepeatedNoteEvent(section: string, ticks: {[tick: string]: Meta.IItem[]}): IError | null {
	const tickRepeatedEventError = Object.keys(ticks).find(tick => {
		const itemsOnSameTick = ticks[tick]
		return itemsOnSameTick.find(itemA => {
			const typeA = itemA.values[1].value
			return itemsOnSameTick.find(itemB => {
				const typeB = itemB.values[1].value
				if (itemA === itemB) {
					return false
				}
				return typeA === typeB
			})
		})
	})
	if (tickRepeatedEventError) {
		const found = ticks[tickRepeatedEventError].map(item => item.values[1].value)
		return ({
			reason: getErrorString(EError.DUPLICATE_NOTE_EVENT, {
				section,
				tick: parseInt(tickRepeatedEventError),
				foundValues: found
			})
		})
	}

	return null
}

function checkNoteFlags(section: string, ticks: {[tick: string]: Meta.IItem[]}): IError | null {
	const flagError = Object.keys(ticks).find(tick => {
		const itemsOnSameTick = ticks[tick]
		const tickIsFlagged = itemsOnSameTick.some(item =>{
			const value = parseInt(item.values[1].value)
			return (
					value === Meta.EGuitarNoteEventType.FORCED
				|| 	value === Meta.EGuitarNoteEventType.TAP
			)
		})

		const hasNotes = itemsOnSameTick.some(item =>{
			const value = parseInt(item.values[1].value)
			return (
					value !== Meta.EGuitarNoteEventType.FORCED
				&& 	value !== Meta.EGuitarNoteEventType.TAP
			)
		})
		const tickIsOk = !tickIsFlagged || hasNotes
		return !tickIsOk
	})
	if (flagError) {
		const found = ticks[flagError].map(item => item.values[1].value)
		return ({
			reason: getErrorString(EError.WRONG_NOTE_FLAG, {
				section,
				tick: parseInt(flagError),
				foundValues: found
			})
		})
	}

	return null
}

/**
 * @pre values has to be a string
 */
function getEventSubtype(item: Meta.IItem) {
	const eventValue = item.values[1].value as string
	// Remove quotes, get first word in string
	return eventValue.substr(1, eventValue.length-2).split(" ")[0]
}

// Util
// Groups a list of objects by the value of a given key
export function groupBy<T extends any>(list: T[], key: string): {[key: string]: T[]} {
	const groups:{[key: string]: T[]} = {}
	list.forEach(e => {
		if(!groups[e[key]]) {
			groups[e[key]] = [e]
		} else {
			groups[e[key]].push(e)
		}
	})
	return groups
}