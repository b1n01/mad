const nearley = require("nearley");
const grammar = require("../parser/mad.js");

const elements = [
  ["#", "h1"],
  ["##", "h2"],
  ["###", "h3"],
  ["####", "h4"],
  ["#####", "h5"],
  ["######", "h6"],
  [">", "quote"],
  ["|", "pre"],
  ["", "p"],
];

const inlines = [
  ["**", "strong"],
  ["__", "italic"],
  ["~~", "strike"],
  ["``", "code"],
];

const elementTests = (symbol, tag) => [
  {
    t: `Element ${tag}`,
    i: [`${symbol}Hello`, ` ${symbol} Hello `],
    o: [
      {
        category: "element",
        type: tag,
        value: [{ category: "terminal", type: "string", value: "Hello" }],
        attrs: [],
      },
    ],
  },
  {
    t: `Element ${tag} with empty attributes`,
    i: [`${symbol}Hello{}`, ` ${symbol} Hello { } `],
    o: [
      {
        category: "element",
        type: tag,
        value: [{ category: "terminal", type: "string", value: "Hello" }],
        attrs: [],
      },
    ],
  },
  {
    t: `Element ${tag} with attributes`,
    i: [`${symbol}Hello{a b=1 .c #d }`, ` ${symbol} Hello { a b=1 .c #d } `],
    o: [
      {
        category: "element",
        type: tag,
        value: [{ category: "terminal", type: "string", value: "Hello" }],
        attrs: [
          { category: "attribute", type: "bool", name: null, value: "a" },
          { category: "attribute", type: "named", name: "b", value: "1" },
          {
            category: "attribute",
            type: "class",
            name: null,
            value: "c",
          },
          { category: "attribute", type: "id", name: null, value: "d" },
        ],
      },
    ],
  },
];

const inlineTests = (elementSymbol, elementTag, inlineSymbol, inlineTag) => [
  {
    t: `Element ${elementTag} with inline ${inlineTag} content`,
    i: [
      `${elementSymbol}Hello ${inlineSymbol}World${inlineSymbol}`,
      ` ${elementSymbol} Hello ${inlineSymbol} World ${inlineSymbol} `,
    ],
    o: [
      {
        category: "element",
        type: elementTag,
        value: [
          { category: "terminal", type: "string", value: "Hello" },
          {
            category: "inline",
            type: inlineTag,
            value: [{ category: "terminal", type: "string", value: "World" }],
          },
        ],
        attrs: [],
      },
    ],
  },
];

const getInlineTests = (elementSymbol, elementTag) => {
  let tests = [];

  inlines.forEach(([symbol, tag]) => {
    tests.push(...inlineTests(elementSymbol, elementTag, symbol, tag));
  });

  return tests;
};

const getElementTests = () => {
  let tests = [];

  elements.forEach(([symbol, tag]) => {
    tests.push(...elementTests(symbol, tag));
    tests.push(...getInlineTests(symbol, tag));
  });

  return tests;
};

const getEmptyTests = () => [
  {
    t: "Empty line",
    i: ["", " "],
    o: [{ category: "terminal", type: "empty", value: null }],
  },
];

const getTests = () => {
  let tests = [];

  tests.push(...getEmptyTests());
  tests.push(...getElementTests());

  return tests;
};

const tests = getTests();

tests.forEach(({ t: label, i: inputs, o: output }) => {
  inputs.forEach((input) => {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
    parser.feed(input);
    const results = parser.results;
    test(label, () => expect(results[0]).toEqual(output));
    test(`Ambiguity for "${label}"`, () => expect(results.length).toBe(1));
  });
});
