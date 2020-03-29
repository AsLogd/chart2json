@{%

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
%}

@lexer lexer

chart 		-> section:+			 		{% semanticCheck %}
section 	-> title %nl content %nl 		{% getSection %}
title		-> "[" %id "]"					{% removeFirst %}
content 	-> ("{" %nl) item_list "}"		{% removeFirst %}
item_list	-> item:+						{% id %}
item		-> __ key eq value item_end 	{% getItem %}
item_end 	-> _ %nl 						{% empty %}
eq 			-> __ "=" __ 					{% empty %}
value		-> atom value_rest:*			{% catWithRest %}
value_rest	-> __ atom 						{% removeFirst %}

atom ->
	  %number								{% id %}
	| %id									{% id %}
	| %string								{% id %}
key	->
	  %id									{% id %}
	| %number								{% id %}

__ 			-> %ws 							{% empty %}
_  			-> %ws:?						{% empty %}
