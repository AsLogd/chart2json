import * as Meta from "./Meta"

export interface RawChart {
	sections: RawSection[]
}

export interface RawSection {
	title: string
	content: RawContent
}

export interface RawContent {
	[key: string]: RawAtom[]
}

export type RawAtom =
	| string
	| number

export function fromParsedChart(pc: Meta.ParsedChart): RawChart {
	return {
		sections: pc.map(ps => fromParsedSection(ps))
	}
}

function fromParsedSection(ps: Meta.ParsedSection): RawSection {
	return {
		title: ps.title,
		content: fromParsedItems(ps.content)
	}
}

function fromParsedItems(pis: Meta.ParsedItem[]): RawContent {
	const rawContent = {} as RawContent
	for (const item of pis) {
		rawContent[item.key] = item.values.map(patom => fromParsedAtom(patom))
	}
	return rawContent
}

function fromParsedAtom(patom: Meta.ParsedAtom): RawAtom {
	if (patom.type === "number") {
		return parseInt(patom.value)
	}
	return patom.value
}