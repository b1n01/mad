// Test spacing before and after the symbol for block-element
const blockSpacing = (symbol, tag) => [
  {
    i: `${symbol}`,
    o: `<${tag}></${tag}>`,
    t: `Empty ${tag}`,
  },
  {
    i: `${symbol}Content`,
    o: `<${tag}>Content</${tag}>`,
    t: `${tag} with no space`,
  },
  {
    i: `${symbol} Content`,
    o: `<${tag}>Content</${tag}>`,
    t: `${tag} with single leading space`,
  },
  {
    i: `${symbol}     Content`,
    o: `<${tag}>Content</${tag}>`,
    t: `${tag} with multiple leading space`,
  },
  {
    i: `${symbol}Content `,
    o: `<${tag}>Content</${tag}>`,
    t: `${tag} with single trailing space`,
  },
  {
    i: `${symbol}Content     `,
    o: `<${tag}>Content</${tag}>`,
    t: `${tag} with multiple trailing space`,
  },
  {
    i: `${symbol} Content `,
    o: `<${tag}>Content</${tag}>`,
    t: `${tag} with single leading and trailing spaces`,
  },
  {
    i: `${symbol}    Content    `,
    o: `<${tag}>Content</${tag}>`,
    t: `${tag} with multiple leading and trailing spaces`,
  },
  {
    i: ` ${symbol}Content`,
    o: `<${tag}>Content</${tag}>`,
    t: `${tag} with single space befor symbol`,
  },
  {
    i: `     ${symbol}Content`,
    o: `<${tag}>Content</${tag}>`,
    t: `${tag} with multiple space befor symbol`,
  },
];

// Test spacing before and after the symbol for pre-element
const preSpacing = (symbol, tag) => [
  {
    i: `${symbol}`,
    o: `<pre><${tag}></${tag}></pre>`,
    t: `Empty ${tag}`,
  },
  {
    i: `${symbol}Content`,
    o: `<pre><${tag}>Content</${tag}></pre>`,
    t: `${tag} with no space`,
  },
  {
    i: `${symbol} Content`,
    o: `<pre><${tag}> Content</${tag}></pre>`,
    t: `${tag} with single leading space`,
  },
  {
    i: `${symbol}     Content`,
    o: `<pre><${tag}>     Content</${tag}></pre>`,
    t: `${tag} with multiple leading space`,
  },
  {
    i: `${symbol}Content `,
    o: `<pre><${tag}>Content </${tag}></pre>`,
    t: `${tag} with single trailing space`,
  },
  {
    i: `${symbol}Content     `,
    o: `<pre><${tag}>Content     </${tag}></pre>`,
    t: `${tag} with multiple trailing space`,
  },
  {
    i: `${symbol} Content `,
    o: `<pre><${tag}> Content </${tag}></pre>`,
    t: `${tag} with single leading and trailing spaces`,
  },
  {
    i: `${symbol}     Content     `,
    o: `<pre><${tag}>     Content     </${tag}></pre>`,
    t: `${tag} with multiple leading and trailing spaces`,
  },
];

// Test spacing before and after the symbol for paragraphs
const paragraphSpacing = (symbol, tag) => {
  let tests = blockSpacing(symbol, tag);
  tests.shift();
  return tests;
};

// Test multiple line of same symbol for block-element
const blockMultiLine = (symbol, tag) => [
  {
    i: `${symbol} First
            ${symbol} second`,
    o: `<${tag}>First second</${tag}>`,
    t: `Contiguous ${tag} lines`,
  },
  {
    i: `${symbol} First

            ${symbol} Second`,
    o: `<${tag}>First</${tag}><${tag}>Second</${tag}>`,
    t: `Saperated ${tag} lines`,
  },
];

// Test multiple line of same symbol for pre-element
const preMultiline = (symbol, tag) => [
  {
    i: `${symbol}First
            ${symbol}second`,
    o: `<pre><${tag}>First<br>second</${tag}></pre>`,
    t: `Contiguous ${tag} lines`,
  },
  {
    i: `${symbol}First

            ${symbol}Second`,
    o: `<pre><${tag}>First</${tag}></pre><pre><${tag}>Second</${tag}></pre>`,
    t: `Saperated ${tag} lines`,
  },
];

// TODO est symbols inside other tag
// eg: "# First > second" -> "<h1>First > second</h1>"

// TODO test different symbols combinations
// eg:
// i = "# First
// > second"
// o =  "<h1>First</h1><blockquote>Second</blockquote>"

(() => {
  let tests = [];

  [
    ["#", "h1"],
    ["##", "h2"],
    ["###", "h3"],
    ["####", "h4"],
    ["#####", "h5"],
    ["######", "h6"],
    [">", "blockquote"],
  ].forEach(([symbol, tag]) => {
    tests.push(...blockSpacing(symbol, tag));
    tests.push(...blockMultiLine(symbol, tag));
  });

  [["`", "code"]].forEach(([symbol, tag]) => {
    tests.push(...preSpacing(symbol, tag));
    tests.push(...preMultiline(symbol, tag));
  });

  [["", "p"]].forEach(([symbol, tag]) => {
    tests.push(...paragraphSpacing(symbol, tag));
    tests.push(...blockMultiLine(symbol, tag));
  });

  module.exports = tests;
})();
