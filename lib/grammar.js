// Generated automatically by nearley, version 2.19.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

const moo = require('moo')

let lexer = moo.compile({
	nl: 		{match: /[\n\r]+/, lineBreaks: true},
	ws: 		/[ \t]+/,
	string: 	/"(?:\\["bfnrt\/\\]|\\u[a-fA-F0-9]{4}|[^"\\])*"/,
	literal: 	/[a-zA-Z][a-zA-Z0-9]*/,
	number: 	/-?[0-9]+/,
	'{': 		'{',
	'}': 		'}',
	'[': 		'[',
	']': 		']',
	'=': 		'=',
	// match BOM or any other thing that we may find
	bom: 	{match: /[^\[]+/, lineBreaks: true}
})

const getSection 	= ([title, _, content]) => ({title: title.value, content})
const removeFirst   = ([_, a]) 				=> a
const getItem 		= ([_, key, __, values])=> ({key: key.value, values})
const catWithRest 	= ([i, r])				=> [i, ...(r||[])]
const empty 		= ()					=> null
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "chart$ebnf$1", "symbols": [(lexer.has("bom") ? {type: "bom"} : bom)], "postprocess": id},
    {"name": "chart$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "chart$ebnf$2", "symbols": ["section"]},
    {"name": "chart$ebnf$2", "symbols": ["chart$ebnf$2", "section"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "chart", "symbols": ["chart$ebnf$1", "chart$ebnf$2"], "postprocess": removeFirst},
    {"name": "section$ebnf$1", "symbols": [(lexer.has("nl") ? {type: "nl"} : nl)], "postprocess": id},
    {"name": "section$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "section", "symbols": ["title", (lexer.has("nl") ? {type: "nl"} : nl), "content", "section$ebnf$1"], "postprocess": getSection},
    {"name": "title", "symbols": [{"literal":"["}, (lexer.has("literal") ? {type: "literal"} : literal), {"literal":"]"}], "postprocess": removeFirst},
    {"name": "content$subexpression$1", "symbols": [{"literal":"{"}, (lexer.has("nl") ? {type: "nl"} : nl)]},
    {"name": "content", "symbols": ["content$subexpression$1", "item_list", {"literal":"}"}], "postprocess": removeFirst},
    {"name": "item_list$ebnf$1", "symbols": ["item"]},
    {"name": "item_list$ebnf$1", "symbols": ["item_list$ebnf$1", "item"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "item_list", "symbols": ["item_list$ebnf$1"], "postprocess": id},
    {"name": "item", "symbols": ["__", "key", "eq", "value", "item_end"], "postprocess": getItem},
    {"name": "item_end", "symbols": ["_", (lexer.has("nl") ? {type: "nl"} : nl)], "postprocess": empty},
    {"name": "eq", "symbols": ["_", {"literal":"="}, "_"], "postprocess": empty},
    {"name": "value$ebnf$1", "symbols": []},
    {"name": "value$ebnf$1", "symbols": ["value$ebnf$1", "value_rest"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "value", "symbols": ["atom", "value$ebnf$1"], "postprocess": catWithRest},
    {"name": "value_rest", "symbols": ["__", "atom"], "postprocess": removeFirst},
    {"name": "atom", "symbols": [(lexer.has("number") ? {type: "number"} : number)], "postprocess": id},
    {"name": "atom", "symbols": [(lexer.has("literal") ? {type: "literal"} : literal)], "postprocess": id},
    {"name": "atom", "symbols": [(lexer.has("string") ? {type: "string"} : string)], "postprocess": id},
    {"name": "key", "symbols": [(lexer.has("literal") ? {type: "literal"} : literal)], "postprocess": id},
    {"name": "key", "symbols": [(lexer.has("number") ? {type: "number"} : number)], "postprocess": id},
    {"name": "__", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": empty},
    {"name": "_$ebnf$1", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": id},
    {"name": "_$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": empty}
]
  , ParserStart: "chart"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
