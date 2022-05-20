@{%
// Attribute lexer definition
//
// Attributes is a special syntax to add html attributes to html elements 
// There are four types of attributes: boolean attributes, named attribues,
// ids and classes
//
// Boolean attribute is an attribute that only require a name:
// # Hello {hidden} -> <h1 hidden>Hello</h1>
//
// Named attribute is an attribue with a name and a value:
// > Hello {cite="hello.ai"} -> <blockquote cite="hello.ai">Hello</blockquote>
// 
// Id is the unique identifier for an HTML element. It uses the special 
// hashtag "#" syntax. Only one id per element can be defined:
// # Hello {#title} -> <h1 id="title">Hello</h1>
//
// Class is used to identify the class of an HTML element. It uses the special 
// dot "." syntax:
// # Hello {.title .big} -> <h1 class="title big">Hello</h1>

const moo = require("moo");
const lexer = moo.compile({
	// A single whitespace (space, tab or line-break)
	s: {match: /\s/, lineBreaks: true},
	
	// Signed number (float or integer)
	num: /[+-]?(?:\d*\.)?\d+/, 

	// A single word containing alphanumerics and "-" but starts with a char
	w: /[a-z]+[\w-]*/, 

	// Single and double quoted string
	str: [
		{match: /"(?:\\.|[^\\])*?"/, lineBreaks: true},
		{match: /'(?:\\.|[^\\])*?'/, lineBreaks: true},
	],
	symbols: ["{", "}", ".", "#", "="]
});
%}

@lexer lexer
	  
attr -> "{" %s:* (attrs %s:*):? "}" {% ([,,attrs]) => ({type: "attrs", value: attrs[0] || []}) %}

attrs -> props                    {% ([ps])           => [...ps]              %}    
       | id                       {% ([id])           => [id]                 %}  
       | props %s:+ id            {% ([ps,,id])       => [...ps, id]          %}           
       | id %s:+ props            {% ([id,,ps])       => [id, ...ps]          %}
       | props %s:+ id %s:+ props {% ([ps1,,id,,ps2]) => [...ps1, id, ...ps2] %}

props -> (boolAtt | namedAttr | class) (%s:+ props):? {% ([d, ps]) => ps ? [d[0], ...ps[1]] : [d[0]] %}

boolAtt   -> %w                           {% ([d])      => ({type:"bool-attr",  value: d.value})             %}
namedAttr -> %w %s:* "=" %s:* (str | num) {% ([n,,,,d]) => ({type:"named-attr", name: n.value, value: d[0]}) %}
class     -> "." %w                       {% ([,d])     => ({type:"class",      value: d.value})             %}
id        -> "#" %w                       {% ([,d])     => ({type:"id",         value: d.value})             %}

str -> %str {% ([n]) => n.value %}
num -> %num {% ([n]) => n.value %}