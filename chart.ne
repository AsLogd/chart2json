@{%

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
%}

@lexer lexer

chart 		-> section:+					{% semanticCheck %}
section 	-> _ title _ content _			{% ([_, title, __, content]) => ({title, content}) %}
title		-> "[" %id "]"					{% ([_, title]) => title.value %}
content 	-> "{" _ item_list:? _ "}"		{% ([_, __, items]) => items %}
item_list	-> item item_rest:?				{% catWithRest %}
item_rest	-> (newline item):+				{% mapWithSep %}
item		-> key (_ "=" _) value			{% ([key, _, value]) => ({key, value}) %}
value		-> atom atom_rest:?				{% catWithRest %}
atom_rest	-> (%ws atom):+					{% mapWithSep %}
atom ->
	  %number								{% id %}
	| %id									{% id %}
	| %string								{% id %}
key	->
	  %id									{% getVal %}
	| %number								{% getVal %}
newline		-> _ %nl _						{% empty %}
_			-> (%nl | %ws):*				{% empty %}