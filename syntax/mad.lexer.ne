@{%

const moo = require("moo");

const lexer = moo.compile({
	// Headings
	h6: /^[\s]*#{6}/,
	h5: /^[\s]*#{5}/,
	h4: /^[\s]*#{4}/,
	h3: /^[\s]*#{3}/,
	h2: /^[\s]*#{2}/,
	h1: /^[\s]*#/,
	
	// Blockquote
	quote: /^[\s]*>/,
	
	// Pre Code
	pre: /^[\s]*\|/,
	
	// Strong
	strong: "**",
	
	// Italic
	italic: "__",
	
	// Strikethrough
	strike: "~~",
	
	// Code
	code: "``",
	
	// Any chars in a single line except "**", "~~", "__" and "``"
	string: {match:/(?:(?!__|\*\*|~~|``)[^\n\r])+/, value: s => s.trim()},
	
	// New line
	nl: {match: /[\n\r]/, lineBreaks: true},
	
	// Any number of space on same line
	empty: /[^\S\r\n]/,
});
%}

@lexer lexer

mad -> expr
     | expr %nl mad {% ([e,,m]) => [e, ...m] %}

expr -> h1       {% id %}
      | h2       {% id %}
      | h3       {% id %}
      | h4       {% id %}
      | h5       {% id %}
      | h6       {% id %}
      | p        {% id %}
      | quote    {% id %}
      | pre     {% id %}
	  | %empty:? {% ([,l]) => ({t:'empty'}) %}

# Headings
h1 -> %h1 text:? {% ([,t]) => ({t:'h1', v: t?.v || ''}) %}
h2 -> %h2 text:? {% ([,t]) => ({t:'h2', v: t?.v || ''}) %}
h3 -> %h3 text:? {% ([,t]) => ({t:'h3', v: t?.v || ''}) %}
h4 -> %h4 text:? {% ([,t]) => ({t:'h4', v: t?.v || ''}) %}
h5 -> %h5 text:? {% ([,t]) => ({t:'h5', v: t?.v || ''}) %}
h6 -> %h6 text:? {% ([,t]) => ({t:'h6', v: t?.v || ''}) %}

# Paragraph
p -> text {% ([l]) => ({t:'p', v: l.v}) %}

# Blockquote
quote -> %quote text:? {% ([,t]) => ({t:'quote', v: t?.v || ''}) %}

# Code
pre -> %pre text:? {% ([,t]) => ({t:'pre', v: t?.v || ''}) %}

# Line of text with inline blocks
text -> ( 
	%string {% id %}
  | strong  {% id %}
  | italic  {% id %}
  | strike  {% id %}
  | code    {% id %}
) text:? {% ([s,t]) => ({t:'text', v:[s, ...t?.v || []]}) %} 

# Strong
strong -> %strong nostrong %strong {% ([,t]) => ({t:'strong', v: t.v}) %}

# Italic
italic -> %italic noitalic %italic {% ([,t]) => ({t:'italic', v: t.v}) %}

# Strikethrough
strike -> %strike nostrike %strike {% ([,t]) => ({t:'strike', v: t.v}) %}

# Code
code -> %code nocode %code {% ([,t]) => ({t:'code', v: t.v}) %}

# Line of text without strong blocks
nostrong -> ( 
	%string {% id %}
  | italic  {% id %}
  | strike  {% id %}
  | code    {% id %}
) nostrong:? {% ([s,t]) => ({t:'text', v:[s, ...t?.v || []]}) %} 

# Line of text without italic blocks
noitalic -> ( 
	%string {% id %}
  | strong  {% id %}
  | strike  {% id %}
  | code    {% id %}
) noitalic:? {% ([s,t]) => ({t:'text', v:[s, ...t?.v || []]}) %} 

# Line of text without strike blocks
nostrike -> ( 
	%string {% id %}
  | strong  {% id %}
  | italic  {% id %}
  | code    {% id %}
) nostrike:? {% ([s,t]) => ({t:'text', v:[s, ...t?.v || []]}) %} 

# Line of text without code blocks
nocode -> ( 
	%string {% id %}
  | strong  {% id %}
  | italic  {% id %}
  | strike  {% id %}
) nocode:? {% ([s,t]) => ({t:'text', v:[s, ...t?.v || []]}) %} 