blocks -> block
        | block nl blocks {% ([b,nl,bs]) => [b, ...bs] %}

block -> p  {% id %}
       | h1 {% id %}
	   | h2 {% id %}
	   | h3 {% id %}
	   | h4 {% id %}
	   | h5 {% id %}
	   | h6 {% id %}
	   | q  {% id %}
	   | c  {% id %}

h1 -> cr:* el "#"     [^#] it  {% ([e,s,,f,l]) => ({t:'h1', s:e.length, v:f + l}) %}
h2 -> cr:* el "##"    [^#] it  {% ([e,s,,f,l]) => ({t:'h2', s:e.length, v:f + l}) %}
h3 -> cr:* el "###"   [^#] it  {% ([e,s,,f,l]) => ({t:'h3', s:e.length, v:f + l}) %}
h4 -> cr:* el "####"  [^#] it  {% ([e,s,,f,l]) => ({t:'h4', s:e.length, v:f + l}) %}
h5 -> cr:* el "#####" [^#] it  {% ([e,s,,f,l]) => ({t:'h5', s:e.length, v:f + l}) %}
h6 -> cr:* el "######"     it  {% ([e,s,,l])   => ({t:'h6', s:e.length, v:l}) %}
p  -> cr:* el [^#>!\s]     it  {% ([e,s,f,l])  => ({t:'p',  s:e.length, v:f + l}) %}
q  -> cr:* el ">"          it  {% ([e,s,,l])   => ({t:'q',  s:e.length, v:l}) %}
c  -> cr:* el "!"          its {% ([e,s,,l])   => ({t:'c',  s:e.length, v:l.join('\xa0')}) %}


# Carriage return, an empty line followed by a new-line char
cr  -> el nl {% d => null %}

# New line char
nl -> [\n\r] {% d => null %}

# Inline text, any chars in a single line
it -> [^\n\r]:* {% ([t]) => t.join('') %}

# Inline text splitted, as "it" but returns an array
its -> [^\n\r]:* {% ([t]) => t %}

# Empty line, any number of space on same line
el -> [^\S\r\n]:* {% d => null %}
