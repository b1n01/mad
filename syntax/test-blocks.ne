#####
# Functions
#####
@{%
const format = (b, bs) => { 
	let r1 = {t:b.t, v:b.v + ' ' + bs[0].v}; 
	return bs.length == 2 ? [r1, bs[1]] : [r1];
}
%}

exp -> (blocks "\n":+):* {% ([d]) => d %} 

blocks -> block {% ([d]) => ({t:"blocks", v:d.flat()}) %} 

block -> h1s {% ([d]) => d.flat() %} 
       | h2s {% ([d]) => d.flat() %} 
	   | ps  {% ([d]) => d.flat() %} 

h1s -> h1          {% ([b])       => [{t:'h1', v:b.v}] %} 
     | h1 nl h1s   {% ([b,,bs])   => format(b, bs) %} 
	 | h1 nl nonH1 {% ([b,,nonB]) => [{t:'h1', v:b.v}, ...nonB] %} 
	 #| h1 nl       {% ([b])       => [{t:'h1', v:b.v}] %} 

h2s -> h2          {% ([b])       => [{t:'h2', v:b.v}] %} 
     | h2 nl h2s   {% ([b,,bs])   => format(b, bs) %} 
	 | h2 nl nonH2 {% ([b,,nonB]) => [{t:'h2', v:b.v}, ...nonB] %} 
	 #| h2 nl       {% ([b])       => [{t:'h2', v:b.v}] %} 
	 
ps  -> p           {% ([b])       => [{t:'p',  v:b.v}] %} 
     | p nl ps     {% ([b,,bs])   => format(b, bs) %} 
	 | p nl nonP   {% ([b,,nonB]) => [{t:'p',  v:b.v}, ...nonB] %} 
	 #| p nl        {% ([b])       => [{t:'p',  v:b.v}] %} 

nonH1 -> h2s {% id %}
       | ps  {% id %}
	   
nonH2 -> h1s {% id %}
       | ps  {% id %}

nonP ->  h1s {% id %}
       | h2s {% id %}

h1 -> "1" line {% ([,line]) => ({t: "h1", v:line.join('')}) %}
h2 -> "2" line {% ([,line]) => ({t: "h2", v:line.join('')}) %}
p  -> "p" line {% ([,line]) => ({t: "p", v:line.join('')}) %}

word -> [\w-]:+ {% id %}
line -> [^\n\r]:* {% id %}
nl -> [\n\r]
#ws -> [^\S\r\n]:* {% d => null %}
#_ -> [\s]:+ {% d => null %}
_ -> [ \t]:+ {% function(d) { return null; } %}

