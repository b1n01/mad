@{%
// TODO 
// - "string" cannot contain "/{" or "\@"
// - handle comments
// - components inside components are not working!!!
// - argument of type string have quotes inside the value field? Should we remove them?

const moo = require("moo");
const lexer = moo.states({
  	// Elements lexer
	elem: {
		OB: {match: /{/, push: 'attr'}, // Go to attribute state
		AT: {match: /@/, push: 'comp'}, // Go to attribute state
		h6: /^[^\S\r\n]*#{6}/,
		h5: /^[^\S\r\n]*#{5}/,
		h4: /^[^\S\r\n]*#{4}/,
		h3: /^[^\S\r\n]*#{3}/,
		h2: /^[^\S\r\n]*#{2}/,
		h1: /^[^\S\r\n]*#/,
		GT: /^[^\S\r\n]*>/,
		pipe: /^[^\S\r\n]*\|/,
		strong: "**",
		italic: "__",
		strike: "~~",
		code: "``",
		NL: {match: /[\n\r]/, lineBreaks: true}, // New line
		e: /[^\S\r\n]/,
		string: /(?:(?!__|\*\*|~~|``|{|@)[^\n\r])+/, // todo scaped braces "\{|" and "\@" should be allowed
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
	  NL: {match: /[\n\r]/, lineBreaks: true, pop: 1}, // New line
	  OB: {match: /{/, push: 'comp-content'}, // Go to comp-content state

	  // A single whitespace (space, tab or line-break)
	  _: { match: /\s/, lineBreaks: true },

	  // A single word containing alphanumeric characters and "-" but starts with a char
	  wrd: /[a-z]+[\w-]*/,

	  // Symbols
	  symbols: ["{", "@"],
	},
	"comp-content": {
	  CB: {match: /}/, pop: 1}, // Go back to element
	  //AT: {match: /@/, push: 'comp'}, // Go to attribute state
		
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
	  symbols: ["{", "}", ",", ":", "@"],
	},
});


const fmtElement   = (type, value, attrs) => ({category: "element",   type,       value, attrs})
const fmtTerminal  = (type, value)        => ({category: "terminal",  type,       value       })
const fmtInline    = (type, value)        => ({category: "inline",    type,       value       })
const fmtAttribute = (type, name, value)  => ({category: "attribute", type, name, value       })
const fmtComponent = (name, value)        => ({category: "component",       name, value       })
const fmtArgument  = (type, name, value)  => ({category: "argument",  type, name, value       })

%}

@lexer lexer

mad -> exp {% id %} | exp %NL mad {% ([e,,m]) => [e[0], ...m] %}

exp -> elem | comp | e

##########
# Elements
##########

elem -> (h1 | h2 | h3 | h4 | h5 | h6 | p | blockquote | pre) (attr %e:*):? {% ([b,a]) => fmtElement(b[0].type, b[0].value, a?.[0] || []) %}

# Blocks elements
h1         -> %h1   %e:* text:? {% ([,,t]) => ({type: "h1",    value: t?.value || []}) %}
h2         -> %h2   %e:* text:? {% ([,,t]) => ({type: "h2",    value: t?.value || []}) %}
h3         -> %h3   %e:* text:? {% ([,,t]) => ({type: "h3",    value: t?.value || []}) %}
h4         -> %h4   %e:* text:? {% ([,,t]) => ({type: "h4",    value: t?.value || []}) %}
h5         -> %h5   %e:* text:? {% ([,,t]) => ({type: "h5",    value: t?.value || []}) %}
h6         -> %h6   %e:* text:? {% ([,,t]) => ({type: "h6",    value: t?.value || []}) %}
blockquote -> %GT   %e:* text:? {% ([,,t]) => ({type: "quote", value: t?.value || []}) %}
pre        -> %pipe %e:* text:? {% ([,,t]) => ({type: "pre",   value: t?.value || []}) %}
p          ->       %e:* text   {% ([,t])  => ({type: "p",     value: t?.value || []}) %}

# Inline elements
strong -> %strong %e:* nostrong %strong {% ([,,s]) => fmtInline("strong", s.value) %}
italic -> %italic %e:* noitalic %italic {% ([,,s]) => fmtInline("italic", s.value) %}
strike -> %strike %e:* nostrike %strike {% ([,,s]) => fmtInline("strike", s.value) %}
code   -> %code   %e:* nocode   %code   {% ([,,s]) => fmtInline("code",   s.value) %}

# "text" is a single line of text containing all inline blocks. The others are 
# line of texts containing all inline blocks except for themself
text     -> (string | strong | italic | strike | code) %e:* text:?     {% ([s,,t]) => ({value: [s[0], ...t?.value || []]})  %} 
nostrong -> (string | italic | strike | code)          %e:* nostrong:? {% ([s,,t]) => ({value: [s[0], ...t?.value || []]})  %} 
noitalic -> (string | strong | strike | code)          %e:* noitalic:? {% ([s,,t]) => ({value: [s[0], ...t?.value || []]})  %} 
nostrike -> (string | strong | italic | code)          %e:* nostrike:? {% ([s,,t]) => ({value: [s[0], ...t?.value || []]})  %} 
nocode   -> (string | strong | italic | strike)        %e:* nocode:?   {% ([s,,t]) => ({value: [s[0], ...t?.value || []]})  %} 

# Any chars in a single line except "**", "~~", "__" and "``"
string -> %string {% ([s]) => fmtTerminal("string", s.value.trim('')) %}

# Any number of space on same line
e -> %e:* {% () => fmtTerminal("empty", null) %} 

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

boolAtt   ->     %wrd                                 {% ([d])            => fmtAttribute("bool",  null,    d.value) %}
namedAttr ->     %wrd %_:* "=" %_:* (str | num)       {% ([n,,,,d])       => fmtAttribute("named", n.value, d[0])    %}
class     -> "." %wrd                                 {% ([,d])           => fmtAttribute("class", null,    d.value) %}
id        -> "#" %wrd                                 {% ([,d])           => fmtAttribute("id",    null,    d.value) %}


############
# Components
############

comp -> "@" %wrd %_:*                                 {% ([,w])        => fmtComponent(w.value, [])                %}
      | "@" %wrd %_:* "{" %_:* (args %_:*):? "}" %_:* {% ([,w,,,,as])  => fmtComponent(w.value, as?.[0] || [])     %}
	   
args -> arg (%_:* "," (%_:* args):?):?                {% ([arg, args]) => args?.[2] ? [arg, ...args[2][1]] : [arg] %}
	   
arg -> %wrd %_:* ":" %_:* (str | num)                 {% ([w,,,,a])    => fmtArgument("string", w.value, a[0])     %}
     #| %wrd %_:* ":" %_:* comp                        {% ([w,,,,c])    => fmtArgument("comp",   w.value,  c)       %}

#########
# Utility
#########

str -> %str  {% ([n]) => n.value %}
num -> %num  {% ([n]) => n.value %}