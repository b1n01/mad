# Attributes syntax definition
#
# Attributes let's you add html attributes to html elements.
# There are four types of attributes: boolean attributes, named attribues,
# ids and classes.
#
# Boolean attributes only require a value:
# # Hello {hidden} -> <h1 hidden>Hello</h1>
#
# Named attributes requires a name and a value:
# > Hello {cite="hello.html"} -> <blockquote cite="hello.html">Hello</blockquote>
#
# Ids are unique identifier for HTML elements. They use the special 
# hashtag "#" syntax. Only one id per element can be defined:
# # Hello {#title} -> <h1 id="title">Hello</h1>
#
# Class is used to identify the class of an HTML element. It uses the special 
# dot "." syntax:
# # Hello {.title .big} -> <h1 class="title big">Hello</h1>

@{%
const moo = require("moo");
const lexer = moo.compile({
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
});
%}

@lexer lexer	  
         
attr -> "{" %_:* (attrs %_:*):? "}"                   {% ([,,attrs])      => attrs[0] || [] %}

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

str -> %str  {% ([n]) => n.value %}
num -> %num  {% ([n]) => n.value %}