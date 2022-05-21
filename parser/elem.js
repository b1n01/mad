// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

const moo = require("moo");
const lexer = moo.compile({
  // Elements lexer
  h6: /^[\s]*#{6}/,
	h5: /^[\s]*#{5}/,
	h4: /^[\s]*#{4}/,
	h3: /^[\s]*#{3}/,
	h2: /^[\s]*#{2}/,
	h1: /^[\s]*#/,
	GT: /^[\s]*>/,
	pipe: /^[\s]*\|/,
	strong: "**",
	italic: "__",
	strike: "~~",
	code: "``",
	string: /(?:(?!__|\*\*|~~|``)[^\n\r])+/,
	NL: {match: /[\n\r]/, lineBreaks: true},
	empty: /[^\S\r\n]/,
});

const fmtText = ([s,t]) => ({type: "text", value: [s[0], ...t?.value || []]}) 
const fmtInline = (type, string) => ({type:type, value: string.value})
const fmtBlock = (type, string) => ({type: type, value: string?.value || ""})
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "mad", "symbols": ["expr"], "postprocess": id},
    {"name": "mad", "symbols": ["expr", (lexer.has("NL") ? {type: "NL"} : NL), "mad"], "postprocess": ([e,,m]) => [e[0], ...m]},
    {"name": "expr", "symbols": ["h1"]},
    {"name": "expr", "symbols": ["h2"]},
    {"name": "expr", "symbols": ["h3"]},
    {"name": "expr", "symbols": ["h4"]},
    {"name": "expr", "symbols": ["h5"]},
    {"name": "expr", "symbols": ["h6"]},
    {"name": "expr", "symbols": ["p"]},
    {"name": "expr", "symbols": ["blockquote"]},
    {"name": "expr", "symbols": ["pre"]},
    {"name": "expr", "symbols": ["e"]},
    {"name": "h1$ebnf$1", "symbols": ["text"], "postprocess": id},
    {"name": "h1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "h1", "symbols": [(lexer.has("h1") ? {type: "h1"} : h1), "h1$ebnf$1"], "postprocess": ([,t]) => fmtBlock("h1",         t)},
    {"name": "h2$ebnf$1", "symbols": ["text"], "postprocess": id},
    {"name": "h2$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "h2", "symbols": [(lexer.has("h2") ? {type: "h2"} : h2), "h2$ebnf$1"], "postprocess": ([,t]) => fmtBlock("h2",         t)},
    {"name": "h3$ebnf$1", "symbols": ["text"], "postprocess": id},
    {"name": "h3$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "h3", "symbols": [(lexer.has("h3") ? {type: "h3"} : h3), "h3$ebnf$1"], "postprocess": ([,t]) => fmtBlock("h3",         t)},
    {"name": "h4$ebnf$1", "symbols": ["text"], "postprocess": id},
    {"name": "h4$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "h4", "symbols": [(lexer.has("h4") ? {type: "h4"} : h4), "h4$ebnf$1"], "postprocess": ([,t]) => fmtBlock("h4",         t)},
    {"name": "h5$ebnf$1", "symbols": ["text"], "postprocess": id},
    {"name": "h5$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "h5", "symbols": [(lexer.has("h5") ? {type: "h5"} : h5), "h5$ebnf$1"], "postprocess": ([,t]) => fmtBlock("h5",         t)},
    {"name": "h6$ebnf$1", "symbols": ["text"], "postprocess": id},
    {"name": "h6$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "h6", "symbols": [(lexer.has("h6") ? {type: "h6"} : h6), "h6$ebnf$1"], "postprocess": ([,t]) => fmtBlock("h6",         t)},
    {"name": "blockquote$ebnf$1", "symbols": ["text"], "postprocess": id},
    {"name": "blockquote$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "blockquote", "symbols": [(lexer.has("GT") ? {type: "GT"} : GT), "blockquote$ebnf$1"], "postprocess": ([,t]) => fmtBlock("blockquote", t)},
    {"name": "pre$ebnf$1", "symbols": ["text"], "postprocess": id},
    {"name": "pre$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "pre", "symbols": [(lexer.has("pipe") ? {type: "pipe"} : pipe), "pre$ebnf$1"], "postprocess": ([,t]) => fmtBlock("pre",        t)},
    {"name": "p", "symbols": ["text"], "postprocess": ([t])  => fmtBlock("p",          t)},
    {"name": "strong", "symbols": [(lexer.has("strong") ? {type: "strong"} : strong), "nostrong", (lexer.has("strong") ? {type: "strong"} : strong)], "postprocess": ([,s]) => fmtInline("strong", s)},
    {"name": "italic", "symbols": [(lexer.has("italic") ? {type: "italic"} : italic), "noitalic", (lexer.has("italic") ? {type: "italic"} : italic)], "postprocess": ([,s]) => fmtInline("italic", s)},
    {"name": "strike", "symbols": [(lexer.has("strike") ? {type: "strike"} : strike), "nostrike", (lexer.has("strike") ? {type: "strike"} : strike)], "postprocess": ([,s]) => fmtInline("strike", s)},
    {"name": "code", "symbols": [(lexer.has("code") ? {type: "code"} : code), "nocode", (lexer.has("code") ? {type: "code"} : code)], "postprocess": ([,s]) => fmtInline("code",   s)},
    {"name": "text$subexpression$1", "symbols": ["string"]},
    {"name": "text$subexpression$1", "symbols": ["strong"]},
    {"name": "text$subexpression$1", "symbols": ["italic"]},
    {"name": "text$subexpression$1", "symbols": ["strike"]},
    {"name": "text$subexpression$1", "symbols": ["code"]},
    {"name": "text$ebnf$1", "symbols": ["text"], "postprocess": id},
    {"name": "text$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "text", "symbols": ["text$subexpression$1", "text$ebnf$1"], "postprocess": fmtText},
    {"name": "nostrong$subexpression$1", "symbols": ["string"]},
    {"name": "nostrong$subexpression$1", "symbols": ["italic"]},
    {"name": "nostrong$subexpression$1", "symbols": ["strike"]},
    {"name": "nostrong$subexpression$1", "symbols": ["code"]},
    {"name": "nostrong$ebnf$1", "symbols": ["nostrong"], "postprocess": id},
    {"name": "nostrong$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "nostrong", "symbols": ["nostrong$subexpression$1", "nostrong$ebnf$1"], "postprocess": fmtText},
    {"name": "noitalic$subexpression$1", "symbols": ["string"]},
    {"name": "noitalic$subexpression$1", "symbols": ["strong"]},
    {"name": "noitalic$subexpression$1", "symbols": ["strike"]},
    {"name": "noitalic$subexpression$1", "symbols": ["code"]},
    {"name": "noitalic$ebnf$1", "symbols": ["noitalic"], "postprocess": id},
    {"name": "noitalic$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "noitalic", "symbols": ["noitalic$subexpression$1", "noitalic$ebnf$1"], "postprocess": fmtText},
    {"name": "nostrike$subexpression$1", "symbols": ["string"]},
    {"name": "nostrike$subexpression$1", "symbols": ["strong"]},
    {"name": "nostrike$subexpression$1", "symbols": ["italic"]},
    {"name": "nostrike$subexpression$1", "symbols": ["code"]},
    {"name": "nostrike$ebnf$1", "symbols": ["nostrike"], "postprocess": id},
    {"name": "nostrike$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "nostrike", "symbols": ["nostrike$subexpression$1", "nostrike$ebnf$1"], "postprocess": fmtText},
    {"name": "nocode$subexpression$1", "symbols": ["string"]},
    {"name": "nocode$subexpression$1", "symbols": ["strong"]},
    {"name": "nocode$subexpression$1", "symbols": ["italic"]},
    {"name": "nocode$subexpression$1", "symbols": ["strike"]},
    {"name": "nocode$ebnf$1", "symbols": ["nocode"], "postprocess": id},
    {"name": "nocode$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "nocode", "symbols": ["nocode$subexpression$1", "nocode$ebnf$1"], "postprocess": fmtText},
    {"name": "string", "symbols": [(lexer.has("string") ? {type: "string"} : string)], "postprocess": ([s]) => ({type: "string", value: s.value.trim('')})},
    {"name": "e$ebnf$1", "symbols": [(lexer.has("empty") ? {type: "empty"} : empty)], "postprocess": id},
    {"name": "e$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "e", "symbols": ["e$ebnf$1"], "postprocess": () => ({type:"empty"})}
]
  , ParserStart: "mad"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
