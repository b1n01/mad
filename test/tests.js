const blockSpacing = (symbol, tag) => ([
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
]);

const preSpacing = (symbol, tag) => ([
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
]);

const paragraphSpacing = (symbol, tag) => {
    let tests = blockSpacing(symbol, tag);
    tests.shift();
    return tests;
}

const multiLineBlock = (symbol, tag) => ([
    {
        i: `${symbol} First
            ${symbol} second`,
        o: `<${tag}>First second</${tag}>`,
        t: `Contiguous ${tag} lines`,
    },
    {
        i: `${symbol} First

            ${symbol} second`,
        o: `<${tag}>First</${tag}><${tag}>second</${tag}>`,
        t: `Saperated ${tag} lines`,
    },
]);

(() => {
    let tests = [];

    [
        ['#', 'h1'],
        ['##', 'h2'],
        ['###', 'h3'],
        ['####', 'h4'],
        ['#####', 'h5'],
        ['######', 'h6'],
        ['>', 'blockquote'],
    ].forEach(([symbol, tag]) => {
        tests.push(...blockSpacing(symbol, tag));
        tests.push(...multiLineBlock(symbol, tag));
    });

    [
        ['`', 'code'],
    ].forEach(([symbol, tag]) => {
        tests.push(...preSpacing(symbol, tag))
        // TODO tests.push(...preMultilines(symbol, tag))
    });

    [
        ['', 'p'],
    ].forEach(([symbol, tag]) => {
        tests.push(...paragraphSpacing(symbol, tag))
        tests.push(...multiLineBlock(symbol, tag))
    });

    module.exports = tests;
})();