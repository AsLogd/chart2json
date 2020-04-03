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
var EError;
(function (EError) {
    EError[EError["WRONG_SECTION_COUNT"] = 0] = "WRONG_SECTION_COUNT";
    EError[EError["MISSING_REQUIRED_ITEM"] = 1] = "MISSING_REQUIRED_ITEM";
    EError[EError["MISSING_REQUIRED_EVENT"] = 2] = "MISSING_REQUIRED_EVENT";
    EError[EError["WRONG_TYPE"] = 3] = "WRONG_TYPE";
    EError[EError["INVALID_EVENT_ITEM"] = 4] = "INVALID_EVENT_ITEM";
    EError[EError["WRONG_LYRICS"] = 5] = "WRONG_LYRICS";
})(EError = exports.EError || (exports.EError = {}));
function getErrorString(kind, errorData) {
    // no default => error if not exhaustive
    switch (kind) {
        case EError.WRONG_SECTION_COUNT:
            return getWrongSectionCountError(errorData);
        case EError.MISSING_REQUIRED_ITEM:
            return getMissingItemError(errorData);
        case EError.MISSING_REQUIRED_EVENT:
            return getMissingEventError(errorData);
        case EError.WRONG_TYPE:
            return getWrongTypeError(errorData);
        case EError.INVALID_EVENT_ITEM:
            return getInvalidEventItemError(errorData);
        case EError.WRONG_LYRICS:
            return getWrongLyricsError(errorData);
    }
}
exports.getErrorString = getErrorString;
function getWrongSectionCountError(data) {
    return `A required section { ${data.section} } is missing or has multiple definitions`;
}
function getMissingItemError(data) {
    return `A required item { ${data.itemKey} } is missing in section { ${data.section} }`;
}
function getMissingEventError(data) {
    const name = Meta.getEventKeyName(data.eventKey);
    return `A required event { ${data.eventKey} (${name}) } has to appear at least once in section { ${data.section} }`;
}
function getWrongTypeError(data) {
    return `Unexpected type found in item with key { ${data.item} } at section { ${data.section} }
- Expected:
	${Meta.typeToString(data.expected)}
- Found:
	${Meta.typeToString(data.found)}`;
}
function getInvalidEventItemError(data) {
    const values = data.item.values.join(" ");
    return `Invalid event { ${data.item.key} = ${values} } found in section { ${data.section} }`;
}
function getWrongLyricsError(data) {
    return `'lyric' and 'phrase_end' events should happen inside a phrase. Found { ${data.found} } in item { ${data.item} }`;
}
