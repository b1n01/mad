@{%
// TODO 
// - string cannot contain "/{" or "\@"
// - match components
// - handle multiple lines
// - handle comments
// - empty comp are not working because we pop the state only with "}"
// - now we are using ";" to end an empty components, can we use a sub state?


const moo = require("moo");
const lexer = moo.states({
  	// Elements lexer
	elem: {
		OB: {match: /{/, push: 'attr'}, // Go to attribute state
		AT: {match: /@/, push: 'comp'}, // Go to attribute state
		h6: /^[\s]*#{6}/,
		h5: /^[\s]*#{5}/,
		h4: /^[\s]*#{4}/,
		h3: /^[\s]*#{3}/,
		h2: /^[\s]*#{2}/,
		h1: /^[^\S\r\n]*#/, // todo should we use this that is not including new lines???
		GT: /^[\s]*>/,
		pipe: /^[\s]*\|/,
		strong: "**",
		italic: "__",
		strike: "~~",
		code: "``",
		NL: {match: /[\n\r]/, lineBreaks: true}, // New line
		e: /[^\S\r\n]/,
		string: /(?:(?!__|\*\*|~~|``|{)[^\n\r])+/, // todo scaped braces "\{|" and "\@" should be allowed
	},
	attr: {
		CB: {match: /}/, pop: 1}, // Go back to element
		
		// A single whitespace (space, tab or line-break)
		_: { match: /\s/, lineBreaks: true },

		// Signed float or integer
		num: /[+-]?(?:\d*\.)?\d+/,

		// A single word containing alphanumeric characters and "-" but starts with a char
		wrd: /[a-z]+[\w-]*/,

		// Single and double quoted string that allows escaped quotes
		str: [
			{ match: /"(?:\\.|[^\\])*?"/, lineBreaks: true },
			{ match: /'(?:\\.|[^\\])*?'/, lineBreaks: true },
		],

		// Symbols
		symbols: ["{", "}", ".", "#", "="],
	},
	comp: {
	  CB: {match: /}/, pop: 1}, // Go back to element
	  SC: {match: /;/, pop: 1}, // Go back to element
	  //NL: {match: /[\n\r]/, lineBreaks: true, pop: 1 }, // New line

	  // A single whitespace (space, tab or line-break)
	  _: { match: /\s/, lineBreaks: true },
	  //_: { match: /[^\S\r\n]/, lineBreaks: true },

	  // Signed float or integer
	  num: /[+-]?(?:\d*\.)?\d+/,

	  // A single word containing alphanumeric characters and "-" but starts with a char
	  wrd: /[a-z]+[\w-]*/,

	  // Single and double quoted string that allows escaped quotes
	  str: [
		{ match: /"(?:\\.|[^\\])*?"/, lineBreaks: true },
		{ match: /'(?:\\.|[^\\])*?'/, lineBreaks: true },
	  ],

	  // Symbols
	  symbols: ["{", "}", "@", ",", ":", ";"],	
	}
});

const fmtText = ([s,,t]) => ({type: "text", value: [s[0], ...t?.value || []]}) 
const fmtInline = (type, string) => ({type:type, value: string.value})
const fmtBlock = (type, string) => ({type: type, value: string?.value || []})

%}

@lexer lexer

mad -> exp {% id %} | exp %NL mad {% ([e,,m]) => [e[0], ...m] %}

exp -> elem | comp | e

##########
# Elements
##########

elem -> (h1 | h2 | h3 | h4 | h5 | h6 | p | blockquote | pre) (attr %e:*):? {% ([e,a]) => ({type: "elem", value: e[0], attr: a?.[0] || []}) %}

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

############
# Attributes
############

attr -> "{" %_:* (attrs %_:*):? "}"                   {% ([,,attrs])      => attrs?.[0] || [] %}

attrs -> props                                        {% ([ps])           => [...ps]              %}    
       | id                                           {% ([id])           => [id]                 %}  
       | props %_:+ id                                {% ([ps,,id])       => [...ps, id]          %}           
       | id %_:+ props                                {% ([id,,ps])       => [id, ...ps]          %}
       | props %_:+ id %_:+ props                     {% ([ps1,,id,,ps2]) => [...ps1, id, ...ps2] %}

props -> (boolAtt | namedAttr | class) (%_:+ props):? {% ([d, ps])        => ps ? [d[0], ...ps[1]] : [d[0]] %}

boolAtt   -> %wrd                                     {% ([d])            => ({type:"bool-attr",  value: d.value})             %}
namedAttr -> %wrd %_:* "=" %_:* (str | num)           {% ([n,,,,d])       => ({type:"named-attr", name: n.value, value: d[0]}) %}
class     -> "." %wrd                                 {% ([,d])           => ({type:"class",      value: d.value})             %}
id        -> "#" %wrd                                 {% ([,d])           => ({type:"id",         value: d.value})             %}

#str -> %str  {% ([n]) => n.value %}
#num -> %num  {% ([n]) => n.value %}

############
# Components
############

comp -> "@" %wrd ";"                          {% ([,w])        => ([{type: "comp", name: w.value, value: [] }]) %}
      | "@" %wrd %_:* "{" %_:* (args %_:*):? "}" {% ([,w,,,,as])  => ([{type: "comp", name: w.value, value: as?.[0] || [] }]) %}
	   
args -> arg (%_:* "," (%_:* args):?):?           {% ([arg, args]) => args?.[2] ? [arg, ...args[2][1]] : [arg] %}
	   
arg -> %wrd %_:* ":" %_:* (str | num)            {% ([w,,,,a])    => ({type: "alphanum-arg", name: w.value, value: a[0]}) %}
     | %wrd %_:* ":" %_:* comp                   {% ([w,,,,c])    => ({type: "comp-arg", name: w.value, value: c}) %}

str -> %str  {% ([n]) => n.value %}
num -> %num  {% ([n]) => n.value %}