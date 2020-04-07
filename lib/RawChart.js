"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function fromParsedChart(pc) {
    return {
        sections: pc.map(ps => fromParsedSection(ps))
    };
}
exports.fromParsedChart = fromParsedChart;
function fromParsedSection(ps) {
    return {
        title: ps.title,
        content: fromParsedItems(ps.content)
    };
}
function fromParsedItems(pis) {
    const rawContent = {};
    for (const item of pis) {
        rawContent[item.key] = item.values.map(patom => fromParsedAtom(patom));
    }
    return rawContent;
}
function fromParsedAtom(patom) {
    if (patom.type === "number") {
        return parseInt(patom.value);
    }
    return patom.value;
}
