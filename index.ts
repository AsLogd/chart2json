import Nearley from "nearley"
//the chart module will be available after build step
//@ts-ignore
import grammar from "./chart"
import {
	Failable,
	Failure,
	Success
} from "./failable"

export interface Chart {
	song: any
}

export interface ParseError {
	error: any
}

export default class Parser {
	static parse(text: string): Failable<Chart, ParseError> {
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
}