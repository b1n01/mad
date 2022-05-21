// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

const moo = require("moo");
const lexer = moo.compile({
  // A single whitespace (space, tab or line-break)
  _: { match: /\s/, lineBreaks: true },

  // Signed float or integer
  num: /[+-]?(?:\d*\.)?\d+/,

  // A single word containing alphanumeric characters and "-" but starts with a char
  wrd: /[a-z]+[\w-]*/,

  // Single and double quoted string that allows escaped quotes
  str: [
    { match: /"(?:\\.|[^\\])*?"/, lineBreaks: true },
    { match: /'(?:\\.|[^\\])*?'/, lineBreaks: true },
  ],

  // Symbols
  symbols: ["{", "}", ".", "#", "="],
});
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "attr$ebnf$1", "symbols": []},
    {"name": "attr$ebnf$1", "symbols": ["attr$ebnf$1", (lexer.has("_") ? {type: "_"} : _)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "attr$ebnf$2$subexpression$1$ebnf$1", "symbols": []},
    {"name": "attr$ebnf$2$subexpression$1$ebnf$1", "symbols": ["attr$ebnf$2$subexpression$1$ebnf$1", (lexer.has("_") ? {type: "_"} : _)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "attr$ebnf$2$subexpression$1", "symbols": ["attrs", "attr$ebnf$2$subexpression$1$ebnf$1"]},
    {"name": "attr$ebnf$2", "symbols": ["attr$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "attr$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "attr", "symbols": [{"literal":"{"}, "attr$ebnf$1", "attr$ebnf$2", {"literal":"}"}], "postprocess": ([,,attrs])      => attrs[0] || []},
    {"name": "attrs", "symbols": ["props"], "postprocess": ([ps])           => [...ps]},
    {"name": "attrs", "symbols": ["id"], "postprocess": ([id])           => [id]},
    {"name": "attrs$ebnf$1", "symbols": [(lexer.has("_") ? {type: "_"} : _)]},
    {"name": "attrs$ebnf$1", "symbols": ["attrs$ebnf$1", (lexer.has("_") ? {type: "_"} : _)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "attrs", "symbols": ["props", "attrs$ebnf$1", "id"], "postprocess": ([ps,,id])       => [...ps, id]},
    {"name": "attrs$ebnf$2", "symbols": [(lexer.has("_") ? {type: "_"} : _)]},
    {"name": "attrs$ebnf$2", "symbols": ["attrs$ebnf$2", (lexer.has("_") ? {type: "_"} : _)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "attrs", "symbols": ["id", "attrs$ebnf$2", "props"], "postprocess": ([id,,ps])       => [id, ...ps]},
    {"name": "attrs$ebnf$3", "symbols": [(lexer.has("_") ? {type: "_"} : _)]},
    {"name": "attrs$ebnf$3", "symbols": ["attrs$ebnf$3", (lexer.has("_") ? {type: "_"} : _)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "attrs$ebnf$4", "symbols": [(lexer.has("_") ? {type: "_"} : _)]},
    {"name": "attrs$ebnf$4", "symbols": ["attrs$ebnf$4", (lexer.has("_") ? {type: "_"} : _)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "attrs", "symbols": ["props", "attrs$ebnf$3", "id", "attrs$ebnf$4", "props"], "postprocess": ([ps1,,id,,ps2]) => [...ps1, id, ...ps2]},
    {"name": "props$subexpression$1", "symbols": ["boolAtt"]},
    {"name": "props$subexpression$1", "symbols": ["namedAttr"]},
    {"name": "props$subexpression$1", "symbols": ["class"]},
    {"name": "props$ebnf$1$subexpression$1$ebnf$1", "symbols": [(lexer.has("_") ? {type: "_"} : _)]},
    {"name": "props$ebnf$1$subexpression$1$ebnf$1", "symbols": ["props$ebnf$1$subexpression$1$ebnf$1", (lexer.has("_") ? {type: "_"} : _)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "props$ebnf$1$subexpression$1", "symbols": ["props$ebnf$1$subexpression$1$ebnf$1", "props"]},
    {"name": "props$ebnf$1", "symbols": ["props$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "props$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "props", "symbols": ["props$subexpression$1", "props$ebnf$1"], "postprocess": ([d, ps])        => ps ? [d[0], ...ps[1]] : [d[0]]},
    {"name": "boolAtt", "symbols": [(lexer.has("wrd") ? {type: "wrd"} : wrd)], "postprocess": ([d])            => ({type:"bool-attr",  value: d.value})},
    {"name": "namedAttr$ebnf$1", "symbols": []},
    {"name": "namedAttr$ebnf$1", "symbols": ["namedAttr$ebnf$1", (lexer.has("_") ? {type: "_"} : _)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "namedAttr$ebnf$2", "symbols": []},
    {"name": "namedAttr$ebnf$2", "symbols": ["namedAttr$ebnf$2", (lexer.has("_") ? {type: "_"} : _)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "namedAttr$subexpression$1", "symbols": ["str"]},
    {"name": "namedAttr$subexpression$1", "symbols": ["num"]},
    {"name": "namedAttr", "symbols": [(lexer.has("wrd") ? {type: "wrd"} : wrd), "namedAttr$ebnf$1", {"literal":"="}, "namedAttr$ebnf$2", "namedAttr$subexpression$1"], "postprocess": ([n,,,,d])       => ({type:"named-attr", name: n.value, value: d[0]})},
    {"name": "class", "symbols": [{"literal":"."}, (lexer.has("wrd") ? {type: "wrd"} : wrd)], "postprocess": ([,d])           => ({type:"class",      value: d.value})},
    {"name": "id", "symbols": [{"literal":"#"}, (lexer.has("wrd") ? {type: "wrd"} : wrd)], "postprocess": ([,d])           => ({type:"id",         value: d.value})},
    {"name": "str", "symbols": [(lexer.has("str") ? {type: "str"} : str)], "postprocess": ([n]) => n.value},
    {"name": "num", "symbols": [(lexer.has("num") ? {type: "num"} : num)], "postprocess": ([n]) => n.value}
]
  , ParserStart: "attr"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
