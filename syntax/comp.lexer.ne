@{%

// Component lexer definition
//
// Example:
// @card {
//   name: "Luca",
//   age: 32,
//   content: @pic {
//     url: 'http://asd.com'
//   }
// }

const moo = require("moo");
const lexer = moo.compile({
	// A single whitespace (space, tab or line-break)
	s: {match: /\s/, lineBreaks: true},
	
	// Signed number, float or integer
	num: /[+-]?(?:\d*\.)?\d+/, 

	// A single word containing alphanumerics and "-" but starts with a char
	w: /[a-z]+[\w-]*/, 

	// Single and double quoted string
	str: [
		{match: /"(?:\\.|[^\\])*?"/, lineBreaks: true},
		{match: /'(?:\\.|[^\\])*?'/, lineBreaks: true},
	],
	
	symbols: ["{", "}", "(", ")", ".", ",", ":", "@"]
});

%}

@lexer lexer

comp -> "@" %w                                 {% ([,w])        => ({type: "comp", name: w.value, value: null }) %}
      | "@" %w %s:* "{" %s:* (args %s:*):? "}" {% ([,w,,,,as])  => ({type: "comp", name: w.value, value: as[0] || [] }) %}
	   
args -> arg (%s:* "," (%s:* args):?):?         {% ([arg, args]) => args?.[2] ? [arg, ...args[2][1]] : [arg] %}
	   
arg -> %w %s:* ":" %s:* (str | num)            {% ([w,,,,a])    => ({type: "alphanum-arg", name: w.value, value: a[0]}) %}
     | %w %s:* ":" %s:* comp                   {% ([w,,,,c])    => ({type: "comp-arg", name: w.value, value: c}) %}

str -> %str {% ([n]) => n.value %}
num -> %num {% ([n]) => n.value %}