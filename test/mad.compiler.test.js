const tests = require("./tests.js");
const compile = require("../compiler/mad.compiler.js");

describe.each(tests)("$t", ({ i, o }) => {
  test(`"${i}" -> "${o}"`, () => {
    expect(compile(i)).toMatch(o);
  });
});
