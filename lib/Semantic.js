"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Error_1 = require("./Error");
const Meta = __importStar(require("./Meta"));
/*
 * Performs a semantic check on a syntactically correct chart file
 */
function semanticCheck(chart) {
    return checkChart(chart);
}
exports.default = semanticCheck;
/*
 * Returns null if the chart is valid. Otherwise returns an error
 */
function checkChart(secs) {
    const requiredSectionError = checkRequiredSections(secs, [
        Meta.ESection.SONG,
        Meta.ESection.SYNC_TRACK
    ]);
    if (requiredSectionError) {
        return requiredSectionError;
    }
    const songSection = getSection(secs, Meta.ESection.SONG);
    const songSectionError = checkSongTypes(Meta.SongTypes, songSection.content);
    if (songSectionError) {
        return songSectionError;
    }
    const syncTrackSection = getSection(secs, Meta.ESection.SYNC_TRACK);
    const syncTrackSectionError = checkEventTypes(Meta.ESection.SYNC_TRACK, Meta.SyncTrackTypes, syncTrackSection.content);
    if (syncTrackSectionError) {
        return syncTrackSectionError;
    }
    return null;
}
function checkRequiredSections(secs, required) {
    const wrongCountSection = required.find(reqSec => !containsSectionExactlyOnce(secs, reqSec));
    if (wrongCountSection) {
        return {
            reason: Error_1.getErrorString(Error_1.EError.WRONG_SECTION_COUNT, {
                section: wrongCountSection
            })
        };
    }
    return null;
}
/*
 * Gets the specified section
 * @pre The section should exist
 */
function getSection(sections, sectionName) {
    return sections.find(x => x.title === sectionName);
}
function containsSectionExactlyOnce(sections, sectionName) {
    return sections.filter(x => x.title === sectionName).length === 1;
}
function checkSongTypes(types, content) {
    const { required = [], string = [], number = [], literal = [] } = types;
    const requiredError = checkSongRequiredItems(required, content);
    if (requiredError) {
        return requiredError;
    }
    const songStringError = checkSongStringItems(string, content);
    if (songStringError) {
        return songStringError;
    }
    const songNumberError = checkSongNumberItems(number, content);
    if (songNumberError) {
        return songNumberError;
    }
    const songLiteralError = checkSongLiteralItems(literal, content);
    if (songLiteralError) {
        return songLiteralError;
    }
    return null;
}
function checkSongRequiredItems(required, content) {
    for (const reqItem of required) {
        const isFound = content.some(item => item.key === reqItem);
        if (!isFound) {
            return {
                reason: Error_1.getErrorString(Error_1.EError.MISSING_REQUIRED_ITEM, {
                    section: Meta.ESection.SONG,
                    itemKey: reqItem
                })
            };
        }
    }
    return null;
}
function checkSongStringItems(keys, content) {
    const strItems = content.filter(item => keys.some(key => item.key === key));
    const itemWithErr = strItems.find(item => !isValidString(item.values));
    if (itemWithErr) {
        return {
            reason: Error_1.getErrorString(Error_1.EError.WRONG_TYPE, {
                section: Meta.ESection.SONG,
                item: itemWithErr.key,
                expected: Meta.FString(),
                found: Meta.typeFromRawValue(itemWithErr.values)
            })
        };
    }
    return null;
}
function checkSongNumberItems(keys, content) {
    const numItems = content.filter(item => keys.some(key => item.key === key));
    const itemWithErr = numItems.find(item => !isValidNumber(item.values));
    if (itemWithErr) {
        return {
            reason: Error_1.getErrorString(Error_1.EError.WRONG_TYPE, {
                section: Meta.ESection.SONG,
                item: itemWithErr.key,
                expected: Meta.FNumber(),
                found: Meta.typeFromRawValue(itemWithErr.values)
            })
        };
    }
    return null;
}
function checkSongLiteralItems(literalTuples, content) {
    let literalValues = [];
    const tupleItemMap = literalTuples.map(tuple => ({
        tuple,
        items: content.filter(item => tuple[0] === item.key)
    }));
    for (const ti of tupleItemMap) {
        for (const item of ti.items) {
            if (!isValidLiteral(item.values, ti.tuple[1])) {
                return {
                    reason: Error_1.getErrorString(Error_1.EError.WRONG_TYPE, {
                        section: Meta.ESection.SONG,
                        item: item.key,
                        expected: Meta.FLiteral(literalValues),
                        found: Meta.typeFromRawValue(item.values)
                    })
                };
            }
        }
    }
    return null;
}
function checkEventTypes(section, types, content) {
    const itemError = content.find(item => !isValidEventItem(item));
    if (itemError) {
        return {
            reason: Error_1.getErrorString(Error_1.EError.INVALID_EVENT_ITEM, {
                section,
                item: itemError
            })
        };
    }
    for (const type of types) {
        const [eventKey, expectedType, isRequired] = type;
        const relevantItems = content.filter(item => item.values[0].value === type[0]);
        if (isRequired && relevantItems.length === 0) {
            return {
                reason: Error_1.getErrorString(Error_1.EError.MISSING_REQUIRED_EVENT, {
                    section: section,
                    eventKey: type[0]
                })
            };
        }
        for (const item of relevantItems) {
            const eventValues = item.values.slice(1);
            if (!isValidType(eventValues, expectedType)) {
                return ({
                    reason: Error_1.getErrorString(Error_1.EError.WRONG_TYPE, {
                        section,
                        item: item.key,
                        expected: expectedType,
                        found: Meta.typeFromRawValue(eventValues)
                    })
                });
            }
        }
    }
    return null;
}
function isValidType(values, type) {
    switch (type.kind) {
        case Meta.ETypeKind.NUMBER:
            return isValidNumber(values);
        case Meta.ETypeKind.STRING:
            return isValidString(values);
        case Meta.ETypeKind.LITERAL:
            return isValidLiteral(values, type);
        case Meta.ETypeKind.TUPLE:
            return isValidTuple(values, type);
        case Meta.ETypeKind.EITHER:
            return isValidEither(values, type);
        case Meta.ETypeKind.ERROR:
            return false;
    }
}
function isValidNumber(values) {
    return values.length === 1
        && values[0].type === "number";
}
function isValidString(values) {
    return values.length === 1
        && values[0].type === "string";
}
function isValidLiteral(values, definition) {
    return values.length === 1
        && values[0].type === "literal"
        // value is equal to some of the defined values
        && definition.values.some(val => values[0].value === val);
}
function isValidTuple(values, definition) {
    return values.length > 0
        && values.every((value, idx) => isValidType([value], definition.types[idx]));
}
function isValidEither(values, definition) {
    return values.length > 0
        && definition.types.some(type => isValidType(values, type));
}
/*
 * Check whether the key is a valid positive finite integer
 */
function isValidEventItem(item) {
    const n = parseInt("" + item.key);
    const hasValidItemKey = !isNaN(n) && isFinite(n) && n >= 0;
    const hasValidValueKey = item.values
        && item.values.length > 0
        && item.values[0].type === "literal";
    return hasValidItemKey && hasValidValueKey;
}
//tsc semanticCheck.ts --lib 'es2018','dom' --module 'commonjs'
//npx nearleyc chart.ne -o chart.js
//npx nearley-test chart.js
