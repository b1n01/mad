partials -> partial                 
		 | partial _ partials       {% ([p,,ps]) => ([p, ...ps]) %}
		 
partial -> withArgs                 {% ([d]) => ({t:"partial", d:d}) %}
		 | noArgs                   {% ([d]) => ({t:"partial", d:d}) %}

withArgs -> tag ws args _ terminal  {% ([tag,,args,,ter]) => ({t:'withArgs', d: {tag, args, ter}}) %}

noArgs -> tag _ terminal            {% ([tag,,ter]) => ({t:'noArgs', d:{tag, ter}}) %}

tag -> word "-" word      		    {% ([w1,,w2]) => w1 + '-' + w2 %}

args -> arg 
      | arg ws args                 {% ([a,,as]) => ([a, ...as]) %}

arg -> argName _ "=" _ q argValue q {% ([n,,,,,v]) => ({name:n, value:v}) %}

argName -> word                     {% id %}

argValue -> [\w\s]:*                {% ([d]) => d.join('') %}

terminal -> ";"                     {% d => ({t:'semicolon'}) %}
		  | content                 {% id %}

content -> "{" text "}"             {% ([,t]) => ({t:'content', d:t}) %}
		 | "{" _ partials _ "}"     {% ([,,p]) => p %}

text -> [\w\s]:*                    {% ([d]) => d.join('') %}

# Utility
word -> [\w]:+                      {% ([d]) => d.join('') %}
_ -> [\s]:*                         {% d => null %}
ws -> [\s]:+                        {% d => null %}
q -> "'" | "\""                     {% d => null %}
# nl -> "\n"                          {% d => ({t:'newline'}) %}