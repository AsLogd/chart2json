"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Groups a list of objects by the value of a given key
function groupBy(list, key) {
    const groups = {};
    list.forEach(e => {
        if (!groups[e[key]]) {
            groups[e[key]] = [e];
        }
        else {
            groups[e[key]].push(e);
        }
    });
    return groups;
}
exports.groupBy = groupBy;
function extractQuotes(str) {
    if (str[0] !== '"')
        return str;
    return str.substr(1, str.length - 2);
}
exports.extractQuotes = extractQuotes;
