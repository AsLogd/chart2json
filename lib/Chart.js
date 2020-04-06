"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    SyncTrackEventType[SyncTrackEventType["ANCHOR"] = 2] = "ANCHOR";
})(SyncTrackEventType = exports.SyncTrackEventType || (exports.SyncTrackEventType = {}));
var EventsEventType;
(function (EventsEventType) {
    EventsEventType[EventsEventType["SECTION"] = 0] = "SECTION";
    EventsEventType[EventsEventType["PHRASE_START"] = 1] = "PHRASE_START";
    EventsEventType[EventsEventType["LYRIC"] = 2] = "LYRIC";
    EventsEventType[EventsEventType["PHRASE_END"] = 3] = "PHRASE_END";
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
var ESpecialEventType;
(function (ESpecialEventType) {
    ESpecialEventType[ESpecialEventType["PLAYER1"] = 0] = "PLAYER1";
    ESpecialEventType[ESpecialEventType["PLAYER2"] = 1] = "PLAYER2";
    ESpecialEventType[ESpecialEventType["START_POWER"] = 2] = "START_POWER";
})(ESpecialEventType = exports.ESpecialEventType || (exports.ESpecialEventType = {}));
