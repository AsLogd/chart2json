import * as Util from "./Util"
import * as Meta from "./Meta"

export  {Difficulty, Instrument} from "./Meta"

export type GuitarInstrument =
	| Meta.Instrument.SINGLE
	| Meta.Instrument.DOUBLEGUITAR
	| Meta.Instrument.DOUBLEBASS
	| Meta.Instrument.DOUBLERHYTHM
	| Meta.Instrument.KEYBOARD

export function isGuitar(instrument: Meta.Instrument): instrument is GuitarInstrument {
	return(
			instrument === Meta.Instrument.SINGLE
		|| 	instrument === Meta.Instrument.DOUBLEGUITAR
		|| 	instrument === Meta.Instrument.DOUBLEBASS
		|| 	instrument === Meta.Instrument.DOUBLERHYTHM
		|| 	instrument === Meta.Instrument.KEYBOARD
	)
}

export type DrumsInstrument =
	| Meta.Instrument.DRUMS

export function isDrums(instrument: Meta.Instrument): instrument is DrumsInstrument {
	return(
			instrument === Meta.Instrument.DRUMS
	)
}

export type GHLInstrument =
	| Meta.Instrument.GHLGUITAR
	| Meta.Instrument.GHLBASS

export function isGHL(instrument: Meta.Instrument): instrument is GHLInstrument {
	return(
			instrument === Meta.Instrument.GHLGUITAR
		|| 	instrument === Meta.Instrument.GHLBASS
	)
}

export interface Chart {
	song: SongSection
	syncTrack: SyncTrackSection
	events?: EventsSection
	difficulties: Difficulties
}

export type Difficulties = {
	[difficulty in Meta.Difficulty]?: InstrumentTracks
}

export type AudioStreams = {
	[stream in AudioStream]?: string
}

export type SongSection = {
	audioStreams:	AudioStreams
	resolution: 	number
	name?: 			string
	artist?: 		string
	album?:			string
	charter?: 		string
	player2?: 		string
	genre?: 		string
	mediaType?:		string
	year?: 			number
	offset?: 		number
	difficulty?: 	number
	previewStart?: 	number
	previewEnd?: 	number
}

export enum AudioStream {
	MUSICSTREAM	 = "MusicStream",
	GUITARSTREAM = "GuitarStream",
	RHYTHMSTREAM = "RhythmStream",
	BASSSTREAM	 = "BassStream",
	DRUMSTREAM	 = "DrumStream",
	DRUM2STREAM	 = "Drum2Stream",
	DRUM3STREAM	 = "Drum3Stream",
	DRUM4STREAM	 = "Drum4Stream",
	VOCALSTREAM	 = "VocalStream",
	KEYSSTREAM	 = "KeysStream",
	CROWDSTREAM	 = "CrowdStream",
}

export type Tick<T> = T[]

export interface SyncTrackSection {
	[tick: number]: Tick<SyncTrackEvent>
}

export type SyncTrackEvent =
	| Bpm
	| TimeSignature


export enum SyncTrackEventType {
	BPM,
	TIME_SIGNATURE
}

export interface Bpm {
	kind: SyncTrackEventType.BPM
	bpm: number
	anchorMicroSeconds?: number
}

export interface TimeSignature {
	kind: SyncTrackEventType.TIME_SIGNATURE
	signature: Signature
}

export interface Signature {
	numerator: number
	denominator: number
}

export interface EventsSection {
	[tick: number]: Tick<EventsEvent>
}

export type EventsEvent =
	| SectionEvent
	| PhraseStart
	| Lyric
	| PhraseEnd
	| ValueEvent


export enum EventsEventType {
	SECTION,
	PHRASE_START,
	LYRIC,
	PHRASE_END,
	VALUE_EVENT
}

export interface SectionEvent {
	kind: EventsEventType.SECTION
	name: string
}

export interface PhraseStart {
	kind: EventsEventType.PHRASE_START
}

export interface PhraseEnd {
	kind: EventsEventType.PHRASE_END
}

export interface Lyric {
	kind: EventsEventType.LYRIC,
	lyric: string
}

export interface ValueEvent {
	kind: EventsEventType.VALUE_EVENT,
	value: string
}

