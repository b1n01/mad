@{%
const moo = require("moo");
const lexer = moo.compile({
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
	string: {match:/(?:(?!__|\*\*|~~|``)[^\n\r])+/, value: s => s.trim()},
	NL: {match: /[\n\r]/, lineBreaks: true},
	empty: /[^\S\r\n]/,
});

const fmtText = ([s,t]) => ({type: "text", value: [s[0], ...t?.value || []]}) 
const fmtInline = (type, string) => ({type:type, value: string.value})
const fmtBlock = (type, string) => ({type: type, value: string?.value || ""})
%}

@lexer lexer

mad -> expr | expr %NL mad {% ([e,,m]) => [e[0], ...m] %}

expr -> h1 | h2 | h3 | h4 | h5 | h6 | p | blockquote | pre | e

# Blocks elements
h1         -> %h1 text:?   {% ([,t]) => fmtBlock("h1",         t) %}
h2         -> %h2 text:?   {% ([,t]) => fmtBlock("h2",         t) %}
h3         -> %h3 text:?   {% ([,t]) => fmtBlock("h3",         t) %}
h4         -> %h4 text:?   {% ([,t]) => fmtBlock("h4",         t) %}
h5         -> %h5 text:?   {% ([,t]) => fmtBlock("h5",         t) %}
h6         -> %h6 text:?   {% ([,t]) => fmtBlock("h6",         t) %}
blockquote -> %GT text:?   {% ([,t]) => fmtBlock("blockquote", t) %}
pre        -> %pipe text:? {% ([,t]) => fmtBlock("pre",        t) %}
p          -> text         {% ([t])   => fmtBlock("p",         t) %}

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
string -> %string {% ([s]) => ({type: "string", value: s.value}) %}

# Any number of space on same line
e -> %empty:? {% () => ({type:"empty"}) %}