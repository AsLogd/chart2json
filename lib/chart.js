// Generated automatically by nearley, version 2.19.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }


const semanticCheck = require("./semanticCheck").default
const moo = require('moo')

let lexer = moo.compile({
	nl: 		{match: /[\n\r]+/, lineBreaks: true},
	ws: 		/[ \t]+/,
	string: 	/"(?:\\["bfnrt\/\\]|\\u[a-fA-F0-9]{4}|[^"\\])*"/,
	id: 		/[a-zA-Z][a-zA-Z0-9]*/,
	number: 	/-?[0-9]+/,
	'{': 		'{',
	'}': 		'}',
	'[': 		'[',
	']': 		']',
	'=': 		'=',
})
const getSection 	= ([title, _, content]) => ({title, content})
const removeFirst   = ([_, a]) 				=> a
const getItem 		= ([_, key, __, value])	=> ({key, value})
const catWithRest 	= ([i, r])				=> [i, ...(r||[])]
const empty 		= ()					=> null
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "chart$ebnf$1", "symbols": ["section"]},
    {"name": "chart$ebnf$1", "symbols": ["chart$ebnf$1", "section"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "chart", "symbols": ["chart$ebnf$1"], "postprocess": semanticCheck},
    {"name": "section", "symbols": ["title", (lexer.has("nl") ? {type: "nl"} : nl), "content", (lexer.has("nl") ? {type: "nl"} : nl)], "postprocess": getSection},
    {"name": "title", "symbols": [{"literal":"["}, (lexer.has("id") ? {type: "id"} : id), {"literal":"]"}], "postprocess": removeFirst},
    {"name": "content$subexpression$1", "symbols": [{"literal":"{"}, (lexer.has("nl") ? {type: "nl"} : nl)]},
    {"name": "content", "symbols": ["content$subexpression$1", "item_list", {"literal":"}"}], "postprocess": removeFirst},
    {"name": "item_list$ebnf$1", "symbols": ["item"]},
    {"name": "item_list$ebnf$1", "symbols": ["item_list$ebnf$1", "item"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "item_list", "symbols": ["item_list$ebnf$1"], "postprocess": id},
    {"name": "item", "symbols": ["__", "key", "eq", "value", "item_end"], "postprocess": getItem},
    {"name": "item_end", "symbols": ["_", (lexer.has("nl") ? {type: "nl"} : nl)], "postprocess": empty},
    {"name": "eq", "symbols": ["__", {"literal":"="}, "__"], "postprocess": empty},
    {"name": "value$ebnf$1", "symbols": []},
    {"name": "value$ebnf$1", "symbols": ["value$ebnf$1", "value_rest"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "value", "symbols": ["atom", "value$ebnf$1"], "postprocess": catWithRest},
    {"name": "value_rest", "symbols": ["__", "atom"], "postprocess": removeFirst},
    {"name": "atom", "symbols": [(lexer.has("number") ? {type: "number"} : number)], "postprocess": id},
    {"name": "atom", "symbols": [(lexer.has("id") ? {type: "id"} : id)], "postprocess": id},
    {"name": "atom", "symbols": [(lexer.has("string") ? {type: "string"} : string)], "postprocess": id},
    {"name": "key", "symbols": [(lexer.has("id") ? {type: "id"} : id)], "postprocess": id},
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