export type InstrumentTracks =
	& {[guitar in GuitarInstrument]?: Track< StringNote<GuitarLane> >}
	& {[drums in DrumsInstrument]?: Track<DrumsNote>}
	& {[ghl in GHLInstrument]?: Track< StringNote<GHLLane> >}


export interface Track<N> {
	[tick: number]: Tick< TrackEvent<N> >
}

export type TrackEvent<N> =
	| N
	| SpecialEvent
	| LiteralEvent

export enum GuitarLane {
	OPEN,
	LANE_1,
	LANE_2,
	LANE_3,
	LANE_4,
	LANE_5,
}

export interface Lane<T> {
	lane: 	 T
	sustain: number
}

export interface StringNote<T> {
	lanes: 	Lane<T>[]
	forced: boolean
	tap: 	boolean
}

export enum DrumsLane {
	PEDAL,
	SNARE,
	CYMBAL_1,
	TOM_1,
	CYMBAL_2,
	TOM_2
}

export interface DrumsNote  {
	lanes: 	Lane<DrumsLane>[]
}

export enum GHLLane {
	OPEN,
	WHITE_1,
	WHITE_2,
	WHITE_3,
	BLACK_1,
	BLACK_2,
	BLACK_3
}

export enum SpecialEventType {
	PLAYER1,
	PLAYER2,
	START_POWER
}

export interface SpecialEvent {
	type: SpecialEventType
	duration: number
}

export interface LiteralEvent {
	value: string
}

export function fromParsedChart(pc: Meta.ParsedChart): Chart {
	const chart: Chart = {
		song: songFromParsedSection( getParsedSection(Meta.SectionTitle.SONG, pc) ),
		syncTrack: syncTrackFromParsedSection( getParsedSection(Meta.SectionTitle.SYNC_TRACK, pc) ),
		difficulties: difficultiesFromParsedChart(pc)
	}
	const events = getParsedSection(Meta.SectionTitle.EVENTS, pc)
	if(events) {
		chart.events = eventsFromParsedSection(events)
	}

	return chart
}

function getParsedSection(title: Meta.SectionTitle, sections: Meta.ParsedSection[]): Meta.ParsedSection {
	return sections.find(sec => sec.title === title) as Meta.ParsedSection
}

function getOptionalParsedSection(title: Meta.SectionTitle, sections: Meta.ParsedSection[]): Meta.ParsedSection | null{
	const sec = sections.find(sec => sec.title === title)
	return sec || null
}

function eventsFromParsedSection(ps: Meta.ParsedSection): EventsSection {
	const section: EventsSection = {}
	const groupedTicks = Util.groupBy(ps.content, "key")
	const ticks = Object.keys(groupedTicks)
	for (const tick of ticks) {
		// Unnecessary
		const t = parseInt(tick)
		section[t] = groupedTicks[t].map(item => eventFromParsedItem(item))
	}

	return section
}

function eventFromParsedItem(item: Meta.ParsedItem): EventsEvent {
	const value = Util.extractQuotes(item.values[1].value)
	if (value.indexOf("section") === 0) {
		return {
			kind: EventsEventType.SECTION,
			name: value.split(" ")[1]
		}
	} else if (value.indexOf("phrase_start") === 0) {
		return {
			kind: EventsEventType.PHRASE_START
		}
	} else if (value.indexOf("phrase_end") === 0) {
		return {
			kind: EventsEventType.PHRASE_END
		}
	} else if (value.indexOf("lyric") === 0) {
		return {
			kind: EventsEventType.LYRIC,
			lyric: value.split(" ")[1]
		}
	} else {
		return {
			kind: EventsEventType.VALUE_EVENT,
			value: value
		}
	}
}

function songFromParsedSection(ps: Meta.ParsedSection): SongSection {
	const song: SongSection = {
		resolution: 192,
		audioStreams: {}
	}
	for (const item of ps.content) {
		const key = item.key as string
		if(key.includes("Stream")) {
			song.audioStreams[key as AudioStream] = Util.extractQuotes(item.values[0].value)
		} else {
			setSongValue(song, key, item.values[0].value)
		}
	}

	return song
}

