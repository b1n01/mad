// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

// TODO 
// - "string" cannot contain "/{" or "\@"
// - handle comments
// - components inside components are not working!!!
// - argument of type string have quotes inside the value field? Should we remove them?
// - Component cannot star on a line with spacing before he t@

const moo = require("moo");
const lexer = moo.states({
  	// Elements lexer
	elem: {
		OB: {match: /{/, push: 'attr'}, // Go to attribute state
		AT: {match: /@/, push: 'comp'}, // Go to attribute state
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
		NL: {match: /[\n\r]/, lineBreaks: true}, // New line
		e: /[^\S\r\n]/,
		string: /(?:(?!__|\*\*|~~|``|{|@)[^\n\r])+/, // todo scaped braces "\{|" and "\@" should be allowed
	},
	attr: {
		CB: {match: /}/, pop: 1}, // Go back to element
		
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
	},
	comp: {
	  NL: {match: /[\n\r]/, lineBreaks: true, pop: 1}, // New line
	  OB: {match: /{/, push: 'comp-content'}, // Go to comp-content state

	  // A single whitespace (space, tab or line-break)
	  _: { match: /\s/, lineBreaks: true },

	  // A single word containing alphanumeric characters and "-" but starts with a char
	  wrd: /[a-z]+[\w-]*/,

	  // Symbols
	  symbols: ["{", "@"],
	},
	"comp-content": {
	  CB: {match: /}/, pop: 1}, // Go back to element
	  //AT: {match: /@/, push: 'comp'}, // Go to attribute state
		
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
	  symbols: ["{", "}", ",", ":", "@"],
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
    {"name": "mad", "symbols": ["exp", (lexer.has("NL") ? {type: "NL"} : NL), "mad"], "postprocess": ([e,,m]) => [e[0], ...m]},
    {"name": "exp", "symbols": ["elem"]},
    {"name": "exp", "symbols": ["comp"]},
    {"name": "exp", "symbols": ["e"]},
    {"name": "elem$subexpression$1", "symbols": ["h1"]},
    {"name": "elem$subexpression$1", "symbols": ["h2"]},
    {"name": "elem$subexpression$1", "symbols": ["h3"]},
    {"name": "elem$subexpression$1", "symbols": ["h4"]},
    {"name": "elem$subexpression$1", "symbols": ["h5"]},
    {"name": "elem$subexpression$1", "symbols": ["h6"]},
    {"name": "elem$subexpression$1", "symbols": ["p"]},
    {"name": "elem$subexpression$1", "symbols": ["blockquote"]},
    {"name": "elem$subexpression$1", "symbols": ["pre"]},
    {"name": "elem$ebnf$1$subexpression$1$ebnf$1", "symbols": []},
    {"name": "elem$ebnf$1$subexpression$1$ebnf$1", "symbols": ["elem$ebnf$1$subexpression$1$ebnf$1", (lexer.has("e") ? {type: "e"} : e)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "elem$ebnf$1$subexpression$1", "symbols": ["attr", "elem$ebnf$1$subexpression$1$ebnf$1"]},
    {"name": "elem$ebnf$1", "symbols": ["elem$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "elem$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "elem", "symbols": ["elem$subexpression$1", "elem$ebnf$1"], "postprocess": ([b,a]) => fmtElement(b[0].type, b[0].value, a?.[0] || [])},
    {"name": "h1$ebnf$1", "symbols": []},
    {"name": "h1$ebnf$1", "symbols": ["h1$ebnf$1", (lexer.has("e") ? {type: "e"} : e)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "h1$ebnf$2", "symbols": ["text"], "postprocess": id},
    {"name": "h1$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "h1", "symbols": [(lexer.has("h1") ? {type: "h1"} : h1), "h1$ebnf$1", "h1$ebnf$2"], "postprocess": ([,,t]) => ({type: "h1",    value: t?.value || []})},
    {"name": "h2$ebnf$1", "symbols": []},
    {"name": "h2$ebnf$1", "symbols": ["h2$ebnf$1", (lexer.has("e") ? {type: "e"} : e)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "h2$ebnf$2", "symbols": ["text"], "postprocess": id},
    {"name": "h2$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "h2", "symbols": [(lexer.has("h2") ? {type: "h2"} : h2), "h2$ebnf$1", "h2$ebnf$2"], "postprocess": ([,,t]) => ({type: "h2",    value: t?.value || []})},
    {"name": "h3$ebnf$1", "symbols": []},
    {"name": "h3$ebnf$1", "symbols": ["h3$ebnf$1", (lexer.has("e") ? {type: "e"} : e)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "h3$ebnf$2", "symbols": ["text"], "postprocess": id},
    {"name": "h3$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "h3", "symbols": [(lexer.has("h3") ? {type: "h3"} : h3), "h3$ebnf$1", "h3$ebnf$2"], "postprocess": ([,,t]) => ({type: "h3",    value: t?.value || []})},
    {"name": "h4$ebnf$1", "symbols": []},
    {"name": "h4$ebnf$1", "symbols": ["h4$ebnf$1", (lexer.has("e") ? {type: "e"} : e)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "h4$ebnf$2", "symbols": ["text"], "postprocess": id},
    {"name": "h4$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "h4", "symbols": [(lexer.has("h4") ? {type: "h4"} : h4), "h4$ebnf$1", "h4$ebnf$2"], "postprocess": ([,,t]) => ({type: "h4",    value: t?.value || []})},
    {"name": "h5$ebnf$1", "symbols": []},
    {"name": "h5$ebnf$1", "symbols": ["h5$ebnf$1", (lexer.has("e") ? {type: "e"} : e)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "h5$ebnf$2", "symbols": ["text"], "postprocess": id},
    {"name": "h5$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "h5", "symbols": [(lexer.has("h5") ? {type: "h5"} : h5), "h5$ebnf$1", "h5$ebnf$2"], "postprocess": ([,,t]) => ({type: "h5",    value: t?.value || []})},
    {"name": "h6$ebnf$1", "symbols": []},
    {"name": "h6$ebnf$1", "symbols": ["h6$ebnf$1", (lexer.has("e") ? {type: "e"} : e)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "h6$ebnf$2", "symbols": ["text"], "postprocess": id},
    {"name": "h6$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "h6", "symbols": [(lexer.has("h6") ? {type: "h6"} : h6), "h6$ebnf$1", "h6$ebnf$2"], "postprocess": ([,,t]) => ({type: "h6",    value: t?.value || []})},
    {"name": "blockquote$ebnf$1", "symbols": []},
    {"name": "blockquote$ebnf$1", "symbols": ["blockquote$ebnf$1", (lexer.has("e") ? {type: "e"} : e)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "blockquote$ebnf$2", "symbols": ["text"], "postprocess": id},
    {"name": "blockquote$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "blockquote", "symbols": [(lexer.has("GT") ? {type: "GT"} : GT), "blockquote$ebnf$1", "blockquote$ebnf$2"], "postprocess": ([,,t]) => ({type: "quote", value: t?.value || []})},
    {"name": "pre$ebnf$1", "symbols": []},
    {"name": "pre$ebnf$1", "symbols": ["pre$ebnf$1", (lexer.has("e") ? {type: "e"} : e)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "pre$ebnf$2", "symbols": ["text"], "postprocess": id},
    {"name": "pre$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "pre", "symbols": [(lexer.has("pipe") ? {type: "pipe"} : pipe), "pre$ebnf$1", "pre$ebnf$2"], "postprocess": ([,,t]) => ({type: "pre",   value: t?.value || []})},
    {"name": "p$ebnf$1", "symbols": []},
    {"name": "p$ebnf$1", "symbols": ["p$ebnf$1", (lexer.has("e") ? {type: "e"} : e)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "p", "symbols": ["p$ebnf$1", "text"], "postprocess": ([,t])  => ({type: "p",     value: t?.value || []})},
    {"name": "strong$ebnf$1", "symbols": []},
    {"name": "strong$ebnf$1", "symbols": ["strong$ebnf$1", (lexer.has("e") ? {type: "e"} : e)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "strong", "symbols": [(lexer.has("strong") ? {type: "strong"} : strong), "strong$ebnf$1", "nostrong", (lexer.has("strong") ? {type: "strong"} : strong)], "postprocess": ([,,s]) => fmtInline("strong", s.value)},
    {"name": "italic$ebnf$1", "symbols": []},
    {"name": "italic$ebnf$1", "symbols": ["italic$ebnf$1", (lexer.has("e") ? {type: "e"} : e)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "italic", "symbols": [(lexer.has("italic") ? {type: "italic"} : italic), "italic$ebnf$1", "noitalic", (lexer.has("italic") ? {type: "italic"} : italic)], "postprocess": ([,,s]) => fmtInline("italic", s.value)},
    {"name": "strike$ebnf$1", "symbols": []},
    {"name": "strike$ebnf$1", "symbols": ["strike$ebnf$1", (lexer.has("e") ? {type: "e"} : e)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "strike", "symbols": [(lexer.has("strike") ? {type: "strike"} : strike), "strike$ebnf$1", "nostrike", (lexer.has("strike") ? {type: "strike"} : strike)], "postprocess": ([,,s]) => fmtInline("strike", s.value)},
    {"name": "code$ebnf$1", "symbols": []},
    {"name": "code$ebnf$1", "symbols": ["code$ebnf$1", (lexer.has("e") ? {type: "e"} : e)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "code", "symbols": [(lexer.has("code") ? {type: "code"} : code), "code$ebnf$1", "nocode", (lexer.has("code") ? {type: "code"} : code)], "postprocess": ([,,s]) => fmtInline("code",   s.value)},
    {"name": "text$subexpression$1", "symbols": ["string"]},
    {"name": "text$subexpression$1", "symbols": ["strong"]},
    {"name": "text$subexpression$1", "symbols": ["italic"]},
    {"name": "text$subexpression$1", "symbols": ["strike"]},
    {"name": "text$subexpression$1", "symbols": ["code"]},
    {"name": "text$ebnf$1", "symbols": []},
    {"name": "text$ebnf$1", "symbols": ["text$ebnf$1", (lexer.has("e") ? {type: "e"} : e)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "text$ebnf$2", "symbols": ["text"], "postprocess": id},
    {"name": "text$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "text", "symbols": ["text$subexpression$1", "text$ebnf$1", "text$ebnf$2"], "postprocess": ([s,,t]) => ({value: [s[0], ...t?.value || []]})},
    {"name": "nostrong$subexpression$1", "symbols": ["string"]},
    {"name": "nostrong$subexpression$1", "symbols": ["italic"]},
    {"name": "nostrong$subexpression$1", "symbols": ["strike"]},
    {"name": "nostrong$subexpression$1", "symbols": ["code"]},
    {"name": "nostrong$ebnf$1", "symbols": []},
    {"name": "nostrong$ebnf$1", "symbols": ["nostrong$ebnf$1", (lexer.has("e") ? {type: "e"} : e)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "nostrong$ebnf$2", "symbols": ["nostrong"], "postprocess": id},
    {"name": "nostrong$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "nostrong", "symbols": ["nostrong$subexpression$1", "nostrong$ebnf$1", "nostrong$ebnf$2"], "postprocess": ([s,,t]) => ({value: [s[0], ...t?.value || []]})},
    {"name": "noitalic$subexpression$1", "symbols": ["string"]},
    {"name": "noitalic$subexpression$1", "symbols": ["strong"]},
    {"name": "noitalic$subexpression$1", "symbols": ["strike"]},
    {"name": "noitalic$subexpression$1", "symbols": ["code"]},
    {"name": "noitalic$ebnf$1", "symbols": []},
    {"name": "noitalic$ebnf$1", "symbols": ["noitalic$ebnf$1", (lexer.has("e") ? {type: "e"} : e)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "noitalic$ebnf$2", "symbols": ["noitalic"], "postprocess": id},
    {"name": "noitalic$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "noitalic", "symbols": ["noitalic$subexpression$1", "noitalic$ebnf$1", "noitalic$ebnf$2"], "postprocess": ([s,,t]) => ({value: [s[0], ...t?.value || []]})},
    {"name": "nostrike$subexpression$1", "symbols": ["string"]},
    {"name": "nostrike$subexpression$1", "symbols": ["strong"]},
    {"name": "nostrike$subexpression$1", "symbols": ["italic"]},
    {"name": "nostrike$subexpression$1", "symbols": ["code"]},
    {"name": "nostrike$ebnf$1", "symbols": []},
    {"name": "nostrike$ebnf$1", "symbols": ["nostrike$ebnf$1", (lexer.has("e") ? {type: "e"} : e)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "nostrike$ebnf$2", "symbols": ["nostrike"], "postprocess": id},
    {"name": "nostrike$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "nostrike", "symbols": ["nostrike$subexpression$1", "nostrike$ebnf$1", "nostrike$ebnf$2"], "postprocess": ([s,,t]) => ({value: [s[0], ...t?.value || []]})},
    {"name": "nocode$subexpression$1", "symbols": ["string"]},
    {"name": "nocode$subexpression$1", "symbols": ["strong"]},
    {"name": "nocode$subexpression$1", "symbols": ["italic"]},
    {"name": "nocode$subexpression$1", "symbols": ["strike"]},
    {"name": "nocode$ebnf$1", "symbols": []},
    {"name": "nocode$ebnf$1", "symbols": ["nocode$ebnf$1", (lexer.has("e") ? {type: "e"} : e)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "nocode$ebnf$2", "symbols": ["nocode"], "postprocess": id},
    {"name": "nocode$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "nocode", "symbols": ["nocode$subexpression$1", "nocode$ebnf$1", "nocode$ebnf$2"], "postprocess": ([s,,t]) => ({value: [s[0], ...t?.value || []]})},
    {"name": "string", "symbols": [(lexer.has("string") ? {type: "string"} : string)], "postprocess": ([s]) => fmtTerminal("string", s.value.trim())},
    {"name": "e$ebnf$1", "symbols": []},
    {"name": "e$ebnf$1", "symbols": ["e$ebnf$1", (lexer.has("e") ? {type: "e"} : e)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "e", "symbols": ["e$ebnf$1"], "postprocess": () => fmtTerminal("empty", null)},
    {"name": "attr$ebnf$1", "symbols": []},
    {"name": "attr$ebnf$1", "symbols": ["attr$ebnf$1", (lexer.has("_") ? {type: "_"} : _)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "attr$ebnf$2$subexpression$1$ebnf$1", "symbols": []},
    {"name": "attr$ebnf$2$subexpression$1$ebnf$1", "symbols": ["attr$ebnf$2$subexpression$1$ebnf$1", (lexer.has("_") ? {type: "_"} : _)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "attr$ebnf$2$subexpression$1", "symbols": ["attrs", "attr$ebnf$2$subexpression$1$ebnf$1"]},
    {"name": "attr$ebnf$2", "symbols": ["attr$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "attr$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "attr", "symbols": [{"literal":"{"}, "attr$ebnf$1", "attr$ebnf$2", {"literal":"}"}], "postprocess": ([,,attrs])      => attrs?.[0] || []},
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
    {"name": "boolAtt", "symbols": [(lexer.has("wrd") ? {type: "wrd"} : wrd)], "postprocess": ([d])            => fmtAttribute("bool",  null,    d.value)},
    {"name": "namedAttr$ebnf$1", "symbols": []},
    {"name": "namedAttr$ebnf$1", "symbols": ["namedAttr$ebnf$1", (lexer.has("_") ? {type: "_"} : _)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "namedAttr$ebnf$2", "symbols": []},
    {"name": "namedAttr$ebnf$2", "symbols": ["namedAttr$ebnf$2", (lexer.has("_") ? {type: "_"} : _)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "namedAttr$subexpression$1", "symbols": ["str"]},
    {"name": "namedAttr$subexpression$1", "symbols": ["num"]},
    {"name": "namedAttr", "symbols": [(lexer.has("wrd") ? {type: "wrd"} : wrd), "namedAttr$ebnf$1", {"literal":"="}, "namedAttr$ebnf$2", "namedAttr$subexpression$1"], "postprocess": ([n,,,,d])       => fmtAttribute("named", n.value, d[0])},
    {"name": "class", "symbols": [{"literal":"."}, (lexer.has("wrd") ? {type: "wrd"} : wrd)], "postprocess": ([,d])           => fmtAttribute("class", null,    d.value)},
    {"name": "id", "symbols": [{"literal":"#"}, (lexer.has("wrd") ? {type: "wrd"} : wrd)], "postprocess": ([,d])           => fmtAttribute("id",    null,    d.value)},
    {"name": "comp$ebnf$1", "symbols": []},
    {"name": "comp$ebnf$1", "symbols": ["comp$ebnf$1", (lexer.has("_") ? {type: "_"} : _)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "comp", "symbols": [{"literal":"@"}, (lexer.has("wrd") ? {type: "wrd"} : wrd), "comp$ebnf$1"], "postprocess": ([,w])        => fmtComponent(w.value, [])},
    {"name": "comp$ebnf$2", "symbols": []},
    {"name": "comp$ebnf$2", "symbols": ["comp$ebnf$2", (lexer.has("_") ? {type: "_"} : _)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "comp$ebnf$3", "symbols": []},
    {"name": "comp$ebnf$3", "symbols": ["comp$ebnf$3", (lexer.has("_") ? {type: "_"} : _)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "comp$ebnf$4$subexpression$1$ebnf$1", "symbols": []},
    {"name": "comp$ebnf$4$subexpression$1$ebnf$1", "symbols": ["comp$ebnf$4$subexpression$1$ebnf$1", (lexer.has("_") ? {type: "_"} : _)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "comp$ebnf$4$subexpression$1", "symbols": ["args", "comp$ebnf$4$subexpression$1$ebnf$1"]},
    {"name": "comp$ebnf$4", "symbols": ["comp$ebnf$4$subexpression$1"], "postprocess": id},
    {"name": "comp$ebnf$4", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "comp$ebnf$5", "symbols": []},
    {"name": "comp$ebnf$5", "symbols": ["comp$ebnf$5", (lexer.has("_") ? {type: "_"} : _)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "comp", "symbols": [{"literal":"@"}, (lexer.has("wrd") ? {type: "wrd"} : wrd), "comp$ebnf$2", {"literal":"{"}, "comp$ebnf$3", "comp$ebnf$4", {"literal":"}"}, "comp$ebnf$5"], "postprocess": ([,w,,,,as])  => fmtComponent(w.value, as?.[0] || [])},
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
    {"name": "arg", "symbols": [(lexer.has("wrd") ? {type: "wrd"} : wrd), "arg$ebnf$1", {"literal":":"}, "arg$ebnf$2", "arg$subexpression$1"], "postprocess": ([w,,,,a])    => fmtArgument("string", w.value, a[0])},
    {"name": "str", "symbols": [(lexer.has("str") ? {type: "str"} : str)], "postprocess": ([n]) => n.value.substring(1, n.value.length - 1)},
    {"name": "num", "symbols": [(lexer.has("num") ? {type: "num"} : num)], "postprocess": ([n]) => n.value}
]
  , ParserStart: "mad"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
