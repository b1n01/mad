partial -> tag ws args _ terminal {% function(d) {return {t:'partial', d:d}} %}

tag -> [\w]:+ "-" [\w-]:+ {% function(d) {return {t:'tag', v:d[0].join('')}} %}

#argBlock -> _ | id | args | id ws args | args ws id | args ws id ws args {% function(d) {return {t:'argBlock', d:d }} %}

#args -> arg | arg ws args {% function(d) {return {t:'args', d:d }} %}

#arg -> class | param {% function(d) {return {t:'arg', d:d}} %}

#class -> "." [\w-]:+ {% function(d) {return {t:'class', v:d[1].join('') }} %}

#id -> "#" [\w]:+ {% function(d) {return {t:'id', v:d[1].join('') }} %}

args -> arg | arg ws args {% function(d) {return {t:'args', d:d}} %}

arg -> argName _ "=" _ quote argValue quote {% function(d) {return {t:'arg', d:d}} %}

argName -> [\w]:* {% function(d) {return {t:'argName', v:d[0].join('')}} %}

argValue -> [\w\s]:* {% function(d) {return {t:'argValue', v:d[0].join('')}} %}

terminal -> ";" | "{" content "}"

content -> [\w\s]:* {% function(d) {return {t:'content', v:d[0].join('')}} %}


_ -> [\s]:* {% function(d) {return null } %}
ws -> [\s]:+ {% function(d) {return null } %}
quote -> "'" | "\"" {% function(d) {return {t:'quote'}} %}