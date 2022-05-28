# Component syntax definition
# 
# Component let's you use a component and give it some props
#
# Example:
# @card {
#   name: "Luca",
#   age: 32,
#   content: @pic {
#     url: 'http:#asd.com'
#   }
# }

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
  symbols: ["{", "}", "@", ",", ":"],
});
%}

@lexer lexer

comp -> "@" %wrd                                 {% ([,w])        => ([{type: "comp", name: w.value, value: [] }]) %}
      | "@" %wrd %_:* "{" %_:* (args %_:*):? "}" {% ([,w,,,,as])  => ([{type: "comp", name: w.value, value: as?.[0] || [] }]) %}
	   
args -> arg (%_:* "," (%_:* args):?):?           {% ([arg, args]) => args?.[2] ? [arg, ...args[2][1]] : [arg] %}
	   
arg -> %wrd %_:* ":" %_:* (str | num)            {% ([w,,,,a])    => ({type: "alphanum-arg", name: w.value, value: a[0]}) %}
     | %wrd %_:* ":" %_:* comp                   {% ([w,,,,c])    => ({type: "comp-arg", name: w.value, value: c}) %}

str -> %str  {% ([n]) => n.value %}
num -> %num  {% ([n]) => n.value %}