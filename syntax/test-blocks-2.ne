#####
# Functions
#####
@{%
const getBlock = (type, line, block) => { 
	if(block) return {type:type, value: (line + ' ' + block.value).trim()};
	return {type:type, value:line.trim()};
}
%}

@{%
// Get Multi Line Block
const MLB = (type, line, block) => { 
	var string = line.reduce((p,c) => c == ' ' ? p + '\xa0' : p + c , '');
	if(block) return {type:type, value: [string, ...block.value]};
	return {type:type, value: [string]};
}
%}

#####
# Macros
#####

# Line starting with X
# -line starting with "?" => lsw["?"]
# -line starting with somethig different from "#" => lsw[[^#]]
lsw[X] -> $X line {% ([s,line]) => s + line %}

#####
# Blocks
#####

blocks -> block
        | block nl (nl):+ blocks {% ([b,,,bs]) => [b, ...bs] %}

block -> h1    {% id %}
	   | h2    {% id %}
	   | h3    {% id %} 
	   | h4    {% id %}
	   | h5    {% id %}
	   | h6    {% id %}
	   | quote {% id %} 
       | par   {% id %}
	   | code  {% id %}

h1    -> _ "#"      lsw[[^#]]       {% ([,,line]) =>        getBlock("h1", line) %}
       | _ "#"      lsw[[^#]] nl h1 {% ([,,line,,block]) => getBlock("h1", line, block) %}

h2    -> _ "##"     lsw[[^#]]       {% ([,,line]) =>        getBlock("h2", line) %}
       | _ "##"     lsw[[^#]] nl h2 {% ([,,line,,block]) => getBlock("h2", line, block) %}

h3    -> _ "###"    lsw[[^#]]       {% ([,,line]) =>        getBlock("h3", line) %}
       | _ "###"    lsw[[^#]] nl h3 {% ([,,line,,block]) => getBlock("h3", line, block) %}

h4    -> _ "####"   lsw[[^#]]       {% ([,,line]) =>        getBlock("h4", line) %}
       | _ "####"   lsw[[^#]] nl h4 {% ([,,line,,block]) => getBlock("h4", line, block) %}

h5    -> _ "#####"  lsw[[^#]]       {% ([,,line]) =>        getBlock("h5", line) %}
       | _ "#####"  lsw[[^#]] nl h5 {% ([,,line,,block]) => getBlock("h5", line, block) %}

h6    -> _ "######" lsw[[^#]]       {% ([,,line]) =>        getBlock("h6", line) %}
       | _ "######" lsw[[^#]] nl h6 {% ([,,line,,block]) => getBlock("h6", line, block) %}

quote -> _ ">" line                 {% ([,,line]) =>        getBlock("quote", line) %}
       | _ ">" line nl quote        {% ([,,line,,block]) => getBlock("quote", line, block) %}

par   -> _ lsw[[^#!>\n\s]]          {% ([,line]) =>        getBlock("p", line) %}
       | _ lsw[[^#!>\n\s]] nl par   {% ([,line,,block]) => getBlock("p", line, block) %}
	 	
#####
# Multiline blocks
#####

# Code block
code -> _ "!" lineList         {% ([,,line]) =>        MLB('code', line) %}
      | _ "!" lineList nl code {% ([,,line,,block]) => MLB('code', line, block) %}
	  
#####
# Utility
#####

# Any number of space on same line
_ -> [^\S\r\n]:* {% d => null %}

# Match anything in a single sile
line -> [^\n\r]:* {% ([d]) => d.join('') %}

# Like `line` but not merged in a single string
lineList -> [^\n\r]:* {% ([d]) => d %}

# Match a new line
nl -> [\n\r] {% d => null %}