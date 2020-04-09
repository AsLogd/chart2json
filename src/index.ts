import Nearley from "nearley"
//the grammar module will be available after build step
//@ts-ignore
import grammar from "./grammar"


import * as Meta 		from "./Meta"
import * as Chart 		from "./Chart"
import * as RawChart 	from "./RawChart"
import {
	Failable,
	Failure,
	Success
} from "./Failable"

import check from "./Semantic"

export interface ParseError {
	error: any
}

function executeParser(text: string): Failable<Meta.ParsedChart, ParseError> {
	const parser = new Nearley.Parser(
		Nearley.Grammar.fromCompiled(grammar)
	)

	try {
		parser.feed(text);
	} catch (err) {
		return Failure({error: err})
	}

	if (parser.results.length < 1) {
		return Failure({error: "Invalid Chart file"})
	}

	return Success(parser.results[0])
}

function parseChart(text: string, semanticCheck?: boolean): Failable<Meta.ParsedChart, ParseError> {
	const shouldCheckSemantics = semanticCheck !== undefined ? semanticCheck : false
	const parseResult = executeParser(text)
	if (parseResult.tag === "failure") {
		return parseResult
	}

	const parsedChart = parseResult.value
	if (shouldCheckSemantics) {
		const semanticError = check(parsedChart)
		if (semanticError) {
			return Failure({error: semanticError})
		}
	}

	return Success(parsedChart)
}

export default class Parser {
	static parseRaw(text: string, semanticCheck?: boolean): Failable<RawChart.RawChart, ParseError> {
		const parseResult = parseChart(text, semanticCheck)
		if (parseResult.tag === "failure") {
			return parseResult
		}

		return Success(
			RawChart.fromParsedChart(parseResult.value)
		)
	}
	/*
	static parse(text: string): Failable<Chart.Chart, ParseError> {
		const parseResult = parseChart(text, true)
		if (parseResult.tag === "failure") {
			return parseResult
		}

		return Success(
			Chart.fromParsedChart(parseResult.value)
		)
	}
	*/
}