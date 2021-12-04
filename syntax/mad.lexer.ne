@{%
const moo = require("moo");
const lexer = moo.states({
     elem: {
		"@": {match: /^\s*@/, push: 'comp'}, // <-- this is not working
		"{": {match: /^\s*{/, push: 'attr'}, // <-- this is not working
		// Elememts
		h6: /^[\s]*#{6}/,
		h5: /^[\s]*#{5}/,
		h4: /^[\s]*#{4}/,
		h3: /^[\s]*#{3}/,
		h2: /^[\s]*#{2}/,
		h1: /^[\s]*#/,
		GT: /^[\s]*>/,
		pipe: /^[\s]*\|/,
		strong: "**",
		italic: "__",
		strike: "~~",
		code: "``",
		string: /(?:(?!__|\*\*|~~|``)[^\n\r])+/,
		NL: {match: /[\n\r]/, lineBreaks: true},
		empty: /[^\S\r\n]/,
	},
	comp : {
		s: {match: /[\s]/, lineBreaks: true},
		q: /'|"/,
		digit: /[\d]+/,
		"(": "(",
		")": {match: ")", pop: 1},
		"{": "{", // diversificare questa da "({" per poter tornate a main
		"}": "}",
		".": ".",
		":": ":",
		",": ",",
		"@": "@",
		word: {match: /[\w-.,]+/, value: d => d.trim()},
	},
	attr: {
		s: {match: /[\s]/, lineBreaks: true},
		digit: /[\d]+/,
		"{":"{",
		"}": {match: "}", pop: 1},
		".": ".",
		"#": "#",
		"=": "=",
		word: /[\w-]+/,
		q: /'|"/, // this will allow apening and closing with different quotes
	}
});

// Elements
const fmtText = ([s,t]) => ({type: "text", value: [s[0], ...t?.value || []]}) 
const fmtInline = (type, string) => ({type:type, value: string.value})
const fmtBlock = (type, string) => ({type: type, value: string?.value || ""})
	
// Components
const fmtComp = ([,w,,,,,,as]) => ({type: "comp", name: w.value, value: as ? as[0] : [] })
const fmtArgs = ([arg, args]) => args && args[2] ? [arg, ...args[2][1]] : [arg]
const fmtNamedArg = ([w,,,,a]) => ({type: "named-arg", name: w.value, value: a[0]})
const fmtContentArg = ([w,,,,,,c]) => ({type: "content-arg", name: w.value, value: c ? c[0] : []})
%}

@lexer lexer

mad -> exp {% id %} | exp %NL mad {% ([e,,m]) => [e[0], ...m] %}

exp -> h1 | h2 | h3 | h4 | h5 | h6 | p | blockquote | pre | e | comp | attr

#####
# Elements
#####

# Blocks elements
h1         -> %h1 text:?   {% ([,t]) => fmtBlock("h1",         t) %}
h2         -> %h2 text:?   {% ([,t]) => fmtBlock("h2",         t) %}
h3         -> %h3 text:?   {% ([,t]) => fmtBlock("h3",         t) %}
h4         -> %h4 text:?   {% ([,t]) => fmtBlock("h4",         t) %}
h5         -> %h5 text:?   {% ([,t]) => fmtBlock("h5",         t) %}
h6         -> %h6 text:?   {% ([,t]) => fmtBlock("h6",         t) %}
blockquote -> %GT text:?   {% ([,t]) => fmtBlock("blockquote", t) %}
pre        -> %pipe text:? {% ([,t]) => fmtBlock("pre",        t) %}
p          -> text         {% ([t])  => fmtBlock("p",          t) %}

# Inline elements
strong -> %strong nostrong %strong {% ([,s]) => fmtInline("strong", s) %}
italic -> %italic noitalic %italic {% ([,s]) => fmtInline("italic", s) %}
strike -> %strike nostrike %strike {% ([,s]) => fmtInline("strike", s) %}
code   -> %code   nocode   %code   {% ([,s]) => fmtInline("code",   s) %}

# "text" is a single line of text containing all inline blocks. The others are 
# line of texts containing all inline blocks except for themself
text     -> (string | strong | italic | strike | code ) text:?     {% fmtText %} 
nostrong -> (string | italic | strike | code)           nostrong:? {% fmtText %} 
noitalic -> (string | strong | strike | code)           noitalic:? {% fmtText %} 
nostrike -> (string | strong | italic | code)           nostrike:? {% fmtText %} 
nocode   -> (string | strong | italic | strike)         nocode:?   {% fmtText %}

# Any chars in a single line except "**", "~~", "__" and "``"
string -> %string {% ([s]) => ({type: "string", value: s.value.trim('')}) %}

# Any number of space on same line
e -> %empty:? {% () => ({type:"empty"}) %}

#####
# Components
#####

comp -> "@" %word                                                   {% fmtComp %}
      | "@" %word %s:* "(" %s:* "{" %s:* (args %s:*):? "}" %s:* ")" {% fmtComp %}
	   
args -> arg (%s:* "," (%s:* args):?):?                              {% fmtArgs %}
	   
arg -> %word %s:* ":" %s:* (stringArg | numberArg)                  {% fmtNamedArg %}
     | %word %s:* ":" %s:* "{" %s:* (comp %s:*):? "}"               {% fmtContentArg %}

# TODO this is not allowing special characters like - . , < > ecc...
stringArg -> %q %s:* (%word %s:*):? %q {% ([,,w])    => w ? w[1].value : '' %}
numberArg -> %digit ("." %digit):?     {% ([d1, d2]) => [d1, ...d2 || []].join('') %}

#####
# Attribues
#####

attr -> "{" %s:* (attrs %s:*):? "}" {% ([,,attrs]) => ({type:"attrs", value: attrs[0] || []}) %}

attrs -> props
       | id    
       | props %s:+ id            {% ([ps,,id])       => [...ps, id]          %}           
       | id %s:+ props            {% ([id,,ps])       => [id, ...ps]          %}
       | props %s:+ id %s:+ props {% ([ps1,,id,,ps2]) => [...ps1, id, ...ps2] %}

props -> (boolAtt | namedAttr | class) (%s:+ props):? {% ([d,ps]) => ps ? [d[0], ...ps[1]] : [d[0]] %}

boolAtt   -> %word                                      {% ([d])      => ({type:"bool-attr",  value: d.value}) %}
namedAttr -> %word %s:* "=" %s:* (strAttr | numberAttr) {% ([n,,,,d]) => ({type:"named-attr", value: d[0]})    %}
class     -> "." %word                                  {% ([,d])     => ({type:"class",      value: d.value}) %}
id        -> "#" %word                                  {% ([,d])     => ({type:"id",         value: d.value}) %}

strAttr    -> %q %s:* %word:? %s:* %q {% ([,,w])    => w?.value || ''            %}
numberAttr -> %digit ("." %digit):?   {% ([d1, d2]) => [d1, ...d2 || []].join('') %}