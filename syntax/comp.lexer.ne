@{%
const moo = require("moo");
const lexer = moo.compile({
	s: {match: /[\s]+/, lineBreaks: true}, // white spaces
	q: /'|"/, // double or single quotes
	digit: /[\d]+/,
	word: /[\w]+/,
	"(": "(",
	")": ")",
	"{": "{",
    "}": "}",
	".": ".",
	":": ":",
	";": ";",
	",": ",",
	"@": "@",
});
%}

@lexer lexer

comp  -> "@" word
       | "@" word %s:? "(" %s:? "{" %s:? args:* %s:? "}" %s:? ")"
	     {% ([,w,,,,,,as]) => ({type: "comp", name:w.value, value:  as }) %}
	   
args  -> arg (%s:? ","):? {% ([arg]) => [arg] %}
       | arg %s:? "," %s:? args {% ([arg,,,,args]) => [arg, ...args] %}
	   
arg   -> word %s:? ":" %s:? anum 
         {% ([w,,,,a]) => ({type: "named-arg", name: w.value, value: a.value}) %}
       | word %s:? ":" %s:? "{" %s:? comp:* %s:? "}"
	     {% ([w,,,,,c]) => ({type: "content-arg", name: w.value, value: c?.value || ''}) %}

	   
anum -> string {% id %} | number {% id %}

# TODO strings cannot contain special. chars right now (like "-")
string -> %q %s:? word:? %s:? %q 
{% ([,,w]) => ({type: "string", value: w?.value || ''}) %}

number -> %digit ("." %digit):?
{% ([d1, d2]) => ({type: "number", value: [d1, ...d2 || []].join('')}) %}

word -> %word {% ([w]) => ({type: "word", value: w.value.trim()}) %}
