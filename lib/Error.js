"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Meta = __importStar(require("./Meta"));
var ErrorType;
(function (ErrorType) {
    ErrorType[ErrorType["WRONG_SECTION_COUNT"] = 0] = "WRONG_SECTION_COUNT";
    ErrorType[ErrorType["MISSING_ONE_OF"] = 1] = "MISSING_ONE_OF";
    ErrorType[ErrorType["MISSING_REQUIRED_ITEM"] = 2] = "MISSING_REQUIRED_ITEM";
    ErrorType[ErrorType["MISSING_REQUIRED_EVENT"] = 3] = "MISSING_REQUIRED_EVENT";
    ErrorType[ErrorType["WRONG_TYPE"] = 4] = "WRONG_TYPE";
    ErrorType[ErrorType["INVALID_EVENT_ITEM"] = 5] = "INVALID_EVENT_ITEM";
    ErrorType[ErrorType["UNPAIRED_ANCHOR"] = 6] = "UNPAIRED_ANCHOR";
    ErrorType[ErrorType["WRONG_LYRICS"] = 7] = "WRONG_LYRICS";
    ErrorType[ErrorType["WRONG_NOTE_FLAG"] = 8] = "WRONG_NOTE_FLAG";
    ErrorType[ErrorType["DUPLICATE_NOTE_EVENT"] = 9] = "DUPLICATE_NOTE_EVENT";
})(ErrorType = exports.ErrorType || (exports.ErrorType = {}));
function getErrorString(kind, errorData) {
    // no default => error if not exhaustive
    switch (kind) {
        case ErrorType.WRONG_SECTION_COUNT:
            return getWrongSectionCountError(errorData);
        case ErrorType.MISSING_ONE_OF:
            return getMissingOneOfError(errorData);
        case ErrorType.MISSING_REQUIRED_ITEM:
            return getMissingItemError(errorData);
        case ErrorType.MISSING_REQUIRED_EVENT:
            return getMissingEventError(errorData);
        case ErrorType.WRONG_TYPE:
            return getWrongTypeError(errorData);
        case ErrorType.INVALID_EVENT_ITEM:
            return getInvalidEventItemError(errorData);
        case ErrorType.UNPAIRED_ANCHOR:
            return getUnpairedAnchorError(errorData);
        case ErrorType.WRONG_LYRICS:
            return getWrongLyricsError(errorData);
        case ErrorType.WRONG_NOTE_FLAG:
            return getWrongNoteFlagError(errorData);
        case ErrorType.DUPLICATE_NOTE_EVENT:
            return getDuplicateNoteError(errorData);
    }
}
exports.getErrorString = getErrorString;
function getWrongSectionCountError(data) {
    return `A required section { ${data.section} } is missing or has multiple definitions`;
}
function getMissingOneOfError(data) {
    const sections = data.sections.join(",\n\t");
    return `At least one of the following sections is required and none was found {
	${sections}
}`;
}
function getMissingItemError(data) {
    return `A required item { ${data.itemKey} } is missing in section { ${data.section} }`;
}
function getMissingEventError(data) {
    const name = Meta.getEventKeyName(data.eventKey);
    return `A required event { ${data.eventKey} (${name}) } has to appear at least once in section { ${data.section} }`;
}
function getUnpairedAnchorError(data) {
    return `Tick { ${data.tick} } has defined an Anchor but not a BPM event. All anchors should be paired with a BPM event`;
}
function getWrongTypeError(data) {
    const line = data.item.values[0].line;
    return `Unexpected type found at line { ${line} } (section: ${data.section} key: ${data.item.key})
- Expected:
	${Meta.typeToString(data.expected)}
- Found:
	${Meta.typeToString(data.found)}`;
}
function getInvalidEventItemError(data) {
    const values = data.item.values.join(" ");
    const line = data.item.values[0].line;
    return `Invalid event { ${data.item.key} = ${values} } found at line { line } (section: ${data.section} )`;
}
function getWrongLyricsError(data) {
    const line = data.item.values[0].line;
    return `'lyric' and 'phrase_end' events should happen inside a phrase. Found { ${data.found} } at line { ${line} } (key: ${data.item.key}) `;
}
function getWrongNoteFlagError(data) {
    const flags = data.foundValues.map(flag => Meta.GuitarNoteEventType[parseInt(flag)]).join(", ");
    return `Found flags { ${flags} } without notes in tick { ${data.tick} } in section { ${data.section} }.`;
}
function getDuplicateNoteError(data) {
    const events = data.foundValues.map(flag => Meta.GuitarNoteEventType[parseInt(flag)]).join(", ");
    return `Found duplicated events { ${events} } in tick { ${data.tick} } in section { ${data.section} }.`;
}
