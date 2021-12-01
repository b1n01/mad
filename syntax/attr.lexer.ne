@{%
const moo = require("moo");
const lexer = moo.compile({
	ws: {match: /[\s]+/, lineBreaks: true},
	digit: /[\d]+/,
	openAttr: /{/,
	closeAttr: /}/,
	dot: ".",
	hash: "#",
	eq: "=",
	word: /[\w-.]+/,
	q: /'|"/,
	e: /[^\S\r\n]+/,
});
%}

@lexer lexer
	  
attr -> %e:? %openAttr %ws:? attrs %ws:? %closeAttr

attrs -> props
       | id                  
       | props %ws id          
       | id %ws props          
       | props %ws id %ws props 

props -> prop | prop %ws props

prop -> boolAtt | namedAttr | class

boolAtt -> %word
namedAttr -> %word %ws:? %eq %ws:? anum
class -> %dot %word
id -> %hash %word

anum -> string | number
string -> %q %word:? %q 
number -> %digit | %digit %dot %digit