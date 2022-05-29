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

const getEmptyTests = () => [
  {
    t: "Empty line",
    i: ["", " "],
    o: [{ category: "terminal", type: "empty", value: null }],
  },
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
    i: [
      `${symbol}Hello{a b=1 .c #d e='e' f="f" g=.1}`,
      ` ${symbol} Hello { a b = 1 .c #d e = 'e' f = "f" g = .1 } `,
    ],
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
          { category: "attribute", type: "named", name: "e", value: "e" },
          { category: "attribute", type: "named", name: "f", value: "f" },
          { category: "attribute", type: "named", name: "g", value: ".1" },
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

const getComponentTests = () => [
  {
    t: "Empty component",
    i: ["@comp", "@comp "], // TODO add a space before the @
    o: [
      {
        category: "component",
        name: "comp",
        value: [],
      },
    ],
  },
  {
    t: "Component",
    i: [
      `@comp{arg:'val',arg2:"val",arg3:3,arg4:.4}`,
      `@comp { arg : 'val' , arg2 : "val" , arg3 : 3 , arg4 : .4 } `, // TODO add a space before the @
    ],
    o: [
      {
        category: "component",
        name: "comp",
        value: [
          {
            category: "argument",
            type: "string",
            name: "arg",
            value: "val",
          },
          {
            category: "argument",
            type: "string",
            name: "arg2",
            value: "val",
          },
          {
            category: "argument",
            type: "string",
            name: "arg3",
            value: "3",
          },
          {
            category: "argument",
            type: "string",
            name: "arg4",
            value: ".4",
          },
        ],
      },
    ],
  },
];

const getTests = () => {
  let tests = [];

  tests.push(...getEmptyTests());
  tests.push(...getElementTests());
  tests.push(...getComponentTests());

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
