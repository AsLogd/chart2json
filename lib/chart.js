// Generated automatically by nearley, version 2.19.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }


	// TODO: Memory fails maybe because ambiguity of whitespace?
const semanticCheck = require("./semanticCheck").default
const moo = require('moo')

let lexer = moo.compile({
	nl: 		{match: /[\n\r]/, lineBreaks: true},
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
const empty 		= ()		=> null
const getVal		= ([x])		=> x.value
const getStr		= ([str]) 	=> str.value.substr(1, str.value.length- 2)
const getNum 		= ([num]) 	=> Number(num.value)
const mapWithSep 	= ([list])	=> list.map(a => a[1])
const catWithRest 	= ([i, r])	=> [i, ...(r||[])]
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "chart$ebnf$1", "symbols": ["section"]},
    {"name": "chart$ebnf$1", "symbols": ["chart$ebnf$1", "section"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "chart", "symbols": ["chart$ebnf$1"], "postprocess": semanticCheck},
    {"name": "section", "symbols": ["_", "title", "_", "content", "_"], "postprocess": ([_, title, __, content]) => ({title, content})},
    {"name": "title", "symbols": [{"literal":"["}, (lexer.has("id") ? {type: "id"} : id), {"literal":"]"}], "postprocess": ([_, title]) => title.value},
    {"name": "content$ebnf$1", "symbols": ["item_list"], "postprocess": id},
    {"name": "content$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "content", "symbols": [{"literal":"{"}, "_", "content$ebnf$1", "_", {"literal":"}"}], "postprocess": ([_, __, items]) => items},
    {"name": "item_list$ebnf$1", "symbols": ["item_rest"], "postprocess": id},
    {"name": "item_list$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "item_list", "symbols": ["item", "item_list$ebnf$1"], "postprocess": catWithRest},
    {"name": "item_rest$ebnf$1$subexpression$1", "symbols": ["newline", "item"]},
    {"name": "item_rest$ebnf$1", "symbols": ["item_rest$ebnf$1$subexpression$1"]},
    {"name": "item_rest$ebnf$1$subexpression$2", "symbols": ["newline", "item"]},
    {"name": "item_rest$ebnf$1", "symbols": ["item_rest$ebnf$1", "item_rest$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "item_rest", "symbols": ["item_rest$ebnf$1"], "postprocess": mapWithSep},
    {"name": "item$subexpression$1", "symbols": ["_", {"literal":"="}, "_"]},
    {"name": "item", "symbols": ["key", "item$subexpression$1", "value"], "postprocess": ([key, _, value]) => ({key, value})},
    {"name": "value$ebnf$1", "symbols": ["atom_rest"], "postprocess": id},
    {"name": "value$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "value", "symbols": ["atom", "value$ebnf$1"], "postprocess": catWithRest},
    {"name": "atom_rest$ebnf$1$subexpression$1", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws), "atom"]},
    {"name": "atom_rest$ebnf$1", "symbols": ["atom_rest$ebnf$1$subexpression$1"]},
    {"name": "atom_rest$ebnf$1$subexpression$2", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws), "atom"]},
    {"name": "atom_rest$ebnf$1", "symbols": ["atom_rest$ebnf$1", "atom_rest$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "atom_rest", "symbols": ["atom_rest$ebnf$1"], "postprocess": mapWithSep},
    {"name": "atom", "symbols": [(lexer.has("number") ? {type: "number"} : number)], "postprocess": id},
    {"name": "atom", "symbols": [(lexer.has("id") ? {type: "id"} : id)], "postprocess": id},
    {"name": "atom", "symbols": [(lexer.has("string") ? {type: "string"} : string)], "postprocess": id},
    {"name": "key", "symbols": [(lexer.has("id") ? {type: "id"} : id)], "postprocess": getVal},
    {"name": "key", "symbols": [(lexer.has("number") ? {type: "number"} : number)], "postprocess": getVal},
    {"name": "newline", "symbols": ["_", (lexer.has("nl") ? {type: "nl"} : nl), "_"], "postprocess": empty},
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1$subexpression$1", "symbols": [(lexer.has("nl") ? {type: "nl"} : nl)]},
    {"name": "_$ebnf$1$subexpression$1", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws)]},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", "_$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
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
