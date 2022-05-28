const nearley = require("nearley");
const grammar = require("../parser/mad.js");

// Abstract syntax tree nodes

// ELEMENT
// {category: "element", type: "p"|"h1"|"h2"|"h3"|"h4"|"h5"|"h6"|"quote"|"pre", value: [TERMINAL|INLINE], attrs: [ATTRIBUTE]}

// TERMINAL
// {category: "terminal", type: "empty"|"string", value: STRING|NULL}

// INLINE
// {category: "inline", type: "strong"|"italic"|"strike"|"code", value: [TERMINAL|INLINE]}

// ATTRIBUTE
// {category: "attribute", type: "id"|"class"|"bool"|"named", name: STRING|NULL, value: STRING|NULL}

// COMPONENT
// {category: "component", name: STRING, value:[ARGUMENT]}

// ARGUMENT
// {category: "argument", type: "string"|"component", name: STRING, value: STRING|COMPONENT}

const tests = [
  {
    t: "Empty line",
    i: [""],
    o: [{ category: "terminal", type: "empty", value: null }],
  },
  {
    t: "Paragraph",
    i: ["Hello"],
    o: [
      {
        category: "element",
        type: "p",
        value: [{ category: "terminal", type: "string", value: "Hello" }],
        attrs: [],
      },
    ],
  },
  {
    t: "Paragraph with attributes",
    i: ["Hello {hidden}"],
    o: [
      {
        category: "element",
        type: "p",
        value: [{ type: "string", value: "Hello" }],
        attrs: [{ type: "bool", value: "hidden" }],
      },
    ],
  },
  {
    t: "Paragraph with inline content",
    i: ["Hello **World**"],
    o: [
      {
        category: "element",
        type: "p",
        value: [
          { category: "terminal", type: "string", value: "Hello" },
          {
            category: "inline",
            type: "strong",
            value: [{ category: "terminal", type: "string", value: "World" }],
          },
        ],
        attrs: [],
      },
    ],
  },
];

tests.forEach(({ t: label, i: inputs, o: output }) => {
  inputs.forEach((input) => {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
    parser.feed(input);
    const results = parser.results;
    test(label, () => expect(results[0]).toEqual(output));
    test(`Ambiguity for "${label}"`, () => expect(results.length).toBe(1));
  });
});
