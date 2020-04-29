"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Util = __importStar(require("./Util"));
const Meta = __importStar(require("./Meta"));
var Meta_1 = require("./Meta");
exports.Difficulty = Meta_1.Difficulty;
exports.Instrument = Meta_1.Instrument;
function isGuitar(instrument) {
    return (instrument === Meta.Instrument.SINGLE
        || instrument === Meta.Instrument.DOUBLEGUITAR
        || instrument === Meta.Instrument.DOUBLEBASS
        || instrument === Meta.Instrument.DOUBLERHYTHM
        || instrument === Meta.Instrument.KEYBOARD);
}
exports.isGuitar = isGuitar;
function isDrums(instrument) {
    return (instrument === Meta.Instrument.DRUMS);
}
exports.isDrums = isDrums;
function isGHL(instrument) {
    return (instrument === Meta.Instrument.GHLGUITAR
        || instrument === Meta.Instrument.GHLBASS);
}
exports.isGHL = isGHL;
var AudioStream;
(function (AudioStream) {
    AudioStream["MUSICSTREAM"] = "MusicStream";
    AudioStream["GUITARSTREAM"] = "GuitarStream";
    AudioStream["RHYTHMSTREAM"] = "RhythmStream";
    AudioStream["BASSSTREAM"] = "BassStream";
    AudioStream["DRUMSTREAM"] = "DrumStream";
    AudioStream["DRUM2STREAM"] = "Drum2Stream";
    AudioStream["DRUM3STREAM"] = "Drum3Stream";
    AudioStream["DRUM4STREAM"] = "Drum4Stream";
    AudioStream["VOCALSTREAM"] = "VocalStream";
    AudioStream["KEYSSTREAM"] = "KeysStream";
    AudioStream["CROWDSTREAM"] = "CrowdStream";
})(AudioStream = exports.AudioStream || (exports.AudioStream = {}));
var SyncTrackEventType;
(function (SyncTrackEventType) {
    SyncTrackEventType[SyncTrackEventType["BPM"] = 0] = "BPM";
    SyncTrackEventType[SyncTrackEventType["TIME_SIGNATURE"] = 1] = "TIME_SIGNATURE";
})(SyncTrackEventType = exports.SyncTrackEventType || (exports.SyncTrackEventType = {}));
var EventsEventType;
(function (EventsEventType) {
    EventsEventType[EventsEventType["SECTION"] = 0] = "SECTION";
    EventsEventType[EventsEventType["PHRASE_START"] = 1] = "PHRASE_START";
    EventsEventType[EventsEventType["LYRIC"] = 2] = "LYRIC";
    EventsEventType[EventsEventType["PHRASE_END"] = 3] = "PHRASE_END";
    EventsEventType[EventsEventType["VALUE_EVENT"] = 4] = "VALUE_EVENT";
})(EventsEventType = exports.EventsEventType || (exports.EventsEventType = {}));
var GuitarLane;
(function (GuitarLane) {
    GuitarLane[GuitarLane["OPEN"] = 0] = "OPEN";
    GuitarLane[GuitarLane["LANE_1"] = 1] = "LANE_1";
    GuitarLane[GuitarLane["LANE_2"] = 2] = "LANE_2";
    GuitarLane[GuitarLane["LANE_3"] = 3] = "LANE_3";
    GuitarLane[GuitarLane["LANE_4"] = 4] = "LANE_4";
    GuitarLane[GuitarLane["LANE_5"] = 5] = "LANE_5";
})(GuitarLane = exports.GuitarLane || (exports.GuitarLane = {}));
var DrumsLane;
(function (DrumsLane) {
    DrumsLane[DrumsLane["PEDAL"] = 0] = "PEDAL";
    DrumsLane[DrumsLane["SNARE"] = 1] = "SNARE";
    DrumsLane[DrumsLane["CYMBAL_1"] = 2] = "CYMBAL_1";
    DrumsLane[DrumsLane["TOM_1"] = 3] = "TOM_1";
    DrumsLane[DrumsLane["CYMBAL_2"] = 4] = "CYMBAL_2";
    DrumsLane[DrumsLane["TOM_2"] = 5] = "TOM_2";
})(DrumsLane = exports.DrumsLane || (exports.DrumsLane = {}));
var GHLLane;
(function (GHLLane) {
    GHLLane[GHLLane["OPEN"] = 0] = "OPEN";
    GHLLane[GHLLane["WHITE_1"] = 1] = "WHITE_1";
    GHLLane[GHLLane["WHITE_2"] = 2] = "WHITE_2";
    GHLLane[GHLLane["WHITE_3"] = 3] = "WHITE_3";
    GHLLane[GHLLane["BLACK_1"] = 4] = "BLACK_1";
    GHLLane[GHLLane["BLACK_2"] = 5] = "BLACK_2";
    GHLLane[GHLLane["BLACK_3"] = 6] = "BLACK_3";
})(GHLLane = exports.GHLLane || (exports.GHLLane = {}));
var SpecialEventType;
(function (SpecialEventType) {
    SpecialEventType[SpecialEventType["PLAYER1"] = 0] = "PLAYER1";
    SpecialEventType[SpecialEventType["PLAYER2"] = 1] = "PLAYER2";
    SpecialEventType[SpecialEventType["START_POWER"] = 2] = "START_POWER";
})(SpecialEventType = exports.SpecialEventType || (exports.SpecialEventType = {}));
function fromParsedChart(pc) {
    const chart = {
        song: songFromParsedSection(getParsedSection(Meta.SectionTitle.SONG, pc)),
        syncTrack: syncTrackFromParsedSection(getParsedSection(Meta.SectionTitle.SYNC_TRACK, pc)),
        difficulties: difficultiesFromParsedChart(pc)
    };
    const events = getParsedSection(Meta.SectionTitle.EVENTS, pc);
    if (events) {
        chart.events = eventsFromParsedSection(events);
    }
    return chart;
}
exports.fromParsedChart = fromParsedChart;
function getParsedSection(title, sections) {
    return sections.find(sec => sec.title === title);
}
function getOptionalParsedSection(title, sections) {
    const sec = sections.find(sec => sec.title === title);
    return sec || null;
}
function eventsFromParsedSection(ps) {
    const section = {};
    const groupedTicks = Util.groupBy(ps.content, "key");
    const ticks = Object.keys(groupedTicks);
    for (const tick of ticks) {
        // Unnecessary
        const t = parseInt(tick);
        section[t] = groupedTicks[t].map(item => eventFromParsedItem(item));
    }
    return section;
}
function eventFromParsedItem(item) {
    const value = Util.extractQuotes(item.values[1].value);
    if (value.indexOf("section") === 0) {
        return {
            kind: EventsEventType.SECTION,
            name: value.split(" ")[1]
        };
    }
    else if (value.indexOf("phrase_start") === 0) {
        return {
            kind: EventsEventType.PHRASE_START
        };
    }
    else if (value.indexOf("phrase_end") === 0) {
        return {
            kind: EventsEventType.PHRASE_END
        };
    }
    else if (value.indexOf("lyric") === 0) {
        return {
            kind: EventsEventType.LYRIC,
            lyric: value.split(" ")[1]
        };
    }
    else {
        return {
            kind: EventsEventType.VALUE_EVENT,
            value: value
        };
    }
}
function songFromParsedSection(ps) {
    const song = {
        resolution: 192,
        audioStreams: {}
    };
    for (const item of ps.content) {
        const key = item.key;
        if (key.includes("Stream")) {
            song.audioStreams[key] = Util.extractQuotes(item.values[0].value);
        }
        else {
            setSongValue(song, key, item.values[0].value);
        }
    }
    return song;
}
function setSongValue(song, key, value) {
    switch (key) {
        case Meta.SongKey.NAME:
            song.name = Util.extractQuotes(value);
            return;
        case Meta.SongKey.ARTIST:
            song.artist = Util.extractQuotes(value);
            return;
        case Meta.SongKey.ALBUM:
            song.album = Util.extractQuotes(value);
            return;
        case Meta.SongKey.CHARTER:
            song.charter = Util.extractQuotes(value);
            return;
        case Meta.SongKey.PLAYER2:
            song.player2 = Util.extractQuotes(value);
            return;
        case Meta.SongKey.GENRE:
            song.genre = Util.extractQuotes(value);
            return;
        case Meta.SongKey.MEDIATYPE:
            song.mediaType = Util.extractQuotes(value);
            return;
        case Meta.SongKey.YEAR:
            const year = parseInt(value.replace(/\D/g, ''));
            if (!isNaN(year)) {
                song.year = year;
            }
            return;
        case Meta.SongKey.RESOLUTION:
            song.resolution = parseInt(value);
            return;
        case Meta.SongKey.OFFSET:
            song.offset = parseInt(value);
            return;
        case Meta.SongKey.DIFFICULTY:
            song.difficulty = parseInt(value);
            return;
        case Meta.SongKey.PREVIEWSTART:
            song.previewStart = parseInt(value);
            return;
        case Meta.SongKey.PREVIEWEND:
            song.previewEnd = parseInt(value);
            return;
    }
}
function syncTrackFromParsedSection(ps) {
    const syncTrack = {};
    const groupedTicks = Util.groupBy(ps.content, "key");
    const ticks = Object.keys(groupedTicks);
    for (const tick of ticks) {
        // Unnecessary
        const t = parseInt(tick);
        syncTrack[t] = groupedTicks[t].filter(item => item.values[0].value === Meta.SyncTrackKey.BPM
            || item.values[0].value === Meta.SyncTrackKey.TIME_SIGNATURE).map(item => syncTrackEventFromParsedItem(item, tick, groupedTicks));
    }
    return syncTrack;
}
function syncTrackEventFromParsedItem(pi, tick, groupedTicks) {
    switch (pi.values[0].value) {
        case Meta.SyncTrackKey.BPM:
            const event = {
                kind: SyncTrackEventType.BPM,
                bpm: parseInt(pi.values[1].value) / 1000
            };
            const anchor = groupedTicks[tick].find(item => item.values[0].value === Meta.SyncTrackKey.ANCHOR);
            if (anchor) {
                event.anchorMicroSeconds = parseInt(anchor.values[1].value);
            }
            return event;
        case Meta.SyncTrackKey.TIME_SIGNATURE:
            return {
                kind: SyncTrackEventType.TIME_SIGNATURE,
                signature: {
                    numerator: parseInt(pi.values[1].value),
                    denominator: pi.values[2]
                        ? parseInt(pi.values[1].value)
                        : 4
                }
            };
        default:
            // We filtered other possible values before
            console.assert(true, "Unkown sync track event", pi.values[0].value);
            return null;
    }
}
function difficultiesFromParsedChart(pc) {
    const result = {};
    const difficulties = Object.values(Meta.Difficulty);
    for (const diff of difficulties) {
        const currentDiffSections = pc.filter(section => section.title.includes(diff));
        if (currentDiffSections.length > 0) {
            result[diff] = {};
            for (const section of currentDiffSections) {
                const instrument = section.title.slice(diff.length);
                if (isGuitar(instrument)) {
                    // We know the object exists
                    result[diff][instrument] = guitarTrackFromParsedItems(section.content);
                }
                else if (isDrums(instrument)) {
                    // We know the object exists
                    result[diff][instrument] = drumsTrackFromParsedItems(section.content);
                }
                else if (isGHL(instrument)) {
                    // We know the object exists
                    result[diff][instrument] = ghlTrackFromParsedItems(section.content);
                }
                else {
                    continue;
                }
            }
        }
    }
    return result;
}
function specialEventFromParsedItem(item) {
    return {
        type: parseInt(item.values[1].value),
        duration: parseInt(item.values[2].value)
    };
}
function literalEventFromParsedItem(item) {
    return {
        value: item.values[1].value
    };
}
// Refactor instrument functions
function guitarTrackFromParsedItems(items) {
    const guitarTrack = {};
    const groupedTicks = Util.groupBy(items, "key");
    const ticks = Object.keys(groupedTicks);
    for (const tick of ticks) {
        // Unnecessary
        const t = parseInt(tick);
        guitarTrack[t] = guitarEventsFromParsedItems(groupedTicks[t]);
    }
    return guitarTrack;
}
function guitarEventsFromParsedItems(items) {
    const noteEvents = items.filter(item => item.values[0].value === Meta.TrackKey.NOTE);
    // There's at most on per tick
    const specialEvent = items.find(item => item.values[0].value === Meta.TrackKey.SPECIAL);
    const literalEvent = items.find(item => item.values[0].value === Meta.TrackKey.TRACK_EVENT);
    const tick = [];
    if (noteEvents) {
        tick.push(guitarNoteFromParsedItems(noteEvents));
    }
    if (specialEvent) {
        tick.push(specialEventFromParsedItem(specialEvent));
    }
    if (literalEvent) {
        tick.push(literalEventFromParsedItem(literalEvent));
    }
    return tick;
}
function guitarNoteFromParsedItems(items) {
    const lanes = items.filter(item => {
        const value = parseInt(item.values[1].value);
        return (value !== Meta.GuitarNoteEventType.FORCED
            && value !== Meta.GuitarNoteEventType.TAP);
    }).map(item => ({
        lane: guitarLaneFromparsedLane(item.values[1].value),
        sustain: parseInt(item.values[2].value)
    }));
    return {
        lanes: lanes,
        forced: items.some(item => parseInt(item.values[1].value) === Meta.GuitarNoteEventType.FORCED),
        tap: items.some(item => parseInt(item.values[1].value) === Meta.GuitarNoteEventType.TAP),
    };
}
function guitarLaneFromparsedLane(parsed) {
    switch (parseInt(parsed)) {
        case Meta.GuitarNoteEventType.LANE_1:
            return GuitarLane.LANE_1;
        case Meta.GuitarNoteEventType.LANE_2:
            return GuitarLane.LANE_2;
        case Meta.GuitarNoteEventType.LANE_3:
            return GuitarLane.LANE_3;
        case Meta.GuitarNoteEventType.LANE_4:
            return GuitarLane.LANE_4;
        case Meta.GuitarNoteEventType.LANE_5:
            return GuitarLane.LANE_5;
        case Meta.GuitarNoteEventType.OPEN:
            return GuitarLane.OPEN;
    }
    // This should not happen as we filtered out other possibilities
    console.assert(true, "Unkown parsed guitar lane", parsed);
    return null;
}
function drumsTrackFromParsedItems(items) {
    const drumsTrack = {};
    const groupedTicks = Util.groupBy(items, "key");
    const ticks = Object.keys(groupedTicks);
    for (const tick of ticks) {
        // Unnecessary
        const t = parseInt(tick);
        drumsTrack[t] = drumsEventsFromParsedItems(groupedTicks[t]);
    }
    return drumsTrack;
}
function drumsEventsFromParsedItems(items) {
    const noteEvents = items.filter(item => item.values[0].value === Meta.TrackKey.NOTE);
    // There's at most on per tick
    const specialEvent = items.find(item => item.values[0].value === Meta.TrackKey.SPECIAL);
    const literalEvent = items.find(item => item.values[0].value === Meta.TrackKey.TRACK_EVENT);
    const tick = [];
    if (noteEvents) {
        tick.push(drumsNoteFromParsedItems(noteEvents));
    }
    if (specialEvent) {
        tick.push(specialEventFromParsedItem(specialEvent));
    }
    if (literalEvent) {
        tick.push(literalEventFromParsedItem(literalEvent));
    }
    return tick;
}
function drumsNoteFromParsedItems(items) {
    const lanes = items.map(item => ({
        lane: drumsLaneFromparsedLane(item.values[1].value),
        sustain: parseInt(item.values[2].value)
    }));
    return {
        lanes: lanes
    };
}
function drumsLaneFromparsedLane(parsed) {
    switch (parseInt(parsed)) {
        case Meta.DrumsNoteEventType.LANE_1:
            return DrumsLane.PEDAL;
        case Meta.DrumsNoteEventType.LANE_2:
            return DrumsLane.SNARE;
        case Meta.DrumsNoteEventType.LANE_3:
            return DrumsLane.CYMBAL_1;
        case Meta.DrumsNoteEventType.LANE_4:
            return DrumsLane.TOM_1;
        case Meta.DrumsNoteEventType.LANE_5:
            return DrumsLane.CYMBAL_2;
        case Meta.DrumsNoteEventType.OPEN:
            return DrumsLane.TOM_2;
    }
    // This should not happen as we filtered out other possibilities
    console.assert(true, "Unkown parsed drums lane", parsed);
    return null;
}
function ghlTrackFromParsedItems(items) {
    const ghlTrack = {};
    const groupedTicks = Util.groupBy(items, "key");
    const ticks = Object.keys(groupedTicks);
    for (const tick of ticks) {
        // Unnecessary
        const t = parseInt(tick);
        ghlTrack[t] = ghlEventsFromParsedItems(groupedTicks[t]);
    }
    return ghlTrack;
}
function ghlEventsFromParsedItems(items) {
    const noteEvents = items.filter(item => item.values[0].value === Meta.TrackKey.NOTE);
    // There's at most on per tick
    const specialEvent = items.find(item => item.values[0].value === Meta.TrackKey.SPECIAL);
    const literalEvent = items.find(item => item.values[0].value === Meta.TrackKey.TRACK_EVENT);
    const tick = [];
    if (noteEvents) {
        tick.push(ghlNoteFromParsedItems(noteEvents));
    }
    if (specialEvent) {
        tick.push(specialEventFromParsedItem(specialEvent));
    }
    if (literalEvent) {
        tick.push(literalEventFromParsedItem(literalEvent));
    }
    return tick;
}
function ghlNoteFromParsedItems(items) {
    const lanes = items.filter(item => {
        const value = parseInt(item.values[1].value);
        return (value !== Meta.GuitarNoteEventType.FORCED
            && value !== Meta.GuitarNoteEventType.TAP);
    }).map(item => ({
        lane: ghlLaneFromParsedLane(item.values[1].value),
        sustain: parseInt(item.values[2].value)
    }));
    return {
        lanes: lanes,
        forced: items.some(item => parseInt(item.values[1].value) === Meta.GuitarNoteEventType.FORCED),
        tap: items.some(item => parseInt(item.values[1].value) === Meta.GuitarNoteEventType.TAP),
    };
}
function ghlLaneFromParsedLane(parsed) {
    switch (parseInt(parsed)) {
        case Meta.GhlNoteEventType.OPEN:
            return GHLLane.OPEN;
        case Meta.GhlNoteEventType.WHITE_1:
            return GHLLane.WHITE_1;
        case Meta.GhlNoteEventType.WHITE_2:
            return GHLLane.WHITE_2;
        case Meta.GhlNoteEventType.WHITE_3:
            return GHLLane.WHITE_3;
        case Meta.GhlNoteEventType.BLACK_1:
            return GHLLane.BLACK_1;
        case Meta.GhlNoteEventType.BLACK_2:
            return GHLLane.BLACK_2;
        case Meta.GhlNoteEventType.BLACK_3:
            return GHLLane.BLACK_3;
    }
    // This should not happen as we filtered out other possibilities
    console.assert(true, "Unkown parsed ghl lane", parsed);
    return null;
}
