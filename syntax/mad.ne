@{%
const join = line => line.join('').trim()
const raw  = line => line.reduce((prev, curr) => curr == ' ' ? prev + ' ' : prev + curr ,'')
%}

#####
# Mad
#####

mad -> _           {% d => []               %}
     | elem
     | elem nl mad {% ([e,,m]) => [e, ...m] %}

#####
# Elements
#####

elem -> h1    {% id %}
      | h2    {% id %}
      | h3    {% id %}
      | h4    {% id %}	
      | h5    {% id %}
      | h6    {% id %}
      | p     {% id %}
      | quote {% id %}
      | code  {% id %}
      | comp  {% id %}
      | attr  {% id %}

h1    -> crs e "#"     [^#\n\r] line  {% ([crs,,,c,l])    => ({t:'h1',    s:crs.length, v:c.trim('') + join(l)}) %}
       | crs e "#"                    {% ([crs])          => ({t:'h1',    s:crs.length, v:''                  }) %}
h2    -> crs e "##"    [^#\n\r] line  {% ([crs,,,c,l])    => ({t:'h2',    s:crs.length, v:c.trim('') + join(l)}) %}
       | crs e "##"                   {% ([crs])          => ({t:'h2',    s:crs.length, v:''                  }) %}
h3    -> crs e "###"   [^#\n\r] line  {% ([crs,,,c,l])    => ({t:'h3',    s:crs.length, v:c.trim('') + join(l)}) %}
       | crs e "###"                  {% ([crs])          => ({t:'h3',    s:crs.length, v:''                  }) %}
h4    -> crs e "####"  [^#\n\r] line  {% ([crs,,,c,l])    => ({t:'h4',    s:crs.length, v:c.trim('') + join(l)}) %}
       | crs e "####"                 {% ([crs])          => ({t:'h4',    s:crs.length, v:''                  }) %}
h5    -> crs e "#####" [^#\n\r] line  {% ([crs,,,c,l])    => ({t:'h5',    s:crs.length, v:c.trim('') + join(l)}) %}
       | crs e "#####"                {% ([crs])          => ({t:'h5',    s:crs.length, v:''                  }) %}
h6    -> crs e "######"         line  {% ([crs,,,l])      => ({t:'h6',    s:crs.length, v:join(l)             }) %}
p     -> crs e [^#>`\s:{]       line  {% ([crs,,c,l])     => ({t:'p',     s:crs.length, v:c.trim('') + join(l)}) %}
quote -> crs e ">"              line  {% ([crs,,,l])      => ({t:'quote', s:crs.length, v:join(l)             }) %}
code  -> crs e "`"              line  {% ([crs,,,l])      => ({t:'code',  s:crs.length, v:raw(l)              }) %}
comp  -> crs e tag                    {% ([crs,,t])       => ({t:"comp",  s:crs.length, v:t, a:[]             }) %}
       | crs e tag _ "{" _ args _ "}" {% ([crs,,t,,,,as]) => ({t:"comp",  s:crs.length, v:t, a:as             }) %}
attr  -> crs e "{" _ attrs _ "}" line {% ([crs,,,,as])    => ({t:'attr',  s:crs.length, v:as                  }) %}

#####
# Arguments
#####

args -> arg _ ",":?              {% ([arg])         => [arg]                     %}
      | arg _ "," _ args         {% ([arg,,,,args]) => [arg, ...args]            %}

arg  -> word _ ":" _ anum        {% ([n,,,,v])      => ({t:"named-arg",   n, v}) %}
      | word _ ":" _ "{" mad "}" {% ([n,,,,,c])     => ({t:"content-arg", n, c}) %}

#####
# Attributes
#####

# Ensure id is set only once
attrs -> props                 {% id                                            %}
       | id                    {% id                                            %}
       | props __ id           {% ([as,,id])       => [...as, id]               %}
       | id __ props           {% ([id,,as])       => [id, ...as]               %}
       | props __ id __ props  {% ([as1,,id,,as2]) => [...as1, id, ...as2]      %}
             
props -> prop 
       | prop __ props         {% ([attr,,props])   => [attr, ...props]         %}
      
prop  -> boolAtt               {% id                                            %}               
       | namedAttr             {% id                                            %}
       | class                 {% id                                            %}

boolAtt   -> word              {% ([v])             => ({t:"bool-attr",  v   }) %}
namedAttr -> word _ "=" _ anum {% ([n,,,,v])        => ({t:"named-attr", n, v}) %}
class     -> "." word          {% ([,v])            => ({t:"class-attr", v   }) %}
id        -> "#" word          {% ([,v])            => ({t:"id-attr",    v   }) %}

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

# Alphanumeric: a string surrounded by quotes or a number
anum -> string {% id %}
      | number {% id %}

# A string surrounded by quotes
string -> q [\w\s.]:* q {% ([,s]) => s.join('') %}

# An integer or a double
number -> [\d]:+            {% ([d]) => d.join('') %}
        | [\d]:+ "." [\d]:+ {% ([d]) => d.join('') %}

# Carriage return: an empty line followed by a new-line char
crs -> (e nl):* {% id %}

# New line char
nl -> [\n\r] {% d => null %}

# Any chars in a single line
line -> [^\n\r]:* {% id %}

# Empty line, any number of space on same line
e -> [^\S\r\n]:* {% d => null %}

# Two words sepataded by a dash
tag -> ":" word "-" word {% ([,w1,d,w2]) => w1 + d + w2 %}