function setSongValue(song: SongSection, key: string, value: string) {
	switch(key) {
		case Meta.SongKey.NAME:
			song.name = Util.extractQuotes(value)
			return
		case Meta.SongKey.ARTIST:
			song.artist = Util.extractQuotes(value)
			return
		case Meta.SongKey.ALBUM:
			song.album = Util.extractQuotes(value)
			return
		case Meta.SongKey.CHARTER:
			song.charter = Util.extractQuotes(value)
			return
		case Meta.SongKey.PLAYER2:
			song.player2 = Util.extractQuotes(value)
			return
		case Meta.SongKey.GENRE:
			song.genre = Util.extractQuotes(value)
			return
		case Meta.SongKey.MEDIATYPE:
			song.mediaType = Util.extractQuotes(value)
			return
		case Meta.SongKey.YEAR:
			const year = parseInt(value.replace(/\D/g,''))
			if (!isNaN(year)) {
				song.year = year
			}
			return
		case Meta.SongKey.RESOLUTION:
			song.resolution = parseInt(value)
			return
		case Meta.SongKey.OFFSET:
			song.offset = parseInt(value)
			return
		case Meta.SongKey.DIFFICULTY:
			song.difficulty = parseInt(value)
			return
		case Meta.SongKey.PREVIEWSTART:
			song.previewStart = parseInt(value)
			return
		case Meta.SongKey.PREVIEWEND:
			song.previewEnd = parseInt(value)
			return
	}
}

function syncTrackFromParsedSection(ps: Meta.ParsedSection): SyncTrackSection {
	const syncTrack: SyncTrackSection = {}
	const groupedTicks = Util.groupBy(ps.content, "key")
	const ticks = Object.keys(groupedTicks)
	for (const tick of ticks) {
		// Unnecessary
		const t = parseInt(tick)
		syncTrack[t] = groupedTicks[t].filter(item =>
			item.values[0].value === Meta.SyncTrackKey.BPM
		 ||	item.values[0].value === Meta.SyncTrackKey.TIME_SIGNATURE
		).map(item =>
			syncTrackEventFromParsedItem(item, tick, groupedTicks)
		)
	}
	return syncTrack
}

function syncTrackEventFromParsedItem(
	pi: Meta.ParsedItem,
	tick: string,
	groupedTicks: {[key: string]: Meta.ParsedItem[]}
): SyncTrackEvent {
	switch(pi.values[0].value) {
		case Meta.SyncTrackKey.BPM:
			const event: Bpm = {
				kind: SyncTrackEventType.BPM,
				bpm: parseInt(pi.values[1].value)/1000
			}
			const anchor = groupedTicks[tick].find(item =>
				item.values[0].value === Meta.SyncTrackKey.ANCHOR
			)
			if(anchor) {
				event.anchorMicroSeconds = parseInt(anchor.values[1].value)
			}
			return event
		case Meta.SyncTrackKey.TIME_SIGNATURE:
			return {
				kind: SyncTrackEventType.TIME_SIGNATURE,
				signature: {
					numerator: parseInt(pi.values[1].value),
					denominator: pi.values[2]
						? parseInt(pi.values[1].value)
						: 4
				}
			}
		default:
			// We filtered other possible values before
			console.assert(true, "Unkown sync track event", pi.values[0].value)
			return null as any
	}
}

function difficultiesFromParsedChart(pc: Meta.ParsedChart): Difficulties {
	const result : Difficulties = {}
	const difficulties = Object.values(Meta.Difficulty)
	for (const diff of difficulties) {
		const currentDiffSections = pc.filter(section => section.title.includes(diff))
		if (currentDiffSections.length > 0) {
			result[diff] = {}
			for (const section of currentDiffSections) {
				const instrument = section.title.slice(diff.length) as Meta.Instrument
				if(isGuitar(instrument)) {
					// We know the object exists
					result[diff]![instrument] = guitarTrackFromParsedItems(section.content)
				} else if (isDrums(instrument)) {
					// We know the object exists
					result[diff]![instrument] = drumsTrackFromParsedItems(section.content)
				} else if (isGHL(instrument)) {
					// We know the object exists
					result[diff]![instrument] = ghlTrackFromParsedItems(section.content)
				} else {
					continue
				}
			}
		}
	}
	return result
}

function specialEventFromParsedItem(item: Meta.ParsedItem): SpecialEvent {
	return {
		type: parseInt(item.values[1].value) as SpecialEventType,
		duration: parseInt(item.values[2].value)
	}
}

