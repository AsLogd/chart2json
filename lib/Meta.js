"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ESection;
(function (ESection) {
    ESection["SONG"] = "Song";
    ESection["SYNC_TRACK"] = "SyncTrack";
    ESection["EVENTS"] = "Events";
})(ESection = exports.ESection || (exports.ESection = {}));
function typeFromRawValue(rawValue) {
    if (rawValue.length === 1) {
        switch (rawValue[0].type) {
            case "string":
                return FString();
            case "number":
                return FNumber();
            case "literal":
                return FLiteral([rawValue[0].value]);
        }
    }
    else if (rawValue.length > 1) {
        const tupleTypes = rawValue.map(atom => typeFromRawValue([atom]));
        return FTuple(tupleTypes);
    }
    return FError();
}
exports.typeFromRawValue = typeFromRawValue;
///////////////
//// Value Types
///////////////
var ETypeKind;
(function (ETypeKind) {
    ETypeKind[ETypeKind["ERROR"] = 0] = "ERROR";
    ETypeKind[ETypeKind["STRING"] = 1] = "STRING";
    ETypeKind[ETypeKind["NUMBER"] = 2] = "NUMBER";
    ETypeKind[ETypeKind["LITERAL"] = 3] = "LITERAL";
    ETypeKind[ETypeKind["TUPLE"] = 4] = "TUPLE";
})(ETypeKind = exports.ETypeKind || (exports.ETypeKind = {}));
// Convenient functions
function isError(type) {
    return type.kind === ETypeKind.ERROR;
}
exports.isError = isError;
function isString(type) {
    return type.kind === ETypeKind.STRING;
}
exports.isString = isString;
function isNumber(type) {
    return type.kind === ETypeKind.NUMBER;
}
exports.isNumber = isNumber;
function isLiteral(type) {
    return type.kind === ETypeKind.LITERAL;
}
exports.isLiteral = isLiteral;
function isTuple(type) {
    return type.kind === ETypeKind.TUPLE;
}
exports.isTuple = isTuple;
function FError() {
    return {
        kind: ETypeKind.ERROR
    };
}
exports.FError = FError;
function FString() {
    return {
        kind: ETypeKind.STRING
    };
}
exports.FString = FString;
function FNumber() {
    return {
        kind: ETypeKind.NUMBER
    };
}
exports.FNumber = FNumber;
function FLiteral(values) {
    return {
        kind: ETypeKind.LITERAL,
        values
    };
}
exports.FLiteral = FLiteral;
function FTuple(types) {
    return {
        kind: ETypeKind.TUPLE,
        types
    };
}
exports.FTuple = FTuple;
var ESongKey;
(function (ESongKey) {
    ESongKey["NAME"] = "Name";
    ESongKey["ARTIST"] = "Artist";
    ESongKey["ALBUM"] = "Album";
    ESongKey["YEAR"] = "Year";
    ESongKey["CHARTER"] = "Charter";
    ESongKey["OFFSET"] = "Offset";
    ESongKey["RESOLUTION"] = "Resolution";
    ESongKey["PLAYER2"] = "Player2";
    ESongKey["DIFFICULTY"] = "Difficulty";
    ESongKey["PREVIEWSTART"] = "PreviewStart";
    ESongKey["PREVIEWEND"] = "PreviewEnd";
    ESongKey["GENRE"] = "Genre";
    ESongKey["MEDIATYPE"] = "MediaType";
    // Audio streams
    ESongKey["MUSICSTREAM"] = "MusicStream";
    ESongKey["GUITARSTREAM"] = "GuitarStream";
    ESongKey["RHYTHMSTREAM"] = "RhythmStream";
    ESongKey["BASSSTREAM"] = "BassStream";
    ESongKey["DRUMSTREAM"] = "DrumStream";
    ESongKey["DRUM2STREAM"] = "Drum2Stream";
    ESongKey["DRUM3STREAM"] = "Drum3Stream";
    ESongKey["DRUM4STREAM"] = "Drum4Stream";
    ESongKey["VOCALSTREAM"] = "VocalStream";
    ESongKey["KEYSSTREAM"] = "KeysStream";
    ESongKey["CROWDSTREAM"] = "CrowdStream";
})(ESongKey = exports.ESongKey || (exports.ESongKey = {}));
exports.SongTypes = {
    required: [
        ESongKey.RESOLUTION
    ],
    string: [
        ESongKey.NAME, ESongKey.ARTIST, ESongKey.ALBUM,
        ESongKey.YEAR, ESongKey.CHARTER, ESongKey.GENRE,
        ESongKey.MEDIATYPE,
        // Audio Streams
        ESongKey.MUSICSTREAM, ESongKey.GUITARSTREAM,
        ESongKey.RHYTHMSTREAM, ESongKey.BASSSTREAM,
        ESongKey.DRUMSTREAM, ESongKey.DRUM2STREAM,
        ESongKey.DRUM3STREAM, ESongKey.DRUM4STREAM,
        ESongKey.VOCALSTREAM, ESongKey.KEYSSTREAM,
        ESongKey.CROWDSTREAM,
    ],
    number: [
        ESongKey.OFFSET, ESongKey.RESOLUTION,
        ESongKey.PREVIEWSTART, ESongKey.PREVIEWEND,
        ESongKey.DIFFICULTY
    ],
    literal: [
        [ESongKey.PLAYER2, FLiteral(["bass", "guitar"])]
    ]
};