@{%
const moo = require("moo");

// Math a single non line-breaking whitespace
const nonBreakingSpace = { match: /[^\S\r\n]/ };

// Match a single whitespace (space, tab or line-break)
const space = { match: /\s/, lineBreaks: true };

// Match a single new line character
const newLine = { match: /[\n\r]/, lineBreaks: true };

// Match a number, optionally with a decimal point and sign
const number = { match: /[+-]?(?:\d*\.)?\d+/ };

// A single word containing alphanumeric characters and hypen,
// but starts with an alphabetical character
const word = { match: /[a-z]+[\w-]*/ };

// Match any characters in a single line except for *`~{_ and line-breaks
// They can be in the string escaped by a backslash \
const string = { match: /(?:(?:\\{|\\\*|\\`|\\~|\\_)|[^{\*`_~\n\r])+/ };

// Match a single or double quoted string that allows escaped quotes with
// backspaces \
const quotedString = [
	{ match: /"(?:\\.|[^\\])*?"/, lineBreaks: true },
	{ match: /'(?:\\.|[^\\])*?'/, lineBreaks: true },
];

// Match any number of spces followeb by a @	
const at = { match: /^[^\S\r\n]*@/ };

const lexer = moo.states({
	element: {
		openBrace: { match: "{", push: 'attribute' },
		at: { ...at, push: 'component' }, 
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
		newLine,
		nonBreakingSpace,
		string
	},
	attribute: {
		closeBrace: { match: /}/, pop: 1 },
		space,
		number,
		word,
		quotedString,
		symbols: [".", "#", "="],
	},
	component: {
	  	newLine: { ...newLine, pop: 1},
	  	openBrace: { match: "{", push: 'componentContent' },
		at,
		space,
		word,
	},
	componentContent: {
		closeBrace: {  match: /}/, pop: 1 },
		space,
		number,
		word,
		quotedString,
		symbols: [",", ":"],
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

mad -> exp {% id %} | exp %newLine mad {% ([e,,m]) => [e[0], ...m] %}

exp -> elem | comp | empty

##########
# Elements
##########

elem -> (h1 | h2 | h3 | h4 | h5 | h6 | p | quote | pre) (attr _n):? {% ([b,a]) => fmtElement(b[0].type, b[0].value, a?.[0] || []) %}

# Blocks elements
h1    -> %h1   _n text:? {% ([,,t]) => ({type: "h1",    value: t?.value || []}) %}
h2    -> %h2   _n text:? {% ([,,t]) => ({type: "h2",    value: t?.value || []}) %}
h3    -> %h3   _n text:? {% ([,,t]) => ({type: "h3",    value: t?.value || []}) %}
h4    -> %h4   _n text:? {% ([,,t]) => ({type: "h4",    value: t?.value || []}) %}
h5    -> %h5   _n text:? {% ([,,t]) => ({type: "h5",    value: t?.value || []}) %}
h6    -> %h6   _n text:? {% ([,,t]) => ({type: "h6",    value: t?.value || []}) %}
quote -> %GT   _n text:? {% ([,,t]) => ({type: "quote", value: t?.value || []}) %}
pre   -> %pipe _n text:? {% ([,,t]) => ({type: "pre",   value: t?.value || []}) %}
p     ->       _n text   {% ([,t])  => ({type: "p",     value: t?.value || []}) %}

# Inline elements
strong -> %strong _n nostrong %strong {% ([,,s]) => fmtInline("strong", s.value) %}
italic -> %italic _n noitalic %italic {% ([,,s]) => fmtInline("italic", s.value) %}
strike -> %strike _n nostrike %strike {% ([,,s]) => fmtInline("strike", s.value) %}
code   -> %code   _n nocode   %code   {% ([,,s]) => fmtInline("code",   s.value) %}

# "text" is a single line of text containing all inline blocks. The others are 
# line of texts containing all inline blocks except for themself
text     -> (string | strong | italic | strike | code) _n text:?     {% ([s,,t]) => ({value: [s[0], ...t?.value || []]})  %} 
nostrong -> (string | italic | strike | code)          _n nostrong:? {% ([s,,t]) => ({value: [s[0], ...t?.value || []]})  %} 
noitalic -> (string | strong | strike | code)          _n noitalic:? {% ([s,,t]) => ({value: [s[0], ...t?.value || []]})  %} 
nostrike -> (string | strong | italic | code)          _n nostrike:? {% ([s,,t]) => ({value: [s[0], ...t?.value || []]})  %} 
nocode   -> (string | strong | italic | strike)        _n nocode:?   {% ([s,,t]) => ({value: [s[0], ...t?.value || []]})  %} 

############
# Attributes
############

attr -> "{" _ (attrs _):? "}"                       {% ([,,attrs])      => attrs?.[0] || []                  %} 

attrs -> props                                      {% ([ps])           => [...ps]                           %}    
	   | id                                         {% ([id])           => [id]                              %}  
	   | props __ id                                {% ([ps,,id])       => [...ps, id]                       %}           
	   | id __ props                                {% ([id,,ps])       => [id, ...ps]                       %}
	   | props __ id __ props                       {% ([ps1,,id,,ps2]) => [...ps1, id, ...ps2]              %}

props -> (boolAtt | namedAttr | class) (__ props):? {% ([d, ps])        => ps ? [d[0], ...ps[1]] : [d[0]]    %}

boolAtt   ->     word                               {% ([w])            => fmtAttribute("bool",  null,    w) %}
namedAttr ->     word _ "=" _ aplhanum              {% ([w,,,,a])       => fmtAttribute("named", w,       a) %}
class     -> "." word                               {% ([,w])           => fmtAttribute("class", null,    w) %}
id        -> "#" word                               {% ([,w])           => fmtAttribute("id",    null,    w) %}


############
# Components
############

comp -> %at word _                        {% ([,w])         => fmtComponent(w, [])                      %}
	  | %at word _ "{" _ (args _):? "}" _ {% ([,w,,,,args]) => fmtComponent(w, args?.[0] || [])         %}
	   
args -> arg (_ "," (_ args):?):?          {% ([arg, args])  => args?.[2] ? [arg, ...args[2][1]] : [arg] %}
	   
arg -> word _ ":" _ aplhanum              {% ([w,,,,a])     => fmtArgument("string", w, a)              %}
	 #| word _ ":" _ comp                 {% ([w,,,,c])     => fmtArgument("comp",   w, c)              %}

#########
# Utility
#########

# Any number of whitespace
_ -> %space:*

# At least one whitespace
__ -> %space:+

# Any number of non line-breaking whitespaces
_n -> %nonBreakingSpace:*

# Empty line
empty -> %nonBreakingSpace:* {% () => fmtTerminal("empty", null) %} 

# Any chars in a single line except "**", "~~", "__" and "``" and others
string -> %string {% ([s]) => fmtTerminal("string", s.value.trim()) %}

# Match alphanumeric
aplhanum -> quoted {% id %} | number {% id %}

# Quoted string, remove first and last quotes
quoted -> %quotedString  {% ([n]) => n.value.substring(1, n.value.length - 1) %}

# Match a word
word -> %word {% ([n]) => n.value %}

# Match a number
number -> %number {% ([n]) => n.value %}