@{%
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
%}

@lexer lexer

chart 		-> %bom:? section:+	 			{% removeFirst %}
section 	-> title %nl content %nl:? 		{% getSection %}
title		-> "[" %literal "]"				{% removeFirst %}
content 	-> ("{" %nl) item_list "}"		{% removeFirst %}
item_list	-> item:+						{% id %}
item		-> __ key eq value item_end 	{% getItem %}
item_end 	-> _ %nl 						{% empty %}
eq 			-> _ "=" _ 						{% empty %}
value		-> atom value_rest:*			{% catWithRest %}
value_rest	-> __ atom 						{% removeFirst %}

atom ->
	  %number								{% id %}
	| %literal								{% id %}
	| %string								{% id %}
key	->
	  %literal								{% id %}
	| %number								{% id %}

__ 			-> %ws 							{% empty %}
_  			-> %ws:?						{% empty %}
