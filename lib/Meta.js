"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SectionTitle;
(function (SectionTitle) {
    SectionTitle["SONG"] = "Song";
    SectionTitle["SYNC_TRACK"] = "SyncTrack";
    SectionTitle["EVENTS"] = "Events";
})(SectionTitle = exports.SectionTitle || (exports.SectionTitle = {}));
var Difficulty;
(function (Difficulty) {
    Difficulty["EASY"] = "Easy";
    Difficulty["MEDIUM"] = "Medium";
    Difficulty["HARD"] = "Hard";
    Difficulty["EXPERT"] = "Expert";
})(Difficulty = exports.Difficulty || (exports.Difficulty = {}));
var Instrument;
(function (Instrument) {
    Instrument["SINGLE"] = "Single";
    Instrument["DOUBLEGUITAR"] = "DoubleGuitar";
    Instrument["DOUBLEBASS"] = "DoubleBass";
    Instrument["DOUBLERHYTHM"] = "DoubleRhythm";
    Instrument["DRUMS"] = "Drums";
    Instrument["KEYBOARD"] = "Keyboard";
    Instrument["GHLGUITAR"] = "GHLGuitar";
    Instrument["GHLBASS"] = "GHLBass";
})(Instrument = exports.Instrument || (exports.Instrument = {}));
var GuitarNoteEventType;
(function (GuitarNoteEventType) {
    GuitarNoteEventType[GuitarNoteEventType["LANE_1"] = 0] = "LANE_1";
    GuitarNoteEventType[GuitarNoteEventType["LANE_2"] = 1] = "LANE_2";
    GuitarNoteEventType[GuitarNoteEventType["LANE_3"] = 2] = "LANE_3";
    GuitarNoteEventType[GuitarNoteEventType["LANE_4"] = 3] = "LANE_4";
    GuitarNoteEventType[GuitarNoteEventType["LANE_5"] = 4] = "LANE_5";
    GuitarNoteEventType[GuitarNoteEventType["FORCED"] = 5] = "FORCED";
    GuitarNoteEventType[GuitarNoteEventType["TAP"] = 6] = "TAP";
    GuitarNoteEventType[GuitarNoteEventType["OPEN"] = 7] = "OPEN";
})(GuitarNoteEventType = exports.GuitarNoteEventType || (exports.GuitarNoteEventType = {}));
var GhlNoteEventType;
(function (GhlNoteEventType) {
    GhlNoteEventType[GhlNoteEventType["WHITE_1"] = 0] = "WHITE_1";
    GhlNoteEventType[GhlNoteEventType["WHITE_2"] = 1] = "WHITE_2";
    GhlNoteEventType[GhlNoteEventType["WHITE_3"] = 2] = "WHITE_3";
    GhlNoteEventType[GhlNoteEventType["BLACK_1"] = 3] = "BLACK_1";
    GhlNoteEventType[GhlNoteEventType["BLACK_2"] = 4] = "BLACK_2";
    GhlNoteEventType[GhlNoteEventType["FORCED"] = 5] = "FORCED";
    GhlNoteEventType[GhlNoteEventType["TAP"] = 6] = "TAP";
    GhlNoteEventType[GhlNoteEventType["OPEN"] = 7] = "OPEN";
    GhlNoteEventType[GhlNoteEventType["BLACK_3"] = 8] = "BLACK_3";
})(GhlNoteEventType = exports.GhlNoteEventType || (exports.GhlNoteEventType = {}));
var DrumsNoteEventType;
(function (DrumsNoteEventType) {
    DrumsNoteEventType[DrumsNoteEventType["OPEN"] = 0] = "OPEN";
    DrumsNoteEventType[DrumsNoteEventType["LANE_1"] = 1] = "LANE_1";
    DrumsNoteEventType[DrumsNoteEventType["LANE_2"] = 2] = "LANE_2";
    DrumsNoteEventType[DrumsNoteEventType["LANE_3"] = 3] = "LANE_3";
    DrumsNoteEventType[DrumsNoteEventType["LANE_4"] = 4] = "LANE_4";
    DrumsNoteEventType[DrumsNoteEventType["LANE_5"] = 5] = "LANE_5";
})(DrumsNoteEventType = exports.DrumsNoteEventType || (exports.DrumsNoteEventType = {}));
function getPossibleTrackNames() {
    return Object.keys(Difficulty).map((dif) => {
        return Object.keys(Instrument).map(instr => {
            //@ts-ignore weird stuff
            return "" + Difficulty[dif] + Instrument[instr];
        });
    }).flat(); // requires node 12.4
}
exports.getPossibleTrackNames = getPossibleTrackNames;
///////////////
//// Value Types
///////////////
var TypeKind;
(function (TypeKind) {
    TypeKind[TypeKind["ERROR"] = 0] = "ERROR";
    TypeKind[TypeKind["STRING"] = 1] = "STRING";
    TypeKind[TypeKind["NUMBER"] = 2] = "NUMBER";
    TypeKind[TypeKind["LITERAL"] = 3] = "LITERAL";
    TypeKind[TypeKind["TUPLE"] = 4] = "TUPLE";
    TypeKind[TypeKind["EITHER"] = 5] = "EITHER";
})(TypeKind = exports.TypeKind || (exports.TypeKind = {}));
function TError() {
    return {
        kind: TypeKind.ERROR
    };
}
exports.TError = TError;
function TString() {
    return {
        kind: TypeKind.STRING
    };
}
exports.TString = TString;
function TNumber() {
    return {
        kind: TypeKind.NUMBER
    };
}
exports.TNumber = TNumber;
function TLiteral(values) {
    return {
        kind: TypeKind.LITERAL,
        values
    };
}
exports.TLiteral = TLiteral;
function TTuple(types) {
    return {
        kind: TypeKind.TUPLE,
        types
    };
}
exports.TTuple = TTuple;
function TEither(types) {
    return {
        kind: TypeKind.EITHER,
        types
    };
}
exports.TEither = TEither;
function typeFromRawValue(rawValue) {
    if (rawValue.length === 1) {
        switch (rawValue[0].type) {
            case "string":
                return TString();
            case "number":
                return TNumber();
            case "literal":
                return TLiteral([rawValue[0].value]);
        }
    }
    else if (rawValue.length > 1) {
        const tupleTypes = rawValue.map(atom => typeFromRawValue([atom]));
        return TTuple(tupleTypes);
    }
    return TError();
}
exports.typeFromRawValue = typeFromRawValue;
function typeToString(type) {
    // no default => error if not exhaustive
    switch (type.kind) {
        case TypeKind.STRING:
            return "String";
        case TypeKind.NUMBER:
            return "Number";
        case TypeKind.LITERAL:
            return `Literal<${type.values.join(" | ")}>`;
        case TypeKind.TUPLE: {
            const types = type.types.map(type => typeToString(type));
            return `Tuple<[${types.join(", ")}]>`;
        }
        case TypeKind.EITHER: {
            const types = type.types.map(type => typeToString(type));
            return `Either<[${types.join(" | ")}]>`;
        }
        case TypeKind.ERROR:
            return `Error`;
    }
}
exports.typeToString = typeToString;
var SongKey;
(function (SongKey) {
    SongKey["NAME"] = "Name";
    SongKey["ARTIST"] = "Artist";
    SongKey["ALBUM"] = "Album";
    SongKey["YEAR"] = "Year";
    SongKey["CHARTER"] = "Charter";
    SongKey["OFFSET"] = "Offset";
    SongKey["RESOLUTION"] = "Resolution";
    SongKey["PLAYER2"] = "Player2";
    SongKey["DIFFICULTY"] = "Difficulty";
    SongKey["PREVIEWSTART"] = "PreviewStart";
    SongKey["PREVIEWEND"] = "PreviewEnd";
    SongKey["GENRE"] = "Genre";
    SongKey["MEDIATYPE"] = "MediaType";
    // Audio streams
    SongKey["MUSICSTREAM"] = "MusicStream";
    SongKey["GUITARSTREAM"] = "GuitarStream";
    SongKey["RHYTHMSTREAM"] = "RhythmStream";
    SongKey["BASSSTREAM"] = "BassStream";
    SongKey["DRUMSTREAM"] = "DrumStream";
    SongKey["DRUM2STREAM"] = "Drum2Stream";
    SongKey["DRUM3STREAM"] = "Drum3Stream";
    SongKey["DRUM4STREAM"] = "Drum4Stream";
    SongKey["VOCALSTREAM"] = "VocalStream";
    SongKey["KEYSSTREAM"] = "KeysStream";
    SongKey["CROWDSTREAM"] = "CrowdStream";
})(SongKey = exports.SongKey || (exports.SongKey = {}));
exports.SongTypes = {
    required: [
        SongKey.RESOLUTION
    ],
    string: [
        SongKey.NAME, SongKey.ARTIST, SongKey.ALBUM,
        SongKey.YEAR, SongKey.CHARTER, SongKey.GENRE,
        SongKey.MEDIATYPE,
        // Audio Streams
        SongKey.MUSICSTREAM, SongKey.GUITARSTREAM,
        SongKey.RHYTHMSTREAM, SongKey.BASSSTREAM,
        SongKey.DRUMSTREAM, SongKey.DRUM2STREAM,
        SongKey.DRUM3STREAM, SongKey.DRUM4STREAM,
        SongKey.VOCALSTREAM, SongKey.KEYSSTREAM,
        SongKey.CROWDSTREAM,
    ],
    number: [
        SongKey.OFFSET, SongKey.RESOLUTION,
        SongKey.PREVIEWSTART, SongKey.PREVIEWEND,
        SongKey.DIFFICULTY
    ],
    literal: [
        [SongKey.PLAYER2, TLiteral(["bass", "guitar"])]
    ]
};
function getEventKeyName(eventKey) {
    switch (eventKey) {
        case SyncTrackKey.BPM:
            return "BPM";
        case SyncTrackKey.TIME_SIGNATURE:
            return "Time Signature";
        case SyncTrackKey.ANCHOR:
            return "Anchor";
        case EventsKey.EVENT:
            return "Event";
    }
}
exports.getEventKeyName = getEventKeyName;
// SyncTrack section
var SyncTrackKey;
(function (SyncTrackKey) {
    SyncTrackKey["BPM"] = "B";
    SyncTrackKey["TIME_SIGNATURE"] = "TS";
    SyncTrackKey["ANCHOR"] = "A";
})(SyncTrackKey = exports.SyncTrackKey || (exports.SyncTrackKey = {}));
exports.SyncTrackTypes = [
    [SyncTrackKey.BPM,
        TNumber(),
        true
    ],
    [SyncTrackKey.TIME_SIGNATURE,
        // One or two numbers
        TEither([
            TNumber(),
            TTuple([TNumber(), TNumber()])
        ]),
        true
    ],
    [SyncTrackKey.ANCHOR,
        TNumber(),
        false
    ],
];
// Events section
var EventsKey;
(function (EventsKey) {
    EventsKey["EVENT"] = "E";
})(EventsKey = exports.EventsKey || (exports.EventsKey = {}));
exports.EventTypes = [
    [EventsKey.EVENT, TString(), false],
];
// Track sections
var TrackKey;
(function (TrackKey) {
    TrackKey["NOTE"] = "N";
    TrackKey["SPECIAL"] = "S";
    TrackKey["TRACK_EVENT"] = "E";
})(TrackKey = exports.TrackKey || (exports.TrackKey = {}));
exports.TrackTypes = [
    [TrackKey.NOTE,
        TTuple([
            TNumber(),
            TNumber()
        ]),
        true
    ],
    [TrackKey.SPECIAL,
        TTuple([
            TNumber(),
            TNumber()
        ]),
        false
    ],
    [EventsKey.EVENT,
        TLiteral([]),
        false
    ],
];
