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
	word: /[\w]+/,
	q: /'|"/,
	e: /[^\S\r\n]+/,
	colon: ":",
	sc: ";",
	dash: "-",
	comma: ",",
});
%}

@lexer lexer

mad -> expr
     | expr %ws:? mad 
	 
expr -> comp    

#####
# Components
#####

comp  -> %e:? tag 
       | %e:? tag %ws:? %openAttr %ws:? args %ws:? %closeAttr
	   
args  -> arg %ws:? %comma:? 
       | arg %ws:? %comma %ws:? args 
	   
arg   -> %word %ws:? %colon %ws:? anum 
       #| %word %ws:? ":" %ws:? %openAttr mad %closeAttr

tag -> %colon %word %dash %word %sc:?

anum -> string | number

string -> %q %word:? %q 

number -> %digit | %digit %dot %digit