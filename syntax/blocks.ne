@{%
    const join = line => line.join('').trim()
	const raw  = line => line.reduce((prev, curr) => curr == ' ' ? prev + '\xa0' : prev + curr ,'')
%}

mad -> _ {% d => [] %}
     | blocks (nl empty):* {% id %}

blocks -> block
        | block nl blocks {% ([b,nl,bs]) => [b, ...bs] %}

block -> h1    {% id %}
	   | h2    {% id %}
	   | h3    {% id %}
	   | h4    {% id %}	
	   | h5    {% id %}
	   | h6    {% id %}
	   | p     {% id %}
	   | quote {% id %}
	   | code  {% id %}

h1    -> crs empty "#"     [^#] line {% ([crs,,,c,l]) => ({t:'h1',    s:crs.length, v:c + join(l) }) %}
       | crs empty "#"               {% ([crs])       => ({t:'h1',    s:crs.length, v:''          }) %}
h2    -> crs empty "##"    [^#] line {% ([crs,,,c,l]) => ({t:'h2',    s:crs.length, v:c + join(l) }) %}
       | crs empty "##"              {% ([crs])       => ({t:'h2',    s:crs.length, v:''          }) %}
h3    -> crs empty "###"   [^#] line {% ([crs,,,c,l]) => ({t:'h3',    s:crs.length, v:c + join(l) }) %}
       | crs empty "###"             {% ([crs])       => ({t:'h3',    s:crs.length, v:''          }) %}
h4    -> crs empty "####"  [^#] line {% ([crs,,,c,l]) => ({t:'h4',    s:crs.length, v:c + join(l) }) %}
       | crs empty "####"            {% ([crs])       => ({t:'h4',    s:crs.length, v:''          }) %}
h5    -> crs empty "#####" [^#] line {% ([crs,,,c,l]) => ({t:'h5',    s:crs.length, v:c + join(l) }) %}
       | crs empty "####"            {% ([crs])       => ({t:'h5',    s:crs.length, v:''          }) %}
h6    -> crs empty "######"     line {% ([crs,,,l])   => ({t:'h6',    s:crs.length, v:join(l)     }) %}
p     -> crs empty [^#>`\s]     line {% ([crs,,c,l])  => ({t:'p',     s:crs.length, v:c + join(l) }) %}
quote -> crs empty ">"          line {% ([crs,,,l])   => ({t:'quote', s:crs.length, v:join(l)     }) %}
code  -> crs empty "`"          line {% ([crs,,,l])   => ({t:'code',  s:crs.length, v:raw(l)      }) %}


# Carriage return: an empty line followed by a new-line char
crs -> (empty nl):* {% id %}

# New line char
nl -> [\n\r] {% d => null %}

# Any chars in a single line
line -> [^\n\r]:* {% id %}

# Empty line, any number of space on same line
empty -> [^\S\r\n]:* {% d => null %}

# Any number of space
_ -> [\s]:* {% d => null %}