function literalEventFromParsedItem(item: Meta.ParsedItem): LiteralEvent {
	return {
		value: item.values[1].value
	}
}
// Refactor instrument functions
function guitarTrackFromParsedItems(items: Meta.ParsedItem[]): Track< StringNote<GuitarLane> > {
	const guitarTrack: Track< StringNote<GuitarLane> > = {}
	const groupedTicks = Util.groupBy(items, "key")
	const ticks = Object.keys(groupedTicks)
	for (const tick of ticks) {
		// Unnecessary
		const t = parseInt(tick)
		guitarTrack[t] = guitarEventsFromParsedItems(groupedTicks[t])
	}
	return guitarTrack
}

function guitarEventsFromParsedItems(items: Meta.ParsedItem[]): TrackEvent< StringNote<GuitarLane> >[] {
	const noteEvents = items.filter(item => item.values[0].value === Meta.TrackKey.NOTE)
	// There's at most on per tick
	const specialEvent = items.find(item => item.values[0].value === Meta.TrackKey.SPECIAL)
	const literalEvent = items.find(item => item.values[0].value === Meta.TrackKey.TRACK_EVENT)
	const tick = []
	if (noteEvents) {
		tick.push(guitarNoteFromParsedItems(noteEvents))
	}
	if (specialEvent) {
		tick.push(specialEventFromParsedItem(specialEvent))
	}
	if (literalEvent) {
		tick.push(literalEventFromParsedItem(literalEvent))
	}
	return tick
}

function guitarNoteFromParsedItems(items: Meta.ParsedItem[]): StringNote<GuitarLane> {
	const lanes = items.filter(item => {
		const value = parseInt(item.values[1].value)
		return(
				value !== Meta.GuitarNoteEventType.FORCED
			&& 	value !== Meta.GuitarNoteEventType.TAP
		)
	}).map(item => ({
		lane: 	 guitarLaneFromparsedLane(item.values[1].value),
		sustain: parseInt(item.values[2].value)
	}))
	return {
		lanes: 	lanes,
		forced: items.some(item => parseInt(item.values[1].value) === Meta.GuitarNoteEventType.FORCED),
		tap: 	items.some(item => parseInt(item.values[1].value) === Meta.GuitarNoteEventType.TAP),
	}
}

function guitarLaneFromparsedLane(parsed: string): GuitarLane {
	switch(parseInt(parsed)) {
		case Meta.GuitarNoteEventType.LANE_1:
			return GuitarLane.LANE_1
		case Meta.GuitarNoteEventType.LANE_2:
			return GuitarLane.LANE_2
		case Meta.GuitarNoteEventType.LANE_3:
			return GuitarLane.LANE_3
		case Meta.GuitarNoteEventType.LANE_4:
			return GuitarLane.LANE_4
		case Meta.GuitarNoteEventType.LANE_5:
			return GuitarLane.LANE_5
		case Meta.GuitarNoteEventType.OPEN:
			return GuitarLane.OPEN
	}
	// This should not happen as we filtered out other possibilities
	console.assert(true, "Unkown parsed guitar lane", parsed)
	return null as any
}

function drumsTrackFromParsedItems(items: Meta.ParsedItem[]): Track< DrumsNote > {
	const drumsTrack: Track< DrumsNote > = {}
	const groupedTicks = Util.groupBy(items, "key")
	const ticks = Object.keys(groupedTicks)
	for (const tick of ticks) {
		// Unnecessary
		const t = parseInt(tick)
		drumsTrack[t] = drumsEventsFromParsedItems(groupedTicks[t])
	}
	return drumsTrack
}

function drumsEventsFromParsedItems(items: Meta.ParsedItem[]): TrackEvent< DrumsNote >[] {
	const noteEvents = items.filter(item => item.values[0].value === Meta.TrackKey.NOTE)
	// There's at most on per tick
	const specialEvent = items.find(item => item.values[0].value === Meta.TrackKey.SPECIAL)
	const literalEvent = items.find(item => item.values[0].value === Meta.TrackKey.TRACK_EVENT)
	const tick = []
	if (noteEvents) {
		tick.push(drumsNoteFromParsedItems(noteEvents))
	}
	if (specialEvent) {
		tick.push(specialEventFromParsedItem(specialEvent))
	}
	if (literalEvent) {
		tick.push(literalEventFromParsedItem(literalEvent))
	}
	return tick
}

