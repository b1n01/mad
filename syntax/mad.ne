#####
# Mad
#####

mad -> elem
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
      | e     {% id %}

h1    -> e "#"     [^#\n\r] line  {% ([,,c,l])    => ({t:'h1',    v:[c, ...l]}) %}
       | e "#"                    {% ()           => ({t:'h1',    v:[]       }) %}
h2    -> e "##"    [^#\n\r] line  {% ([,,c,l])    => ({t:'h2',    v:[c, ...l]}) %}
       | e "##"                   {% ()           => ({t:'h2',    v:[]       }) %}
h3    -> e "###"   [^#\n\r] line  {% ([,,c,l])    => ({t:'h3',    v:[c, ...l]}) %}
       | e "###"                  {% ()           => ({t:'h3',    v:[]       }) %}
h4    -> e "####"  [^#\n\r] line  {% ([,,c,l])    => ({t:'h4',    v:[c, ...l]}) %}
       | e "####"                 {% ()           => ({t:'h4',    v:[]       }) %}
h5    -> e "#####" [^#\n\r] line  {% ([,,c,l])    => ({t:'h5',    v:[c, ...l]}) %}
       | e "#####"                {% ()           => ({t:'h5',    v:[]       }) %}
h6    -> e "######"         line  {% ([,,l])      => ({t:'h6',    v:l        }) %}
p     -> e [^#>`\s:{]       line  {% ([,c,l])     => ({t:'p',     v:[c, ...l]}) %}
quote -> e ">"              line  {% ([,,l])      => ({t:'quote', v:l        }) %}
code  -> e "`"              line  {% ([,,l])      => ({t:'code',  v:l        }) %}
comp  -> e tag                    {% ([,t])       => ({t:"comp",  v:t, a:[]  }) %}
       | e tag _ "{" _ args _ "}" {% ([,t,,,,as]) => ({t:"comp",  v:t, a:as  }) %}
attr  -> e "{" _ attrs _ "}" line {% ([,,,a])     => ({t:'attr',  v:a        }) %}

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
attrs     -> props                {% id                                           %}
           | id                   {% id                                           %}
           | props __ id          {% ([as,,id])       => [...as, id]              %}
           | id __ props          {% ([id,,as])       => [id, ...as]              %}
           | props __ id __ props {% ([as1,,id,,as2]) => [...as1, id, ...as2]     %}
props     -> prop 
           | prop __ props        {% ([attr,,props])  => [attr, ...props]         %}
prop      -> boolAtt              {% id                                           %}               
           | namedAttr            {% id                                           %}
           | class                {% id                                           %}
boolAtt   -> word                 {% ([v])            => ({t:"bool-attr",  v   }) %}
namedAttr -> word _ "=" _ anum    {% ([n,,,,v])       => ({t:"named-attr", n, v}) %}
class     -> "." word             {% ([,v])           => ({t:"class-attr", v   }) %}
id        -> "#" word             {% ([,v])           => ({t:"id-attr",    v   }) %}

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

# Alphanumeric: a string surrounded by quotes or a number
anum -> string {% id %}
      | number {% id %}

# A string surrounded by quotes
string -> q [\w\s.]:* q {% ([,s]) => s.join('') %}

# An integer or a double
number -> [\d]:+            {% ([d]) => d.join('') %}
        | [\d]:+ "." [\d]:+ {% ([d]) => d.join('') %}

# New line char
nl -> [\n\r] {% d => null %}

# Any chars in a single line
line -> [^\n\r]:* {% id %}

# Empty line, any number of space on same line
e -> [^\S\r\n]:* {% () => ({t:"empty"}) %}

# Two words sepataded by a dash
tag -> ":" word "-" word {% ([,w1,d,w2]) => w1 + d + w2 %}