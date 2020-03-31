"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Error_1 = require("./Error");
const Meta_1 = require("./Meta");
/*
 * Performs a semantic check on a syntactically correct chart file
 */
function semanticCheck(chart) {
    return isValidChart(chart);
}
exports.default = semanticCheck;
/*
 * Returns null if the chart is valid. Otherwise returns an error
 */
function isValidChart(secs) {
    if (!containsSectionOnce(secs, Meta_1.ESection.SONG)) {
        return {
            reason: Error_1.getErrorString(Error_1.EError.MISSING_SECTION, {
                section: Meta_1.ESection.SONG
            })
        };
    }
    const songSection = getSection(secs, Meta_1.ESection.SONG);
    const songSectionError = checkSongTypes(Meta_1.SongTypes, songSection.content);
    if (songSectionError) {
        return songSectionError;
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
function containsSectionOnce(sections, sectionName) {
    //console.log("in cso:", sections, sectionName)
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
                    section: Meta_1.ESection.SONG,
                    item: reqItem
                })
            };
        }
    }
    return null;
}
function checkSongStringItems(keys, content) {
    const strItems = content.filter(item => keys.some(key => item.key === key));
    const itemWithErr = strItems.find(item => item.values.length !== 1
        || item.values[0].type !== "string");
    if (itemWithErr) {
        return {
            reason: Error_1.getErrorString(Error_1.EError.WRONG_TYPE, {
                section: Meta_1.ESection.SONG,
                item: itemWithErr.key,
                expected: Meta_1.FString(),
                found: Meta_1.typeFromRawValue(itemWithErr.values)
            })
        };
    }
    return null;
}
function checkSongNumberItems(keys, content) {
    const numItems = content.filter(item => keys.some(key => item.key === key));
    const itemWithErr = numItems.find(item => item.values.length !== 1
        || item.values[0].type !== "number");
    if (itemWithErr) {
        return {
            reason: Error_1.getErrorString(Error_1.EError.WRONG_TYPE, {
                section: Meta_1.ESection.SONG,
                item: itemWithErr.key,
                expected: Meta_1.FNumber(),
                found: Meta_1.typeFromRawValue(itemWithErr.values)
            })
        };
    }
    return null;
}
function checkSongLiteralItems(literalTuples, content) {
    let literalValues = [];
    const itemWithErr = content.find(item => {
        // Corresponding tuple describing this literal
        const tuple = literalTuples.find(tuple => tuple[0] === item.key);
        if (!tuple) {
            // If no tuple found, it's not a literal
            return false;
        }
        const hasOneValue = item.values.length === 1;
        // Literal should have one value
        if (!hasOneValue) {
            return true;
        }
        literalValues = tuple[1].values;
        // Value is ok if it's equal to any of the defined literal values
        const valueIsOk = literalValues.some(definedLiteral => definedLiteral === item.values[0].value);
        return !valueIsOk;
    });
    if (itemWithErr) {
        return {
            reason: Error_1.getErrorString(Error_1.EError.WRONG_TYPE, {
                section: Meta_1.ESection.SONG,
                item: itemWithErr.key,
                expected: Meta_1.FLiteral(literalValues),
                found: Meta_1.typeFromRawValue(itemWithErr.values)
            })
        };
    }
    return null;
}
//tsc semanticCheck.ts --lib 'es2018','dom' --module 'commonjs'
//npx nearleyc chart.ne -o chart.js
//npx nearley-test chart.js
