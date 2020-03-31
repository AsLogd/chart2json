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
    EError[EError["MISSING_SECTION"] = 0] = "MISSING_SECTION";
    EError[EError["MISSING_REQUIRED_ITEM"] = 1] = "MISSING_REQUIRED_ITEM";
    EError[EError["WRONG_TYPE"] = 2] = "WRONG_TYPE";
})(EError = exports.EError || (exports.EError = {}));
function getMissingSectionError(data) {
    return `A required section { ${data.section} } is missing`;
}
function getMissingItemError(data) {
    return `A required item { ${data.item} } is missing in section { ${data.section} }`;
}
function getWrongTypeError(data) {
    return `Unexpected type found in { ${data.section}:${data.item} }
- Expected:
	${getTypeString(data.expected)}
- Found:
	${getTypeString(data.found)}`;
}
function getErrorString(kind, errorData) {
    // no default => error if not exhaustive
    switch (kind) {
        case EError.MISSING_SECTION:
            return getMissingSectionError(errorData);
        case EError.MISSING_REQUIRED_ITEM:
            return getMissingItemError(errorData);
        case EError.WRONG_TYPE:
            return getWrongTypeError(errorData);
    }
}
exports.getErrorString = getErrorString;
function getTypeString(type) {
    // no default => error if not exhaustive
    switch (type.kind) {
        case Meta.ETypeKind.STRING:
            return "String";
        case Meta.ETypeKind.NUMBER:
            return "Number";
        case Meta.ETypeKind.LITERAL:
            return `Literal<${type.values.join(" | ")}>`;
        case Meta.ETypeKind.TUPLE:
            const types = type.types.map(type => getTypeString(type));
            return `Tuple<[${types.join(", ")}]>`;
        case Meta.ETypeKind.ERROR:
            return `Error`;
    }
}
exports.getTypeString = getTypeString;
