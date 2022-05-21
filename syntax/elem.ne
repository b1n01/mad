@{%
const moo = require("moo");
const lexer = moo.compile({
  // Elements lexer
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
	e: /[^\S\r\n]/,
	string: /(?:(?!__|\*\*|~~|``)[^\n\r])+/,
});

const fmtText = ([s,,t]) => ({type: "text", value: [s[0], ...t?.value || []]}) 
const fmtInline = (type, string) => ({type:type, value: string.value})
const fmtBlock = (type, string) => ({type: type, value: string?.value || []})

%}

@lexer lexer

elem -> (h1 | h2 | h3 | h4 | h5 | h6 | p | blockquote | pre | e) {% id %}

# Blocks elements
h1         -> %h1   %e:* text:? {% ([,,t]) => fmtBlock("h1",         t) %}
h2         -> %h2   %e:* text:? {% ([,,t]) => fmtBlock("h2",         t) %}
h3         -> %h3   %e:* text:? {% ([,,t]) => fmtBlock("h3",         t) %}
h4         -> %h4   %e:* text:? {% ([,,t]) => fmtBlock("h4",         t) %}
h5         -> %h5   %e:* text:? {% ([,,t]) => fmtBlock("h5",         t) %}
h6         -> %h6   %e:* text:? {% ([,,t]) => fmtBlock("h6",         t) %}
blockquote -> %GT   %e:* text:? {% ([,,t]) => fmtBlock("blockquote", t) %}
pre        -> %pipe %e:* text:? {% ([,,t]) => fmtBlock("pre",        t) %}
p          -> %e:* text         {% ([,t])  => fmtBlock("p",          t) %}

# Inline elements
strong -> %strong %e:* nostrong %strong {% ([,,s]) => fmtInline("strong", s) %}
italic -> %italic %e:* noitalic %italic {% ([,,s]) => fmtInline("italic", s) %}
strike -> %strike %e:* nostrike %strike {% ([,,s]) => fmtInline("strike", s) %}
code   -> %code   %e:* nocode   %code   {% ([,,s]) => fmtInline("code",   s) %}

# "text" is a single line of text containing all inline blocks. The others are 
# line of texts containing all inline blocks except for themself
text     -> (string | strong | italic | strike | code ) %e:* text:?     {% fmtText %} 
nostrong -> (string | italic | strike | code)           %e:* nostrong:? {% fmtText %} 
noitalic -> (string | strong | strike | code)           %e:* noitalic:? {% fmtText %} 
nostrike -> (string | strong | italic | code)           %e:* nostrike:? {% fmtText %} 
nocode   -> (string | strong | italic | strike)         %e:* nocode:?   {% fmtText %} 

# Any chars in a single line except "**", "~~", "__" and "``"
string -> %string {% ([s]) => ({type: "string", value: s.value.trim('')}) %}

# Any number of space on same line
e -> %e:? {% () => ({type:"empty"}) %}