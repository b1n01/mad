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
  symbols: ["{", "}", "@", ",", ":"],
});
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "comp", "symbols": [{"literal":"@"}, (lexer.has("wrd") ? {type: "wrd"} : wrd)], "postprocess": ([,w])        => ([{type: "comp", name: w.value, value: [] }])},
    {"name": "comp$ebnf$1", "symbols": []},
    {"name": "comp$ebnf$1", "symbols": ["comp$ebnf$1", (lexer.has("_") ? {type: "_"} : _)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "comp$ebnf$2", "symbols": []},
    {"name": "comp$ebnf$2", "symbols": ["comp$ebnf$2", (lexer.has("_") ? {type: "_"} : _)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "comp$ebnf$3$subexpression$1$ebnf$1", "symbols": []},
    {"name": "comp$ebnf$3$subexpression$1$ebnf$1", "symbols": ["comp$ebnf$3$subexpression$1$ebnf$1", (lexer.has("_") ? {type: "_"} : _)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "comp$ebnf$3$subexpression$1", "symbols": ["args", "comp$ebnf$3$subexpression$1$ebnf$1"]},
    {"name": "comp$ebnf$3", "symbols": ["comp$ebnf$3$subexpression$1"], "postprocess": id},
    {"name": "comp$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "comp", "symbols": [{"literal":"@"}, (lexer.has("wrd") ? {type: "wrd"} : wrd), "comp$ebnf$1", {"literal":"{"}, "comp$ebnf$2", "comp$ebnf$3", {"literal":"}"}], "postprocess": ([,w,,,,as])  => ([{type: "comp", name: w.value, value: as?.[0] || [] }])},
    {"name": "args$ebnf$1$subexpression$1$ebnf$1", "symbols": []},
    {"name": "args$ebnf$1$subexpression$1$ebnf$1", "symbols": ["args$ebnf$1$subexpression$1$ebnf$1", (lexer.has("_") ? {type: "_"} : _)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "args$ebnf$1$subexpression$1$ebnf$2$subexpression$1$ebnf$1", "symbols": []},
    {"name": "args$ebnf$1$subexpression$1$ebnf$2$subexpression$1$ebnf$1", "symbols": ["args$ebnf$1$subexpression$1$ebnf$2$subexpression$1$ebnf$1", (lexer.has("_") ? {type: "_"} : _)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "args$ebnf$1$subexpression$1$ebnf$2$subexpression$1", "symbols": ["args$ebnf$1$subexpression$1$ebnf$2$subexpression$1$ebnf$1", "args"]},
    {"name": "args$ebnf$1$subexpression$1$ebnf$2", "symbols": ["args$ebnf$1$subexpression$1$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "args$ebnf$1$subexpression$1$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "args$ebnf$1$subexpression$1", "symbols": ["args$ebnf$1$subexpression$1$ebnf$1", {"literal":","}, "args$ebnf$1$subexpression$1$ebnf$2"]},
    {"name": "args$ebnf$1", "symbols": ["args$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "args$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "args", "symbols": ["arg", "args$ebnf$1"], "postprocess": ([arg, args]) => args?.[2] ? [arg, ...args[2][1]] : [arg]},
    {"name": "arg$ebnf$1", "symbols": []},
    {"name": "arg$ebnf$1", "symbols": ["arg$ebnf$1", (lexer.has("_") ? {type: "_"} : _)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "arg$ebnf$2", "symbols": []},
    {"name": "arg$ebnf$2", "symbols": ["arg$ebnf$2", (lexer.has("_") ? {type: "_"} : _)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "arg$subexpression$1", "symbols": ["str"]},
    {"name": "arg$subexpression$1", "symbols": ["num"]},
    {"name": "arg", "symbols": [(lexer.has("wrd") ? {type: "wrd"} : wrd), "arg$ebnf$1", {"literal":":"}, "arg$ebnf$2", "arg$subexpression$1"], "postprocess": ([w,,,,a])    => ({type: "alphanum-arg", name: w.value, value: a[0]})},
    {"name": "arg$ebnf$3", "symbols": []},
    {"name": "arg$ebnf$3", "symbols": ["arg$ebnf$3", (lexer.has("_") ? {type: "_"} : _)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "arg$ebnf$4", "symbols": []},
    {"name": "arg$ebnf$4", "symbols": ["arg$ebnf$4", (lexer.has("_") ? {type: "_"} : _)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "arg", "symbols": [(lexer.has("wrd") ? {type: "wrd"} : wrd), "arg$ebnf$3", {"literal":":"}, "arg$ebnf$4", "comp"], "postprocess": ([w,,,,c])    => ({type: "comp-arg", name: w.value, value: c})},
    {"name": "str", "symbols": [(lexer.has("str") ? {type: "str"} : str)], "postprocess": ([n]) => n.value},
    {"name": "num", "symbols": [(lexer.has("num") ? {type: "num"} : num)], "postprocess": ([n]) => n.value}
]
  , ParserStart: "comp"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
