const tests = require("./tests.js");
const compile = require("../src/index.js");

describe.each(tests)('$t', ({i, o}) => {
    test(`"${i}" -> "${o}"`, () => {
        expect(compile(i)).toMatch(o);
    });
});