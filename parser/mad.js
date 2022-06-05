// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

const moo = require("moo");

// Math a single non line-breaking whitespace
const nonBreakingSpace = { match: /[^\S\r\n]/ };

// Match a single whitespace (space, tab or line-break)
const space = { match: /\s/, lineBreaks: true };

// Match a single new line character
const newLine = { match: /[\n\r]/, lineBreaks: true };

// Match a number, optionally with a decimal point and sign
const number = { match: /[+-]?(?:\d*\.)?\d+/ };

// A single word containing alphanumeric characters and hypen,
// but starts with an alphabetical character
const word = { match: /[a-z]+[\w-]*/ };

// Match any characters in a single line except for *`~{_ and line-breaks
// This characters can be in the string if escaped by a backslash \
const string = { match: /(?:(?:\\{|\\\*|\\`|\\~|\\_)|(?!\/\/)[^{\*`_~\n\r])+/ };

// Match a single or double quoted string that allows escaped quotes with
// backspaces \
const quotedString = [
    { match: /"(?:\\.|[^\\])*?"/, lineBreaks: true },
    { match: /'(?:\\.|[^\\])*?'/, lineBreaks: true },
];

// Match any number of spces followeb by a @	
const at = { match: /^[^\S\r\n]*@/ };

const comment = { match: /\/\/.*/ };

const lexer = moo.states({
    element: {
        comment,
        openBrace: { match: "{", push: 'attribute' },
        at: { ...at, push: 'component' }, 
        h6: /^[^\S\r\n]*#{6}/,
        h5: /^[^\S\r\n]*#{5}/,
        h4: /^[^\S\r\n]*#{4}/,
        h3: /^[^\S\r\n]*#{3}/,
        h2: /^[^\S\r\n]*#{2}/,
        h1: /^[^\S\r\n]*#/,
        GT: /^[^\S\r\n]*>/,
        pipe: /^[^\S\r\n]*\|/,
        strong: "**",
        italic: "__",
        strike: "~~",
        code: "``",
        newLine,
        nonBreakingSpace,
        string
    },
    attribute: {
        comment,
        closeBrace: { match: "}", pop: 1 },
        space,
        number,
        word,
        quotedString,
        symbols: [".", "#", "="],
    },
    component: {
        comment,
        newLine: { ...newLine, pop: 1},
        openBrace: { match: "{", push: 'componentContent' },
        at,
        space,
        word,
    },
    componentContent: {
        closeBrace: {  match: "}", pop: 1 },
        space,
        number,
        word,
        quotedString,
        symbols: [",", ":"],
    },
});

const fmtElement   = (type, value, attrs) => ({category: "element",   type,       value, attrs})
const fmtTerminal  = (type, value)        => ({category: "terminal",  type,       value       })
const fmtInline    = (type, value)        => ({category: "inline",    type,       value       })
const fmtAttribute = (type, name, value)  => ({category: "attribute", type, name, value       })
const fmtComponent = (name, value)        => ({category: "component",       name, value       })
const fmtArgument  = (type, name, value)  => ({category: "argument",  type, name, value       })

var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "mad", "symbols": ["exp"], "postprocess": id},
    {"name": "mad", "symbols": ["exp", (lexer.has("newLine") ? {type: "newLine"} : newLine), "mad"], "postprocess": ([e,,m]) => [e[0], ...m]},
    {"name": "exp$subexpression$1", "symbols": ["elem"]},
    {"name": "exp$subexpression$1", "symbols": ["comp"]},
    {"name": "exp$subexpression$1", "symbols": ["empty"]},
    {"name": "exp", "symbols": ["exp$subexpression$1", "comm"], "postprocess": ([e]) => e},
    {"name": "elem$subexpression$1", "symbols": ["h1"]},
    {"name": "elem$subexpression$1", "symbols": ["h2"]},
    {"name": "elem$subexpression$1", "symbols": ["h3"]},
    {"name": "elem$subexpression$1", "symbols": ["h4"]},
    {"name": "elem$subexpression$1", "symbols": ["h5"]},
    {"name": "elem$subexpression$1", "symbols": ["h6"]},
    {"name": "elem$subexpression$1", "symbols": ["p"]},
    {"name": "elem$subexpression$1", "symbols": ["quote"]},
    {"name": "elem$subexpression$1", "symbols": ["pre"]},
    {"name": "elem$ebnf$1$subexpression$1", "symbols": ["attr", "_n"]},
    {"name": "elem$ebnf$1", "symbols": ["elem$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "elem$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "elem", "symbols": ["elem$subexpression$1", "elem$ebnf$1"], "postprocess": ([b,a]) => fmtElement(b[0].type, b[0].value, a?.[0] || [])},
    {"name": "h1$ebnf$1", "symbols": ["text"], "postprocess": id},
    {"name": "h1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "h1", "symbols": [(lexer.has("h1") ? {type: "h1"} : h1), "_n", "h1$ebnf$1"], "postprocess": ([,,t]) => ({type: "h1",    value: t?.value || []})},
    {"name": "h2$ebnf$1", "symbols": ["text"], "postprocess": id},
    {"name": "h2$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "h2", "symbols": [(lexer.has("h2") ? {type: "h2"} : h2), "_n", "h2$ebnf$1"], "postprocess": ([,,t]) => ({type: "h2",    value: t?.value || []})},
    {"name": "h3$ebnf$1", "symbols": ["text"], "postprocess": id},
    {"name": "h3$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "h3", "symbols": [(lexer.has("h3") ? {type: "h3"} : h3), "_n", "h3$ebnf$1"], "postprocess": ([,,t]) => ({type: "h3",    value: t?.value || []})},
    {"name": "h4$ebnf$1", "symbols": ["text"], "postprocess": id},
    {"name": "h4$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "h4", "symbols": [(lexer.has("h4") ? {type: "h4"} : h4), "_n", "h4$ebnf$1"], "postprocess": ([,,t]) => ({type: "h4",    value: t?.value || []})},
    {"name": "h5$ebnf$1", "symbols": ["text"], "postprocess": id},
    {"name": "h5$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "h5", "symbols": [(lexer.has("h5") ? {type: "h5"} : h5), "_n", "h5$ebnf$1"], "postprocess": ([,,t]) => ({type: "h5",    value: t?.value || []})},
    {"name": "h6$ebnf$1", "symbols": ["text"], "postprocess": id},
    {"name": "h6$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "h6", "symbols": [(lexer.has("h6") ? {type: "h6"} : h6), "_n", "h6$ebnf$1"], "postprocess": ([,,t]) => ({type: "h6",    value: t?.value || []})},
    {"name": "quote$ebnf$1", "symbols": ["text"], "postprocess": id},
    {"name": "quote$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "quote", "symbols": [(lexer.has("GT") ? {type: "GT"} : GT), "_n", "quote$ebnf$1"], "postprocess": ([,,t]) => ({type: "quote", value: t?.value || []})},
    {"name": "pre$ebnf$1", "symbols": ["text"], "postprocess": id},
    {"name": "pre$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "pre", "symbols": [(lexer.has("pipe") ? {type: "pipe"} : pipe), "_n", "pre$ebnf$1"], "postprocess": ([,,t]) => ({type: "pre",   value: t?.value || []})},
    {"name": "p", "symbols": ["_n", "text"], "postprocess": ([,t])  => ({type: "p",     value: t?.value || []})},
    {"name": "strong", "symbols": [(lexer.has("strong") ? {type: "strong"} : strong), "_n", "nostrong", (lexer.has("strong") ? {type: "strong"} : strong)], "postprocess": ([,,s]) => fmtInline("strong", s.value)},
    {"name": "italic", "symbols": [(lexer.has("italic") ? {type: "italic"} : italic), "_n", "noitalic", (lexer.has("italic") ? {type: "italic"} : italic)], "postprocess": ([,,s]) => fmtInline("italic", s.value)},
    {"name": "strike", "symbols": [(lexer.has("strike") ? {type: "strike"} : strike), "_n", "nostrike", (lexer.has("strike") ? {type: "strike"} : strike)], "postprocess": ([,,s]) => fmtInline("strike", s.value)},
    {"name": "code", "symbols": [(lexer.has("code") ? {type: "code"} : code), "_n", "nocode", (lexer.has("code") ? {type: "code"} : code)], "postprocess": ([,,s]) => fmtInline("code",   s.value)},
    {"name": "text$subexpression$1", "symbols": ["string"]},
    {"name": "text$subexpression$1", "symbols": ["strong"]},
    {"name": "text$subexpression$1", "symbols": ["italic"]},
    {"name": "text$subexpression$1", "symbols": ["strike"]},
    {"name": "text$subexpression$1", "symbols": ["code"]},
    {"name": "text$ebnf$1", "symbols": ["text"], "postprocess": id},
    {"name": "text$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "text", "symbols": ["text$subexpression$1", "_n", "text$ebnf$1"], "postprocess": ([s,,t]) => ({value: [s[0], ...t?.value || []]})},
    {"name": "nostrong$subexpression$1", "symbols": ["string"]},
    {"name": "nostrong$subexpression$1", "symbols": ["italic"]},
    {"name": "nostrong$subexpression$1", "symbols": ["strike"]},
    {"name": "nostrong$subexpression$1", "symbols": ["code"]},
    {"name": "nostrong$ebnf$1", "symbols": ["nostrong"], "postprocess": id},
    {"name": "nostrong$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "nostrong", "symbols": ["nostrong$subexpression$1", "_n", "nostrong$ebnf$1"], "postprocess": ([s,,t]) => ({value: [s[0], ...t?.value || []]})},
    {"name": "noitalic$subexpression$1", "symbols": ["string"]},
    {"name": "noitalic$subexpression$1", "symbols": ["strong"]},
    {"name": "noitalic$subexpression$1", "symbols": ["strike"]},
    {"name": "noitalic$subexpression$1", "symbols": ["code"]},
    {"name": "noitalic$ebnf$1", "symbols": ["noitalic"], "postprocess": id},
    {"name": "noitalic$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "noitalic", "symbols": ["noitalic$subexpression$1", "_n", "noitalic$ebnf$1"], "postprocess": ([s,,t]) => ({value: [s[0], ...t?.value || []]})},
    {"name": "nostrike$subexpression$1", "symbols": ["string"]},
    {"name": "nostrike$subexpression$1", "symbols": ["strong"]},
    {"name": "nostrike$subexpression$1", "symbols": ["italic"]},
    {"name": "nostrike$subexpression$1", "symbols": ["code"]},
    {"name": "nostrike$ebnf$1", "symbols": ["nostrike"], "postprocess": id},
    {"name": "nostrike$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "nostrike", "symbols": ["nostrike$subexpression$1", "_n", "nostrike$ebnf$1"], "postprocess": ([s,,t]) => ({value: [s[0], ...t?.value || []]})},
    {"name": "nocode$subexpression$1", "symbols": ["string"]},
    {"name": "nocode$subexpression$1", "symbols": ["strong"]},
    {"name": "nocode$subexpression$1", "symbols": ["italic"]},
    {"name": "nocode$subexpression$1", "symbols": ["strike"]},
    {"name": "nocode$ebnf$1", "symbols": ["nocode"], "postprocess": id},
    {"name": "nocode$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "nocode", "symbols": ["nocode$subexpression$1", "_n", "nocode$ebnf$1"], "postprocess": ([s,,t]) => ({value: [s[0], ...t?.value || []]})},
    {"name": "attr$ebnf$1$subexpression$1", "symbols": ["attrs", "_"]},
    {"name": "attr$ebnf$1", "symbols": ["attr$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "attr$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "attr", "symbols": [{"literal":"{"}, "_", "attr$ebnf$1", {"literal":"}"}], "postprocess": ([,,attrs])      => attrs?.[0] || []},
    {"name": "attrs", "symbols": ["props"], "postprocess": ([ps])           => [...ps]},
    {"name": "attrs", "symbols": ["id"], "postprocess": ([id])           => [id]},
    {"name": "attrs", "symbols": ["props", "__", "id"], "postprocess": ([ps,,id])       => [...ps, id]},
    {"name": "attrs", "symbols": ["id", "__", "props"], "postprocess": ([id,,ps])       => [id, ...ps]},
    {"name": "attrs", "symbols": ["props", "__", "id", "__", "props"], "postprocess": ([ps1,,id,,ps2]) => [...ps1, id, ...ps2]},
    {"name": "props$subexpression$1", "symbols": ["boolAtt"]},
    {"name": "props$subexpression$1", "symbols": ["namedAttr"]},
    {"name": "props$subexpression$1", "symbols": ["class"]},
    {"name": "props$ebnf$1$subexpression$1", "symbols": ["__", "props"]},
    {"name": "props$ebnf$1", "symbols": ["props$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "props$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "props", "symbols": ["props$subexpression$1", "props$ebnf$1"], "postprocess": ([d, ps])        => ps ? [d[0], ...ps[1]] : [d[0]]},
    {"name": "boolAtt", "symbols": ["word"], "postprocess": ([w])            => fmtAttribute("bool",  null,    w)},
    {"name": "namedAttr", "symbols": ["word", "_", {"literal":"="}, "_", "aplhanum"], "postprocess": ([w,,,,a])       => fmtAttribute("named", w,       a)},
    {"name": "class", "symbols": [{"literal":"."}, "word"], "postprocess": ([,w])           => fmtAttribute("class", null,    w)},
    {"name": "id", "symbols": [{"literal":"#"}, "word"], "postprocess": ([,w])           => fmtAttribute("id",    null,    w)},
    {"name": "comp", "symbols": [(lexer.has("at") ? {type: "at"} : at), "word", "_"], "postprocess": ([,w])         => fmtComponent(w, [])},
    {"name": "comp$ebnf$1$subexpression$1", "symbols": ["args", "_"]},
    {"name": "comp$ebnf$1", "symbols": ["comp$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "comp$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "comp", "symbols": [(lexer.has("at") ? {type: "at"} : at), "word", "_", {"literal":"{"}, "_", "comp$ebnf$1", {"literal":"}"}, "_"], "postprocess": ([,w,,,,args]) => fmtComponent(w, args?.[0] || [])},
    {"name": "args$ebnf$1$subexpression$1$ebnf$1$subexpression$1", "symbols": ["_", "args"]},
    {"name": "args$ebnf$1$subexpression$1$ebnf$1", "symbols": ["args$ebnf$1$subexpression$1$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "args$ebnf$1$subexpression$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "args$ebnf$1$subexpression$1", "symbols": ["_", {"literal":","}, "args$ebnf$1$subexpression$1$ebnf$1"]},
    {"name": "args$ebnf$1", "symbols": ["args$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "args$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "args", "symbols": ["arg", "args$ebnf$1"], "postprocess": ([arg, args])  => args?.[2] ? [arg, ...args[2][1]] : [arg]},
    {"name": "arg", "symbols": ["word", "_", {"literal":":"}, "_", "aplhanum"], "postprocess": ([w,,,,a])     => fmtArgument("string", w, a)},
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", (lexer.has("space") ? {type: "space"} : space)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_", "symbols": ["_$ebnf$1"]},
    {"name": "__$ebnf$1", "symbols": [(lexer.has("space") ? {type: "space"} : space)]},
    {"name": "__$ebnf$1", "symbols": ["__$ebnf$1", (lexer.has("space") ? {type: "space"} : space)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "__", "symbols": ["__$ebnf$1"]},
    {"name": "_n$ebnf$1", "symbols": []},
    {"name": "_n$ebnf$1", "symbols": ["_n$ebnf$1", (lexer.has("nonBreakingSpace") ? {type: "nonBreakingSpace"} : nonBreakingSpace)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_n", "symbols": ["_n$ebnf$1"]},
    {"name": "empty$ebnf$1", "symbols": []},
    {"name": "empty$ebnf$1", "symbols": ["empty$ebnf$1", (lexer.has("nonBreakingSpace") ? {type: "nonBreakingSpace"} : nonBreakingSpace)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "empty", "symbols": ["empty$ebnf$1"], "postprocess": () => fmtTerminal("empty", null)},
    {"name": "string", "symbols": [(lexer.has("string") ? {type: "string"} : string)], "postprocess": ([s]) => fmtTerminal("string", s.value.trim())},
    {"name": "aplhanum", "symbols": ["quoted"], "postprocess": id},
    {"name": "aplhanum", "symbols": ["number"], "postprocess": id},
    {"name": "quoted", "symbols": [(lexer.has("quotedString") ? {type: "quotedString"} : quotedString)], "postprocess": ([n]) => n.value.substring(1, n.value.length - 1)},
    {"name": "word", "symbols": [(lexer.has("word") ? {type: "word"} : word)], "postprocess": ([n]) => n.value},
    {"name": "number", "symbols": [(lexer.has("number") ? {type: "number"} : number)], "postprocess": ([n]) => n.value},
    {"name": "comm$ebnf$1", "symbols": [(lexer.has("comment") ? {type: "comment"} : comment)], "postprocess": id},
    {"name": "comm$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "comm", "symbols": ["comm$ebnf$1"], "postprocess": ([n]) => n}
]
  , ParserStart: "mad"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
