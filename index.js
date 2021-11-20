const nearley = require("nearley");
const grammar = require("./partial.js");

// Create a Parser object from our grammar.
const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

// Parse something!
parser.feed('p-nav a="aa" b="bb" c="c" d="cc";');

// parser.results is an array of possible parsings.
console.log(parser.results); // [[[[ "foo" ],"\n" ]]]