const nearley = require("nearley");
const grammar = require("../parser/comp.js");
const exception = "EXCEPTION";

const tests = [
  {
    t: "Component",
    i: ["@comp"],
    o: [{ type: "comp", name: "comp", value: [] }],
  },
  {
    t: "Component with a numeric attribute",
    i: ["@comp { attr: 3 }", "@comp {attr:3}"],
    o: [
      {
        type: "comp",
        name: "comp",
        value: [{ type: "alphanum-arg", name: "attr", value: "3" }],
      },
    ],
  },
  {
    t: "Component with a string attribute",
    i: ['@comp { attr: "value" }', '@comp{attr:"value"}'],
    o: [
      {
        type: "comp",
        name: "comp",
        value: [{ type: "alphanum-arg", name: "attr", value: '"value"' }],
      },
    ],
  },
  {
    t: "Component with two attributes",
    i: ['@comp { attr1: 3, attr2: "value" }', '@comp{attr1:3,attr2:"value"}'],
    o: [
      {
        type: "comp",
        name: "comp",
        value: [
          { type: "alphanum-arg", name: "attr1", value: "3" },
          { type: "alphanum-arg", name: "attr2", value: '"value"' },
        ],
      },
    ],
  },
  {
    t: "Component with a component attribute",
    i: ["@comp { attr: @comp2 }", "@comp{attr:@comp2}"],
    o: [
      {
        type: "comp",
        name: "comp",
        value: [
          {
            type: "comp-arg",
            name: "attr",
            value: [{ type: "comp", name: "comp2", value: [] }],
          },
        ],
      },
    ],
  },
  {
    t: "Component with a component attribute with a numeric attribute",
    i: ["@comp { attr: @comp2 { attr: 3 } }", "@comp{attr:@comp2{ attr:3}}"],
    o: [
      {
        type: "comp",
        name: "comp",
        value: [
          {
            type: "comp-arg",
            name: "attr",
            value: [
              {
                type: "comp",
                name: "comp2",
                value: [{ type: "alphanum-arg", name: "attr", value: "3" }],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    t: "Full component",
    i: [
      '@card { name: "Luca", age: 32, content: @pic { url: "http://asd.com"} }',
      '@card{name:"Luca",age:32,content:@pic{url:"http://asd.com"}}',
    ],
    o: [
      {
        type: "comp",
        name: "card",
        value: [
          { type: "alphanum-arg", name: "name", value: '"Luca"' },
          { type: "alphanum-arg", name: "age", value: "32" },
          {
            type: "comp-arg",
            name: "content",
            value: [
              {
                type: "comp",
                name: "pic",
                value: [
                  {
                    type: "alphanum-arg",
                    name: "url",
                    value: '"http://asd.com"',
                  },
                ],
              },
            ],
          },
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
