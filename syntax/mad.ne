#####
# Mad
#####

mad -> _                  {% d => []     %}
     | blockStart (nl):*  {% id          %}
	 | _ compStart _      {% ([,d]) => d %}
	 
blockStart -> block nl blockStart          {% ([b,,b1]) => [b, ...b1] %}
            | block (nl empty):+ compStart {% ([b,,b1]) => [b, ...b1] %}
			| block
	 
compStart -> comp (nl empty):* compStart   {% ([b,,b1]) => [b, ...b1] %}
           | comp nl blockStart            {% ([b,,b1]) => [b, ...b1] %}
		   | comp                       

#####
# Components
#####

comp -> tag _ ";"                                      {% ([tag])                => ({t:"comp",            tag})              %}
	  | tag __ attrsBlock _ ";"                        {% ([tag,,attrs])         => ({t:"comp-attrs",      tag, attrs})       %}
      | tag _ "{" _ args _ "}" (_ ";"):?               {% ([tag,,,,args])        => ({t:"comp-args",       tag, args})        %}
	  | tag __ attrsBlock _ "{" _ args _ "}" (_ ";"):? {% ([tag,,attrs,,,,args]) => ({t:"comp-attrs-args", tag, attrs, args}) %}

tag -> ":" word "-" word  {% ([,w1,,w2]) => w1 + '-' + w2 %}

# Ensure id is set only once
attrsBlock -> attrs                {% id %}
            | id                   {% id %}
            | attrs __ id          {% ([as,,id])       => [...as, id]          %}
			| id __ attrs          {% ([id,,as])       => [id, ...as]          %}
			| attrs __ id __ attrs {% ([as1,,id,,as2]) => [...as1, id, ...as2] %}
			 
attrs -> attr 
	   | attr __ attrs {% ([attr,,attrs]) => [attr, ...attrs] %}
	  
attr -> word                {% ([v])     => ({t:"boolean-attr", v})    %}
      | word _ "=" alphanum {% ([n,,,v]) => ({t:"value-attr",   n, v}) %}
	  | "." word            {% ([,v])    => ({t:"class-attr",   v})    %}
     
id -> "#" word {% ([,v]) => ({t:"id-attribute", v}) %}

args -> arg _ ",":?      {% ([arg]) => [arg] %}
      | arg _ "," _ args {% ([arg,,,,args]) => [arg, ...args] %}

arg -> word _ ":" _ alphanum    {% ([n,,,,v])       => ({t:"value-arg",  n, v})    %}
	 | word _ ":" _ "{" mad "}" {% ([n,,,,,comps]) => ({t:"mad-arg", n, c: comps}) %}

#####
# Blocks
#####

@{%
    const join = line => line.join('').trim()
	const raw  = line => line.reduce((prev, curr) => curr == ' ' ? prev + '\xa0' : prev + curr ,'')
%}

block -> h1    {% id %}
	   | h2    {% id %}
	   | h3    {% id %}
	   | h4    {% id %}	
	   | h5    {% id %}
	   | h6    {% id %}
	   | p     {% id %}
	   | quote {% id %}
	   | code  {% id %}

h1    -> crs empty "#"     [^#\n\r] line {% ([crs,,,c,l]) => ({t:'h1',    s:crs.length, v:c.trim('') + join(l)}) %}
       | crs empty "#"                   {% ([crs])       => ({t:'h1',    s:crs.length, v:''         })          %}
h2    -> crs empty "##"    [^#\n\r] line {% ([crs,,,c,l]) => ({t:'h2',    s:crs.length, v:c.trim('') + join(l)}) %}
       | crs empty "##"                  {% ([crs])       => ({t:'h2',    s:crs.length, v:''          })         %}
h3    -> crs empty "###"   [^#\n\r] line {% ([crs,,,c,l]) => ({t:'h3',    s:crs.length, v:c.trim('') + join(l)}) %}
       | crs empty "###"                 {% ([crs])       => ({t:'h3',    s:crs.length, v:''          })         %}
h4    -> crs empty "####"  [^#\n\r] line {% ([crs,,,c,l]) => ({t:'h4',    s:crs.length, v:c.trim('') + join(l)}) %}
       | crs empty "####"                {% ([crs])       => ({t:'h4',    s:crs.length, v:''          })         %}
h5    -> crs empty "#####" [^#\n\r] line {% ([crs,,,c,l]) => ({t:'h5',    s:crs.length, v:c.trim('') + join(l)}) %}
       | crs empty "####"                {% ([crs])       => ({t:'h5',    s:crs.length, v:''          })         %}
h6    -> crs empty "######"         line {% ([crs,,,l])   => ({t:'h6',    s:crs.length, v:join(l)     })         %}
p     -> crs empty [^#>`\s:]        line {% ([crs,,c,l])  => ({t:'p',     s:crs.length, v:c.trim('') + join(l)}) %}
quote -> crs empty ">"              line {% ([crs,,,l])   => ({t:'quote', s:crs.length, v:join(l)     })         %}
code  -> crs empty "`"              line {% ([crs,,,l])   => ({t:'code',  s:crs.length, v:raw(l)      })         %}

#####
# Utility
#####

# Any number of space
_ -> [\s]:* {% d => null %}

# At least one space
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

# Carriage return: an empty line followed by a new-line char
crs -> (empty nl):* {% id %}

# New line char
nl -> [\n\r] {% d => null %}

# Any chars in a single line
line -> [^\n\r]:* {% id %}

# Empty line, any number of space on same line
empty -> [^\S\r\n]:* {% d => null %}