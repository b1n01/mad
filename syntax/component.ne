#####
# Functions
#####
@{%
const getBlock = (type, line, heading) => { 
	if(heading) return {type:type, value: (line + ' ' + heading.value).trim()};
	return {type:type, value:line.trim()};
}
%}

#####
# Macros
#####

# Line starting with X
# -line startin with "?" => lsw["?"]
# -line startin with somethig different from "#" => lsw[[^#]]
lsw[X] -> $X line {% ([s,line]) => s + line %}

#####
# Blocks
#####

blocks -> block | block nl nl blocks {% ([b,,,bs]) => [b, ...bs]%}
block -> h1      {% id %}
	   | h2    {% id %}
	   | h3    {% id %} 
	   | h4    {% id %}
	   | h5    {% id %}
	   | h6    {% id %}
         | code  {% id %} 
	   | para  {% id %} 
         | quote {% id %} 

# H1
h1 -> "#" lsw[[^#]]                {% ([,line]) =>        getBlock("h1", line) %}
    | "#" lsw[[^#]] nl h1          {% ([,line,,block]) => getBlock("h1", line, block) %}

# H2
h2 -> "##" lsw[[^##]]              {% ([,line]) =>        getBlock("h2", line) %}
    | "##" lsw[[^##]] nl h2        {% ([,line,,block]) => getBlock("h2", line, block) %}

# H3
h3 -> "###" lsw[[^###]]            {% ([,line]) =>        getBlock("h3", line) %}
    | "###" lsw[[^###]] nl h3      {% ([,line,,block]) => getBlock("h3", line, block) %}

# H4
h4 -> "####" lsw[[^####]]          {% ([,line]) =>        getBlock("h4", line) %}
    | "####" lsw[[^####]] nl h4    {% ([,line,,block]) => getBlock("h4", line, block) %}

# H5
h5 -> "#####" lsw[[^####]]         {% ([,line]) =>        getBlock("h5", line) %}
    | "#####" lsw[[^####]] nl h5   {% ([,line,,block]) => getBlock("h5", line, block) %}

# H6
h6 -> "######" lsw[[^#####]]       {% ([,line]) =>        getBlock("h6", line) %}
    | "######" lsw[[^#####]] nl h6 {% ([,line,,block]) => getBlock("h6", line, block) %}

# Code block
code -> "`" line                    {% ([,line]) =>        getBlock("code", line) %}
      | "`" line nl code            {% ([,line,,block]) => getBlock("code", line, block) %}
	  
# Blockquote
quote -> ">" line                   {% ([,line]) =>        getBlock("quote", line) %}
       | ">" line nl quote          {% ([,line,,block]) => getBlock("quote", line, block) %}

# Paragraph
para -> lsw[[^#`\n>]]               {% ([line]) =>        getBlock("p", line) %}
      | lsw[[^#`\n>]] nl para       {% ([line,,block]) => getBlock("p", line, block) %}

#####
# Components
#####

components -> component 
            | component _ components {% ([c,,cs]) => [c, ...cs] %}

component -> tag _ ";" {% ([tag]) => ({type:"empty-component", tag}) %}
		   | tag __ attrsBlock _ ";" {% ([tag,,attrs]) => ({type:"component-with-attrs", tag, attrs}) %}
		   | tag _ "{" _ args _ "}" _ ";":? {% ([tag,,,,args]) => ({type:"component-with-args", tag, args}) %}
		   | tag __ attrsBlock _ "{" _ args _ "}" _ ";":? {% ([tag,,attrs,,,,args]) => ({type:"component-with-attrs-and-args", tag, attrs, args}) %}

tag -> word "-" word  {% d => d.join('') %}

# Ensure id is set only once
attrsBlock -> attrs {% id %}
             | id {% id %}
             | attrs __ id {% ([attrs,,id]) => [...attrs, id] %}
			 | id __ attrs {% ([id,,attrs]) => [id, ...attrs] %}
			 | attrs __ id __ attrs {% ([attrs1,,id,,attrs2]) => [...attrs1, id, ...attrs2] %}
			 
attrs -> attr 
	   | attr __ attrs {% ([attr,,attrs]) => [attr, ...attrs] %}
	  
attr -> word {% ([value]) => ({type:"boolean-attribute", value}) %}
      | word _ "=" _ q _ word _ q {% ([name,,,,,,value]) => ({type:"value-attribute", name, value}) %}
	  | "." word {% ([,value]) => ({type:"class-attribute", value}) %}
     
id -> "#" word {% ([,value]) => ({type:"id-attribute", value}) %}

args -> arg
      | arg _ "," _ args {% ([arg,,,,args]) => [arg, ...args] %}

arg -> word _ ":" _ alphanum ",":? {% ([name,,,,value]) => ({type:"value-argument", name, value}) %}
     | word _ ":" _ "{" textArg "}" ",":? {% ([name,,,,,content]) => ({type:"object-argument", name, content:[content]}) %}
	 | word _ ":" _ "{" _ components "}" ",":? {% ([name,,,,,,components]) => ({type:"object-argument", name, content: components}) %}

textArg -> text {% ([value]) => ({type:"text-argument", value}) %}

#####
# Utility
#####

_ -> [\s]:* {% d => null %}
__ -> [\s]:+ {% d => null %}
q -> "'" | "\"" {% d => null %}

# A single word with no special character
word -> [\w-]:+ {% ([d]) => d.join('') %}

# Some generic text with whitespaces
text -> [\s\w.\\#-]:+ {% ([d]) => d.join('') %}

# A string surrounded by quotes or a number
alphanum -> string {% id %}
          | number {% id %}

# A string surrounded by quotes
string -> q [\w\s.]:* q {% ([,s]) => s.join('') %}

# An integer or a double
number -> [\d]:+ {% ([d]) => d.join('') %}
        | [\d]:+ "." [\d]:+ {% ([d]) => d.join('') %}

# Match anything in a single sile
line -> [^\n\r]:* {% ([d]) => d.join('') %}

# Match a new line
nl -> [\n\r] {% d => null %}