function drumsNoteFromParsedItems(items: Meta.ParsedItem[]): DrumsNote {
	const lanes = items.map(item => ({
		lane: 	 drumsLaneFromparsedLane(item.values[1].value),
		sustain: parseInt(item.values[2].value)
	}))
	return {
		lanes: 	lanes
	}
}

function drumsLaneFromparsedLane(parsed: string): DrumsLane {
	switch(parseInt(parsed)) {
		case Meta.DrumsNoteEventType.LANE_1:
			return DrumsLane.PEDAL
		case Meta.DrumsNoteEventType.LANE_2:
			return DrumsLane.SNARE
		case Meta.DrumsNoteEventType.LANE_3:
			return DrumsLane.CYMBAL_1
		case Meta.DrumsNoteEventType.LANE_4:
			return DrumsLane.TOM_1
		case Meta.DrumsNoteEventType.LANE_5:
			return DrumsLane.CYMBAL_2
		case Meta.DrumsNoteEventType.OPEN:
			return DrumsLane.TOM_2
	}
	// This should not happen as we filtered out other possibilities
	console.assert(true, "Unkown parsed drums lane", parsed)
	return null as any
}

function ghlTrackFromParsedItems(items: Meta.ParsedItem[]): Track< StringNote<GHLLane> > {
	const ghlTrack: Track< StringNote<GHLLane> > = {}
	const groupedTicks = Util.groupBy(items, "key")
	const ticks = Object.keys(groupedTicks)
	for (const tick of ticks) {
		// Unnecessary
		const t = parseInt(tick)
		ghlTrack[t] = ghlEventsFromParsedItems(groupedTicks[t])
	}
	return ghlTrack
}

function ghlEventsFromParsedItems(items: Meta.ParsedItem[]): TrackEvent< StringNote<GHLLane> >[] {
	const noteEvents = items.filter(item => item.values[0].value === Meta.TrackKey.NOTE)
	// There's at most on per tick
	const specialEvent = items.find(item => item.values[0].value === Meta.TrackKey.SPECIAL)
	const literalEvent = items.find(item => item.values[0].value === Meta.TrackKey.TRACK_EVENT)
	const tick = []
	if (noteEvents) {
		tick.push(ghlNoteFromParsedItems(noteEvents))
	}
	if (specialEvent) {
		tick.push(specialEventFromParsedItem(specialEvent))
	}
	if (literalEvent) {
		tick.push(literalEventFromParsedItem(literalEvent))
	}
	return tick
}

function ghlNoteFromParsedItems(items: Meta.ParsedItem[]): StringNote<GHLLane> {
	const lanes = items.filter(item => {
		const value = parseInt(item.values[1].value)
		return(
				value !== Meta.GuitarNoteEventType.FORCED
			&& 	value !== Meta.GuitarNoteEventType.TAP
		)
	}).map(item => ({
		lane: 	 ghlLaneFromParsedLane(item.values[1].value),
		sustain: parseInt(item.values[2].value)
	}))
	return {
		lanes: 	lanes,
		forced: items.some(item => parseInt(item.values[1].value) === Meta.GuitarNoteEventType.FORCED),
		tap: 	items.some(item => parseInt(item.values[1].value) === Meta.GuitarNoteEventType.TAP),
	}
}

function ghlLaneFromParsedLane(parsed: string): GHLLane {
	switch(parseInt(parsed)) {
		case Meta.GhlNoteEventType.OPEN:
			return GHLLane.OPEN
		case Meta.GhlNoteEventType.WHITE_1:
			return GHLLane.WHITE_1
		case Meta.GhlNoteEventType.WHITE_2:
			return GHLLane.WHITE_2
		case Meta.GhlNoteEventType.WHITE_3:
			return GHLLane.WHITE_3
		case Meta.GhlNoteEventType.BLACK_1:
			return GHLLane.BLACK_1
		case Meta.GhlNoteEventType.BLACK_2:
			return GHLLane.BLACK_2
		case Meta.GhlNoteEventType.BLACK_3:
			return GHLLane.BLACK_3
	}
	// This should not happen as we filtered out other possibilities
	console.assert(true, "Unkown parsed ghl lane", parsed)
	return null as any
}

