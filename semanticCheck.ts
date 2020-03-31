import {
	EError,
	IError,
	getErrorString
} from "./Error"

import {
	TChart,
	ISection,
	IItem,
	IAtom,
	ESection,
	TKey,
	ETypeKind,
	ISongTypes,
	ESongKey,
	SongTypes,
	FString,
	FNumber,
	FLiteral,
	typeFromRawValue,
	ILiteralType
} from "./Meta"

/*
 * Performs a semantic check on a syntactically correct chart file
 */
export default function semanticCheck(chart: TChart): null | IError {
	return isValidChart(chart)
}

/*
 * Returns null if the chart is valid. Otherwise returns an error
 */
function isValidChart(secs: ISection[]): null | IError {
	if (!containsSectionOnce(secs, ESection.SONG)) {
		return {
			reason: getErrorString(EError.MISSING_SECTION, {
				section: ESection.SONG
			})
		}
	}

	const songSection = getSection(secs, ESection.SONG)
	const songSectionError = checkSongTypes(SongTypes, songSection.content)
	if (songSectionError) {
		return songSectionError
	}

	return null

}

/*
 * Gets the specified section
 * @pre The section should exist
 */
function getSection(sections: ISection[], sectionName: ESection): ISection {
	return sections.find(x => x.title === sectionName) as ISection
}

function containsSectionOnce(sections: ISection[], sectionName: ESection) {
	//console.log("in cso:", sections, sectionName)
	return sections.filter(x => x.title === sectionName).length === 1
}

function checkSongTypes(types: ISongTypes, content: IItem[]): null | IError {
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

function checkSongRequiredItems(required: ESongKey[], content: IItem[]): null | IError {
	for (const reqItem of required) {
		const isFound = content.some(item =>
			item.key === reqItem
		)
		if (!isFound) {
			return {
				reason: getErrorString(EError.MISSING_REQUIRED_ITEM, {
					section: ESection.SONG,
					item: reqItem
				})
			}
		}
	}
	return null
}

function checkSongStringItems(keys: ESongKey[], content: IItem[]): null | IError {
	const strItems = content.filter(item =>
		keys.some(key => item.key === key)
	)
	const itemWithErr = strItems.find(item =>
			item.values.length !== 1
		|| 	item.values[0].type !== "string"
	)

	if (itemWithErr) {
		return {
			reason: getErrorString(EError.WRONG_TYPE, {
				section: ESection.SONG,
				item: itemWithErr.key,
				expected: FString(),
				found: typeFromRawValue(itemWithErr.values)
			})
		}
	}

	return null
}

function checkSongNumberItems(keys: ESongKey[], content: IItem[]): null | IError {
	const numItems = content.filter(item =>
		keys.some(key => item.key === key)
	)
	const itemWithErr = numItems.find(item =>
			item.values.length !== 1
		|| 	item.values[0].type !== "number"
	)

	if (itemWithErr) {
		return {
			reason: getErrorString(EError.WRONG_TYPE, {
				section: ESection.SONG,
				item: itemWithErr.key,
				expected: FNumber(),
				found: typeFromRawValue(itemWithErr.values)
			})
		}
	}
	return null
}

function checkSongLiteralItems(literalTuples: [ESongKey, ILiteralType][], content: IItem[]): null | IError {
	let literalValues: string[] = []
	const itemWithErr = content.find( item => {
		// Corresponding tuple describing this literal
		const tuple = literalTuples.find(tuple => tuple[0] === item.key)
		if (!tuple) {
			// If no tuple found, it's not a literal
			return false
		}

		const hasOneValue = item.values.length === 1
		// Literal should have one value
		if(!hasOneValue) {
			return true
		}
		literalValues = tuple[1].values
		// Value is ok if it's equal to any of the defined literal values
		const valueIsOk = literalValues.some(definedLiteral =>
			definedLiteral === item.values[0].value
		)
		return !valueIsOk
	} )
	if (itemWithErr) {
		return {
			reason: getErrorString(EError.WRONG_TYPE, {
				section: ESection.SONG,
				item: itemWithErr.key,
				expected: FLiteral(literalValues),
				found: typeFromRawValue(itemWithErr.values)
			})
		}
	}
	return null
}

//tsc semanticCheck.ts --lib 'es2018','dom' --module 'commonjs'
//npx nearleyc chart.ne -o chart.js
//npx nearley-test chart.js