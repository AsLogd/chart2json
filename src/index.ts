import Nearley from "nearley"
//the grammar module will be available after build step
//@ts-ignore
import grammar from "./grammar"


import * as Meta 		from "./Meta"
import * as Chart 		from "./Chart"
import * as RawChart 	from "./RawChart"
import {ErrorObject}	from "./Error"
import {
	Failable,
	Failure,
	Success
} from "./Failable"

import check from "./Semantic"

export * as Meta 		from "./Meta"
export * as Chart 		from "./Chart"
export * as RawChart 	from "./RawChart"
export * as Failable 	from "./Failable"
export {ErrorObject}	from "./Error"

function executeParser(text: string): Failable<Meta.ParsedChart, ErrorObject> {
	const parser = new Nearley.Parser(
		Nearley.Grammar.fromCompiled(grammar)
	)

	try {
		parser.feed(text);
	} catch (err) {
		return Failure({reason: err})
	}

	if (parser.results.length < 1) {
		return Failure({reason: "Invalid Chart file"})
	} else if(parser.results.length > 1) {
		console.warn("chart2json: Ambiguous input")
	}

	return Success(parser.results[0])
}

function parseChart(text: string, semanticCheck?: boolean): Failable<Meta.ParsedChart, ErrorObject> {
	const shouldCheckSemantics = semanticCheck !== undefined ? semanticCheck : false
	const parseResult = executeParser(text)
	if (!parseResult.ok) {
		return parseResult
	}

	const parsedChart = parseResult.value
	if (shouldCheckSemantics) {
		const semanticError = check(parsedChart)
		if (semanticError) {
			return Failure(semanticError)
		}
	}

	return Success(parsedChart)
}

export default class Parser {
	static parseRaw(text: string, semanticCheck?: boolean): Failable<RawChart.RawChart, ErrorObject> {
		const parseResult = parseChart(text, semanticCheck)
		if (!parseResult.ok) {
			return parseResult
		}

		return Success(
			RawChart.fromParsedChart(parseResult.value)
		)
	}

	static parse(text: string): Failable<Chart.Chart, ErrorObject> {
		const parseResult = parseChart(text, true)
		if (!parseResult.ok) {
			return parseResult
		}

		return Success(
			Chart.fromParsedChart(parseResult.value)
		)
	}
}