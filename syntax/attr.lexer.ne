
@{%
const moo = require("moo");
const lexer = moo.compile({
	s: {match: /[\s]/, lineBreaks: true},
	digit: /[\d]+/,
	"{":"{",
	"}": "}",
	".": ".",
	"#": "#",
	"=": "=",
	word: /[\w]+/,
	q: /'|"/, // this will allow apening and closing with different quotes
	e: /[^\S\r\n]+/,
});
%}

@lexer lexer
	  
attr -> "{" %s:* (attrs %s:*):? "}" {% ([,,attrs]) => ({type:"attrs", value: attrs[0] || []}) %}

attrs -> props
       | id    
       | props %s:+ id            {% ([ps,,id])       => [...ps, id]          %}           
       | id %s:+ props            {% ([id,,ps])       => [id, ...ps]          %}
       | props %s:+ id %s:+ props {% ([ps1,,id,,ps2]) => [...ps1, id, ...ps2] %}

props -> (boolAtt | namedAttr | class) (%s:+ props):? {% ([d,ps]) => ps ? [d[0], ...ps[1]] : [d[0]] %}

boolAtt   -> %word                                 {% ([d])      => ({type:"bool-attr",  value: d.value}) %}
namedAttr -> %word %s:* "=" %s:* (string | number) {% ([n,,,,d]) => ({type:"named-attr", value: d[0]})     %}
class     -> "." %word                             {% ([,d])     => ({type:"class",      value: d.value}) %}
id        -> "#" %word                             {% ([,d])     => ({type:"id",         value: d.value}) %}

string -> %q %s:* %word:? %s:* %q {% ([,,w])    => w?.value || ''             %}
number -> %digit ("." %digit):?   {% ([d1, d2]) => [d1, ...d2 || []].join('') %}