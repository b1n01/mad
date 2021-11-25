#####
# Components
#####

comps -> comp 
       | comp _ comps {% ([c,,cs]) => [c, ...cs] %}

comp -> tag _ ";"                                      {% ([t])                => ({t:"comp",            t})              %}
	  | tag __ attrsBlock _ ";"                      {% ([t,,attrs])         => ({t:"comp-attrs",      t, attrs})       %}
        | tag _ "{" _ args _ "}" _ ";":?               {% ([t,,,,args])        => ({t:"comp-args",       t, args})        %}
	  | tag __ attrsBlock _ "{" _ args _ "}" _ ";":? {% ([t,,attrs,,,,args]) => ({t:"comp-attrs-args", t, attrs, args}) %}

tag -> word "-" word  {% d => d.join('') %}

# Ensure id is set only once
attrsBlock -> attrs                {% id %}
            | id                   {% id %}
            | attrs __ id          {% ([as,,id])       => [...as, id]          %}
            | id __ attrs          {% ([id,,as])       => [id, ...as]          %}
            | attrs __ id __ attrs {% ([as1,,id,,as2]) => [...as1, id, ...as2] %}
			 
attrs -> attr 
	 | attr __ attrs {% ([attr,,attrs]) => [attr, ...attrs] %}
	  
attr -> word                      {% ([v])        => ({t:"boolean-attr", v})    %}
      | word _ "=" _ q _ word _ q {% ([n,,,,,,v]) => ({t:"value-attr",   n, v}) %}
	| "." word                  {% ([,v])       => ({t:"class-attr",   v})    %}
     
id -> "#" word {% ([,v]) => ({t:"id-attribute", v}) %}

args -> arg
      | arg _ "," _ args {% ([arg,,,,args]) => [arg, ...args] %}

arg -> word _ ":" _ alphanum ",":?        {% ([n,,,,v])       => ({t:"value-arg",  n, v})        %}
     | word _ ":" _ "{" textArg "}" ",":? {% ([n,,,,,c])      => ({t:"object-arg", n, c:[c]})    %}
     | word _ ":" _ "{" _ comps "}" ",":? {% ([n,,,,,,comps]) => ({t:"object-arg", n, c: comps}) %}

textArg -> text {% ([value]) => ({type:"text-arg", value}) %}

#####
# Utility
#####

# Any number of space
_ -> [\s]:* {% d => null %}

# At least one space
__ -> [\s]:+ {% d => null %}

# A single quote or a double quote
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