const nearley = require("nearley");
const grammar = require("../parser/attr.js");
const exception = "EXCEPTION";

const tests = [
  {
    t: "Empty attributes",
    i: "{}",
    o: [],
  },
  {
    t: "Class",
    i: "{.class}",
    o: [{ type: "class", value: "class" }],
  },
  {
    t: "Space before class",
    i: "{ .class}",
    o: [{ type: "class", value: "class" }],
  },
  {
    t: "Space after class",
    i: "{.class }",
    o: [{ type: "class", value: "class" }],
  },
  {
    t: "Multiple classes",
    i: "{.class1 .class2}",
    o: [
      { type: "class", value: "class1" },
      { type: "class", value: "class2" },
    ],
  },
  {
    t: "Duplicated class",
    i: "{.class .class}",
    o: [
      { type: "class", value: "class" },
      { type: "class", value: "class" },
    ],
  },
  {
    t: "Class with hyphen",
    i: "{.a-class}",
    o: [{ type: "class", value: "a-class" }],
  },
  {
    t: "Id",
    i: "{#id}",
    o: [{ type: "id", value: "id" }],
  },
  {
    t: "Space before id",
    i: "{ #id}",
    o: [{ type: "id", value: "id" }],
  },
  {
    t: "Space after id",
    i: "{#id }",
    o: [{ type: "id", value: "id" }],
  },
  {
    t: "Id with hyphen",
    i: "{#an-id}",
    o: [{ type: "id", value: "an-id" }],
  },
  {
    t: "Multiple id",
    i: "{#id1 #id2}",
    o: exception,
  },
  {
    t: "Boolean attribute",
    i: "{bool}",
    o: [{ type: "bool-attr", value: "bool" }],
  },
  {
    t: "Space before boolean attribute",
    i: "{ bool}",
    o: [{ type: "bool-attr", value: "bool" }],
  },
  {
    t: "Space after boolean attribute",
    i: "{bool }",
    o: [{ type: "bool-attr", value: "bool" }],
  },
  {
    t: "Multiple boolean attribute",
    i: "{bool autofocus}",
    o: [
      { type: "bool-attr", value: "bool" },
      { type: "bool-attr", value: "autofocus" },
    ],
  },
  {
    t: "Duplicated boolean attribute",
    i: "{bool bool}",
    o: [
      { type: "bool-attr", value: "bool" },
      { type: "bool-attr", value: "bool" },
    ],
  },
  {
    t: "Boolean attribute with hyphen",
    i: "{bool-attr}",
    o: [{ type: "bool-attr", value: "bool-attr" }],
  },
  {
    t: "Named attribute",
    i: "{name='value'}",
    o: [{ type: "named-attr", name: "name", value: "'value'" }],
  },
  {
    t: "Spece before named attribute",
    i: "{ name='value'}",
    o: [{ type: "named-attr", name: "name", value: "'value'" }],
  },
  {
    t: "Space between named attribute",
    i: "{name = 'value'}",
    o: [{ type: "named-attr", name: "name", value: "'value'" }],
  },
  {
    t: "Space after named attribute",
    i: "{name='value' }",
    o: [{ type: "named-attr", name: "name", value: "'value'" }],
  },
  {
    t: "Single quoted named attribute",
    i: "{name='value'}",
    o: [{ type: "named-attr", name: "name", value: "'value'" }],
  },
  {
    t: "Single quoted named attribute with escape",
    i: "{name='value\\''}",
    o: [{ type: "named-attr", name: "name", value: "'value\\''" }],
  },
  {
    t: "Double quoted named attribute",
    i: '{name="value"}',
    o: [{ type: "named-attr", name: "name", value: '"value"' }],
  },
  {
    t: "Double quoted named attribute with escape",
    i: '{name="value\\""}',
    o: [{ type: "named-attr", name: "name", value: '"value\\""' }],
  },
  {
    t: "Numeric named attribute",
    i: "{name=3}",
    o: [{ type: "named-attr", name: "name", value: "3" }],
  },
  {
    t: "Positive named attribute",
    i: "{name=+3}",
    o: [{ type: "named-attr", name: "name", value: "+3" }],
  },
  {
    t: "Negative named attribute",
    i: "{name=-3}",
    o: [{ type: "named-attr", name: "name", value: "-3" }],
  },
  {
    t: "Decimal named attribute",
    i: "{name=3.3}",
    o: [{ type: "named-attr", name: "name", value: "3.3" }],
  },
  {
    t: "Only decimal named attribute",
    i: "{name=.3}",
    o: [{ type: "named-attr", name: "name", value: ".3" }],
  },
  {
    t: "Special characters",
    i: [
      "{!}",
      "{@}",
      "{#}",
      "{$}",
      "{%}",
      "{^}",
      "{&}",
      "{*}",
      "{(}",
      "{)}",
      "{-}",
      "{_}",
      "{=}",
      "{+}",
      "{[}",
      "{{}",
      "{]}",
      "{}}",
      "{;}",
      "{:}",
      "{'}",
      '{"}',
      "{}",
      "{|}",
      "{,}",
      "{<}",
      "{.}",
      "{>}",
      "{/}",
      "{?}",
    ],
    o: exception,
  },
  {
    t: "Class id bool-attr and named-attr",
    i: "{.class #id bool-attr named='attr' named-2=.5}",
    o: [
      { type: "class", value: "class" },
      { type: "id", value: "id" },
      { type: "bool-attr", value: "bool-attr" },
      { type: "named-attr", name: "named", value: "'attr'" },
      { type: "named-attr", name: "named-2", value: ".5" },
    ],
  },
];

tests.forEach(({ t: label, i: inputs, o: output }) => {
  const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
  // Ensure inputs is always an array
  inputs = Array.isArray(inputs) ? inputs : [inputs];

  try {
    inputs.forEach((input) => {
      parser.feed(input);
      const results = parser.results;
      test(label, () => expect(results[0]).toEqual(output));
      // Test that the given input didn't produce more than one output
      test(`Ambiguity for ${label}`, () => expect(results.length).toBe(1));
    });
  } catch (e) {
    // If the parser throws an exception check if it was expected
    if (output === exception) {
      test(label, () => expect(true).toBe(true));
    } else {
      throw e;
    }
  }
});
