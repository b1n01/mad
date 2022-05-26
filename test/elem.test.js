const nearley = require("nearley");
const grammar = require("../parser/elem.js");
const exception = "EXCEPTION";

const tests = [
  {
    t: "Paragraph",
    i: ["Hello", " Hello "],
    o: [{ type: "p", value: [{ type: "string", value: "Hello" }] }],
  },
  {
    t: "h1",
    i: ["# Hello", "#Hello", " # Hello "],
    o: [{ type: "h1", value: [{ type: "string", value: "Hello" }] }],
  },
  {
    t: "h2",
    i: ["## Hello", "##Hello", " ## Hello "],
    o: [{ type: "h2", value: [{ type: "string", value: "Hello" }] }],
  },
  {
    t: "h3",
    i: ["### Hello", "###Hello", " ### Hello "],
    o: [{ type: "h3", value: [{ type: "string", value: "Hello" }] }],
  },
  {
    t: "h4",
    i: ["#### Hello", "####Hello", " #### Hello "],
    o: [{ type: "h4", value: [{ type: "string", value: "Hello" }] }],
  },
  {
    t: "h5",
    i: ["##### Hello", "#####Hello", " ##### Hello "],
    o: [{ type: "h5", value: [{ type: "string", value: "Hello" }] }],
  },
  {
    t: "h6",
    i: ["###### Hello", "######Hello", " ###### Hello "],
    o: [{ type: "h6", value: [{ type: "string", value: "Hello" }] }],
  },
  {
    t: "Seven hashes",
    i: ["####### Hello"],
    o: [{ type: "h6", value: [{ type: "string", value: "# Hello" }] }],
  },
  {
    t: "Blockquote",
    i: ["> Hello", ">Hello", " > Hello "],
    o: [{ type: "blockquote", value: [{ type: "string", value: "Hello" }] }],
  },
  {
    t: "Pre",
    i: ["| Hello", "|Hello", " | Hello "],
    o: [
      {
        type: "pre",
        value: [{ type: "string", value: "Hello" }],
      },
    ],
  },
  {
    t: "Strong",
    i: ["**Hello**", " **Hello** "],
    o: [
      {
        type: "p",
        value: [
          { type: "strong", value: [{ type: "string", value: "Hello" }] },
        ],
      },
    ],
  },
  {
    t: "Italic",
    i: ["__Hello__", " __Hello__ "],
    o: [
      {
        type: "p",
        value: [
          { type: "italic", value: [{ type: "string", value: "Hello" }] },
        ],
      },
    ],
  },
  {
    t: "Strike",
    i: ["~~Hello~~", " ~~Hello~~ "],
    o: [
      {
        type: "p",
        value: [
          { type: "strike", value: [{ type: "string", value: "Hello" }] },
        ],
      },
    ],
  },
  {
    t: "Code",
    i: ["``Hello``", " ``Hello`` "],
    o: [
      {
        type: "p",
        value: [{ type: "code", value: [{ type: "string", value: "Hello" }] }],
      },
    ],
  },
  {
    t: "h1 with strong",
    i: ["# **Hello**", "#**Hello**", " # **Hello** "],
    o: [
      {
        type: "h1",
        value: [
          { type: "strong", value: [{ type: "string", value: "Hello" }] },
        ],
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
    test(`Ambiguity for ${label}`, () => expect(results.length).toBe(1));
  });
});
