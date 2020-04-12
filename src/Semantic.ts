import {
	ErrorType,
	ErrorObject,
	getErrorString
} from "./Error"

import * as Meta from "./Meta"
import * as Util from "./Util"


/*
 * Performs a semantic check on a syntactically correct chart file
 */
export default function semanticCheck(chart: Meta.ParsedChart): null | ErrorObject {
	return checkChart(chart)
}

/*
 * Returns null if the chart is valid. Otherwise returns an error
 */
function checkChart(secs: Meta.ParsedSection[]): null | ErrorObject {
	const trackNames = Meta.getPossibleTrackNames()

	{ // Check required sections
		const requiredSectionError = checkRequiredSections(secs,
			[Meta.SectionTitle.SONG, Meta.SectionTitle.SYNC_TRACK],
			trackNames,
		)
		if (requiredSectionError) {
			return requiredSectionError
		}

	}

	{ // Check Song section
		const songSection = getSection(secs, Meta.SectionTitle.SONG)
		const songSectionError = checkSongTypes(Meta.SongTypes, songSection.content)
		if (songSectionError) {
			return songSectionError
		}

	}

	{ // Check SyncTrack section
		const syncTrackSection = getSection(secs, Meta.SectionTitle.SYNC_TRACK)
		const syncTrackSectionError = checkEventTypes(
			Meta.SectionTitle.SYNC_TRACK,
			Meta.SyncTrackTypes,
			syncTrackSection.content
		)
		if (syncTrackSectionError) {
			return syncTrackSectionError
		}
		const unpairedAnchorError = checkAnchorPairings(syncTrackSection.content)
		if (unpairedAnchorError) {
			return unpairedAnchorError
		}
	}

	{ // Check Events section
		const eventsSection = getOptionalSection(secs, Meta.SectionTitle.EVENTS)
		if (eventsSection) {
			const eventsSectionTypeError = checkEventTypes(
				Meta.SectionTitle.EVENTS,
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
			if (!name.includes(Meta.Instrument.DRUMS)) {
				const noteFlagsError = checkGuitarNoteFlags(name, currentTrackSection.content)
				if(noteFlagsError) {
					return noteFlagsError
				}
			}
		}
	}

	return null

}

function checkRequiredSections(secs: Meta.ParsedSection[], required: Meta.SectionTitle[], oneOf: string[]): null | ErrorObject {
	const wrongCountSection = required.find(reqSec =>
		!containsSectionExactlyOnce(secs, reqSec)
	)

	if (wrongCountSection) {
		return {
			reason: getErrorString(ErrorType.WRONG_SECTION_COUNT, {
				section: wrongCountSection
			})
		}
	}

	const hasOneSectionOf = oneOf.some(sectionName =>
		!!(getOptionalSection(secs, sectionName))
	)

	if (!hasOneSectionOf) {
		return {
			reason: getErrorString(ErrorType.MISSING_ONE_OF, {
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
function getSection(sections: Meta.ParsedSection[], sectionName: Meta.SectionTitle): Meta.ParsedSection {
	return sections.find(x => x.title === sectionName) as Meta.ParsedSection
}

function getOptionalSection(sections: Meta.ParsedSection[], sectionName: string): Meta.ParsedSection | undefined {
	return sections.find(x => x.title === sectionName)
}

function containsSectionExactlyOnce(sections: Meta.ParsedSection[], sectionName: Meta.SectionTitle) {
	return sections.filter(x => x.title === sectionName).length === 1
}

function checkSongTypes(types: Meta.SongTypes, content: Meta.ParsedItem[]): null | ErrorObject {
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

function checkSongRequiredItems(required: Meta.SongKey[], content: Meta.ParsedItem[]): null | ErrorObject {
	for (const reqItem of required) {
		const isFound = content.some(item =>
			item.key === reqItem
		)
		if (!isFound) {
			return {
				reason: getErrorString(ErrorType.MISSING_REQUIRED_ITEM, {
					section: Meta.SectionTitle.SONG,
					itemKey: reqItem
				})
			}
		}
	}
	return null
}

function checkSongStringItems(keys: Meta.SongKey[], content: Meta.ParsedItem[]): null | ErrorObject {
	const strItems = content.filter(item =>
		keys.some(key => item.key === key)
	)
	const itemWithErr = strItems.find(item => !isValidString(item.values))
	if (itemWithErr) {
		return {
			reason: getErrorString(ErrorType.WRONG_TYPE, {
				section: Meta.SectionTitle.SONG,
				item: itemWithErr,
				expected: Meta.TString(),
				found: Meta.typeFromRawValue(itemWithErr.values)
			})
		}
	}

	return null
}

function checkSongNumberItems(keys: Meta.SongKey[], content: Meta.ParsedItem[]): null | ErrorObject {
	const numItems = content.filter(item =>
		keys.some(key => item.key === key)
	)
	const itemWithErr = numItems.find(item => !isValidNumber(item.values))

	if (itemWithErr) {
		return {
			reason: getErrorString(ErrorType.WRONG_TYPE, {
				section: Meta.SectionTitle.SONG,
				item: itemWithErr,
				expected: Meta.TNumber(),
				found: Meta.typeFromRawValue(itemWithErr.values)
			})
		}
	}
	return null
}

function checkSongLiteralItems(literalTuples: [Meta.SongKey, Meta.LiteralType][], content: Meta.ParsedItem[]): null | ErrorObject {
	let literalValues: string[] = []
	const tupleItemMap = literalTuples.map(tuple => ({
		tuple,
		items: content.filter(item => tuple[0] === item.key)
	}))
	for (const ti of tupleItemMap) {
		for (const item of ti.items) {
			if (!isValidLiteral(item.values, ti.tuple[1])) {
				return {
					reason: getErrorString(ErrorType.WRONG_TYPE, {
						section: Meta.SectionTitle.SONG,
						item: item,
						expected: Meta.TLiteral(literalValues),
						found: Meta.typeFromRawValue(item.values)
					})
				}
			}
		}
	}
	return null
}

function checkEventTypes(section: string, types: Meta.EventsSectionType[], content: Meta.ParsedItem[]): null | ErrorObject {
	const itemError = content.find(item => !isValidEventItem(item))
	if (itemError) {
		return {
			reason: getErrorString(ErrorType.INVALID_EVENT_ITEM, {
				section,
				item: itemError
			})
		}
	}

	for (const type of types) {
		const [ eventKey, expectedType, isRequired ] = type
		const relevantItems = content.filter(item =>
			item.values[0].value === eventKey
		)
		if (isRequired && relevantItems.length === 0) {
			return {
				reason: getErrorString(ErrorType.MISSING_REQUIRED_EVENT, {
					section: section,
					eventKey
				})
			}
		}
		for (const item of relevantItems) {
			const eventValues = item.values.slice(1)
			if (!isValidType(eventValues, expectedType)) {
				return({
					reason: getErrorString(ErrorType.WRONG_TYPE, {
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

function isValidType(values: Meta.ParsedAtom[], type: Meta.ValueType): boolean {
	switch(type.kind) {
		case Meta.TypeKind.NUMBER:
			return isValidNumber(values)
		case Meta.TypeKind.STRING:
			return isValidString(values)
		case Meta.TypeKind.LITERAL:
			return isValidLiteral(values, type)
		case Meta.TypeKind.TUPLE:
			return isValidTuple(values, type)
		case Meta.TypeKind.EITHER:
			return isValidEither(values, type)
		case Meta.TypeKind.ERROR:
			return false
	}
}

function isValidNumber(values: Meta.ParsedAtom[]): boolean {
	return 	values.length === 1
		&& 	values[0].type === "number"
}

function isValidString(values: Meta.ParsedAtom[]): boolean {
	return 	values.length === 1
		&& 	values[0].type === "string"
}

function isValidLiteral(values: Meta.ParsedAtom[], definition: Meta.LiteralType): boolean {
	return 	values.length === 1
		&& 	values[0].type === "literal"
		&&	(
			// this is a free literal
			definition.values.length === 0
			// or value is equal to some of the defined values
			|| definition.values.some(val => values[0].value === val)
		)
}

function isValidTuple(values: Meta.ParsedAtom[], definition: Meta.TupleType): boolean {
	return 	values.length === definition.types.length
		&&	values.every((value, idx) =>
			isValidType([value], definition.types[idx])
		)
}

function isValidEither(values: Meta.ParsedAtom[], definition: Meta.EitherType): boolean {
	return 	values.length > 0
		&&	definition.types.some(type =>
			isValidType(values, type)
		)
}

/*
 * Check whether the key is a valid positive finite integer
 */
function isValidEventItem(item: Meta.ParsedItem) {
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
function checkLyricsPhrases(content: Meta.ParsedItem[]): ErrorObject | null {
	let inPhrase = false
	const errorItem = content.find(item => {
		const eventType = item.values[0].value
		if (eventType === Meta.EventsKey.EVENT) {
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
			reason: getErrorString(ErrorType.WRONG_LYRICS, {
				item: errorItem,
				found: eventSubtype
			})
		})
	}

	return null
}

function checkAnchorPairings(content: Meta.ParsedItem[]): ErrorObject | null {
	const ticks = Util.groupBy(content, "key")
	const ticksWithAnchor = Object.keys(ticks).filter(t =>
		ticks[t].some(item =>
			item.values[0].value === Meta.SyncTrackKey.ANCHOR
		)
	)

	const unpairedTick = ticksWithAnchor.find(t =>
		!ticks[t].some(item =>
			item.values[0].value === Meta.SyncTrackKey.BPM
		)
	)
	if (unpairedTick) {
		return ({
			reason: getErrorString(ErrorType.UNPAIRED_ANCHOR, {
				tick: parseInt(unpairedTick)
			})
		})
	}

	return null

}

function checkGuitarNoteFlags(section: string, content: Meta.ParsedItem[]): ErrorObject | null {
	const notes = content.filter(item => item.values[0].value === Meta.TrackKey.NOTE)
	const ticks = Util.groupBy(notes, "key")

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

function checkRepeatedNoteEvent(section: string, ticks: {[tick: string]: Meta.ParsedItem[]}): ErrorObject | null {
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
			reason: getErrorString(ErrorType.DUPLICATE_NOTE_EVENT, {
				section,
				tick: parseInt(tickRepeatedEventError),
				foundValues: found
			})
		})
	}

	return null
}

function checkNoteFlags(section: string, ticks: {[tick: string]: Meta.ParsedItem[]}): ErrorObject | null {
	const flagError = Object.keys(ticks).find(tick => {
		const itemsOnSameTick = ticks[tick]
		const tickIsFlagged = itemsOnSameTick.some(item =>{
			const value = parseInt(item.values[1].value)
			return (
					value === Meta.GuitarNoteEventType.FORCED
				|| 	value === Meta.GuitarNoteEventType.TAP
			)
		})

		const hasNotes = itemsOnSameTick.some(item =>{
			const value = parseInt(item.values[1].value)
			return (
					value !== Meta.GuitarNoteEventType.FORCED
				&& 	value !== Meta.GuitarNoteEventType.TAP
			)
		})
		const tickIsOk = !tickIsFlagged || hasNotes
		return !tickIsOk
	})
	if (flagError) {
		const found = ticks[flagError].map(item => item.values[1].value)
		return ({
			reason: getErrorString(ErrorType.WRONG_NOTE_FLAG, {
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
function getEventSubtype(item: Meta.ParsedItem) {
	const eventValue = item.values[1].value as string
	// Remove quotes, get first word in string
	return eventValue.substr(1, eventValue.length-2).split(" ")[0]
}