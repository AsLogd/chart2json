"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ESection;
(function (ESection) {
    ESection["SONG"] = "Song";
    ESection["SYNC_TRACK"] = "SyncTrack";
    ESection["EVENTS"] = "Events";
})(ESection || (ESection = {}));
var ESongKeys;
(function (ESongKeys) {
    ESongKeys["RESOLUTION"] = "Resolution";
})(ESongKeys || (ESongKeys = {}));
function semanticCheck([chart], location, reject) {
    console.log("performing semantic check");
    //console.log("Is valid chart:", isValidChart(chart))
    return isValidChart(chart) ? chart : reject;
}
exports.default = semanticCheck;
function isValidChart(secs) {
    //console.log("Contains song once:", containsSectionOnce(secs, ESection.SONG))
    //console.log("Valid song section:", isValidSongSection( getSection(secs, ESection.SONG) ))
    return (secs && Array.isArray(secs)
        && containsSectionOnce(secs, ESection.SONG)
        && isValidSongSection(getSection(secs, ESection.SONG)));
}
function getSection(sections, sectionName) {
    //console.log("get section: ", sections.find(x => x.title === sectionName))
    // We know it contains section
    return sections.find(x => x.title === sectionName);
}
function containsSectionOnce(sections, sectionName) {
    //console.log("in cso:", sections, sectionName)
    return sections.filter(x => x.title === sectionName).length === 1;
}
function isValidSongSection({ title, content }) {
    return (
    // Resolution is mandatory
    content && Array.isArray(content)
        && content.filter(x => x.key === ESongKeys.RESOLUTION).length === 1);
}
//tsc semanticCheck.ts --lib 'es2018','dom' --module 'commonjs'
//npx nearleyc chart.ne -o chart.js
//npx nearley-test chart.js
