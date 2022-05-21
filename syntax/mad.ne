@{%

// TODO:
// 1. disambigue attr -> OB lexer to be able to pop lexer stae when }[\s]*) is matched 
// 2. str -> ... w ... the w is wrong it does not accepts spaces, I think I should use a new moo state to disambigue between a word and a string, or is there a easier way?
// 3. Test test test

const moo = require("moo");
const lexer = moo.states({
     elem: {
		at: {match: /^[\s]*@/, push: 'comp'}, // Go to component state
		OB: {match: /^[\s]*{/, push: 'attr'}, // Go to attribute state
		h6: /^[\s]*#{6}/,
		h5: /^[\s]*#{5}/,
		h4: /^[\s]*#{4}/,
		h3: /^[\s]*#{3}/,//
		h2: /^[\s]*#{2}/,
		h1: /^[\s]*#/,
		GT: /^[\s]*>/, // Greater than
		pipe: /^[\s]*\|/,
		strong: "**",
		italic: "__",
		strike: "~~",
		code: "``",
		line: /(?:(?!__|\*\*|~~|``)[^\n\r])+/, // Any chars in a single line except "**", "~~", "__" and "``"
		NL: {match: /[\n\r]/, lineBreaks: true}, // New line
		e: /[^\S\r\n]/, // Empty line
	},
	comp : {
		s: {match: /[\s]/, lineBreaks: true}, // Space
		q: /'|"/, // Quotes
		d: /[\d]+/, // Digits
		OP: "(", // Open parentheses
		CP: {match: /\)[^\S\r\n]*/, pop: 1}, // Close parentheses
		OB: "{", // Open braces
		CB: "}", // Close braces
		colon: ":",
		comma: ",",
		dot: ".",
		w: /[\w-]+/, // Word
	},
	attr: {
		s: {match: /[\s]/, lineBreaks: true}, // Space
		q: /'|"/, // Quotes // this will allow apening and closing with different quotes
		d: /[\d]+/, // Digits
		OB: "{", // Open braces
		CB: {match: /}[^\S\r\n]*/, pop: 1}, // Close braces, go back to elems
		dot: ".",
		hash: "#",
		eq: "=",
		w: /[\w-]+/, // Word
	}
});

// Elements
const fmtText = ([s,t]) => ({type: "text", value: [s[0], ...t?.value || []]}) 
const fmtInline = (type, string) => ({type, value: string.value})
const fmtBlock = (type, string) => ({type, value: string?.value || ""})
	
// Components
const fmtComp = ([,w,,,,,,as]) => ({type: "comp", name: w.value, value: as ? as[0] : [] })
const fmtArgs = ([arg, args]) => args && args[2] ? [arg, ...args[2][1]] : [arg]
const fmtNamedArg = ([w,,,,a]) => ({type: "named-arg", name: w.value, value: a.value})
const fmtContentArg = ([w,,,,,,c]) => ({type: "content-arg", name: w.value, value: c ? c[0] : []})

// Attributes
const fmtAttr = (type, value) => ({type, value})
const fmtNamedAttr = (type, name, value) => ({type, name, value})

%}

@lexer lexer

mad -> exp {% id %} | exp %NL mad {% ([e,,m]) => [e[0], ...m] %}

exp -> h1 | h2 | h3 | h4 | h5 | h6 | p | quote | pre | e | comp | attr

##### Elements

# Blocks elements
h1    -> %h1 text:?   {% ([,t]) => fmtBlock("h1",    t) %}
h2    -> %h2 text:?   {% ([,t]) => fmtBlock("h2",    t) %}
h3    -> %h3 text:?   {% ([,t]) => fmtBlock("h3",    t) %}
h4    -> %h4 text:?   {% ([,t]) => fmtBlock("h4",    t) %}
h5    -> %h5 text:?   {% ([,t]) => fmtBlock("h5",    t) %}
h6    -> %h6 text:?   {% ([,t]) => fmtBlock("h6",    t) %}
quote -> %GT text:?   {% ([,t]) => fmtBlock("blockquote", t) %}
pre   -> %pipe text:? {% ([,t]) => fmtBlock("pre",   t) %}
p     -> text         {% ([t])  => fmtBlock("p",     t) %}

# Inline elements
strong -> %strong nostrong %strong {% ([,s]) => fmtInline("strong", s) %}
italic -> %italic noitalic %italic {% ([,s]) => fmtInline("italic", s) %}
strike -> %strike nostrike %strike {% ([,s]) => fmtInline("strike", s) %}
code   -> %code   nocode   %code   {% ([,s]) => fmtInline("code",   s) %}

# "text" is a single line of text containing all inline blocks. The others are 
# line of texts containing all inline blocks except for themself
text     -> (line | strong | italic | strike | code ) text:?     {% fmtText %} 
nostrong -> (line | italic | strike | code)           nostrong:? {% fmtText %} 
noitalic -> (line | strong | strike | code)           noitalic:? {% fmtText %} 
nostrike -> (line | strong | italic | code)           nostrike:? {% fmtText %} 
nocode   -> (line | strong | italic | strike)         nocode:?   {% fmtText %}

##### Components

comp -> %at w                                                   {% fmtComp       %}
      | %at w %s:* %OP %s:* %OB %s:* (args %s:*):? %CB %s:* %CP {% fmtComp       %}
	   
args -> arg (%s:* %comma (%s:* args):?):?                       {% fmtArgs       %}
	   
arg  -> w %s:* %colon %s:* anum                                 {% fmtNamedArg   %}
      | w %s:* %colon %s:* %OB %s:* (comp %s:*):? %CB           {% fmtContentArg %}

##### Attribues

attr -> %OB %s:* (attrs %s:*):? %CB {% ([,,attrs]) => ({type:"attrs", value: attrs[0] || []}) %}

attrs -> props
       | id    
       | props %s:+ id            {% ([ps,,id])       => [...ps, id]          %}           
       | id %s:+ props            {% ([id,,ps])       => [id, ...ps]          %}
       | props %s:+ id %s:+ props {% ([ps1,,id,,ps2]) => [...ps1, id, ...ps2] %}

props -> (boolAttr | namedAttr | class) (%s:+ props):? {% ([d,ps]) => ps ? [d[0], ...ps[1]] : [d[0]] %}

boolAttr  -> w                    {% ([w])      => fmtAttr("bool-attr", w.value)                %}
namedAttr -> w %s:* %eq %s:* anum {% ([w,,,,a]) => fmtNameAttr("named-attr", w.value, a.value ) %}
class     -> %dot w               {% ([,w])     => fmtAttr("class", w.value)                    %}
id        -> %hash w              {% ([,w])     => fmtAttr("id", w.value)                       %}

##### Utilities

line -> %line                 {% ([s])      => ({type: "line", value: s.value.trim('')})            %}
e    -> %e:?                  {% ()         => ({type: "empty"})                                    %}
w    -> %w                    {% ([w])      => ({type: "word", value: w.value.trim()})              %}
anum -> str                   {% id                                                                 %}
      | num                   {% id                                                                 %}
str  -> %q %s:* (w %s:*):? %q {% ([,,w])    => ({type:"string", value: w ? w[0].value : ''})        %}
num  -> %d (%dot %d):?        {% ([d1, d2]) => ({type:"number", value: [d1, ...d2 || []].join('')}) %}