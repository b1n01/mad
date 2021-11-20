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