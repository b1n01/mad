@{%
const moo = require("moo");
const lexer = moo.compile({
	s: {match: /[\s]/, lineBreaks: true},
	q: /'|"/,
	digit: /[\d]+/,
	word: {match: /[\w]+/, value: d => d.trim()},
	"(": "(",
	")": ")",
	"{": "{",
    "}": "}",
	".": ".",
	":": ":",
	",": ",",
	"@": "@",
});

const fmtComp = ([,w,,,,,,as]) => ({type: "comp", name: w.value, value: as ? as[0] : [] })
const fmtArgs = ([arg, args]) => args && args[2] ? [arg, ...args[2][1]] : [arg]
const fmtNamedArg = ([w,,,,a]) => ({type: "named-arg", name: w.value, value: a[0]})
const fmtContentArg = ([w,,,,,,c]) => ({type: "content-arg", name: w.value, value: c ? c[0] : []})
%}

@lexer lexer

comp -> "@" %word                                                   {% fmtComp %}
      | "@" %word %s:* "(" %s:* "{" %s:* (args %s:*):? "}" %s:* ")" {% fmtComp %}
	   
args -> arg (%s:* "," (%s:* args):?):?                              {% fmtArgs %}
	   
arg -> %word %s:* ":" %s:* (string | number)                        {% fmtNamedArg %}
     | %word %s:* ":" %s:* "{" %s:* (comp %s:*):? "}"               {% fmtContentArg %}

# TODO this is not allowing special characters like - . , < > ecc...
string -> %q %s:* (%word %s:*):? %q {% ([,,w]) => w ? w[1].value : '' %}
number -> %digit ("." %digit):? {% ([d1, d2]) => [d1, ...d2 || []].join('') %}