const nearley = require("nearley");

// Load the grammar (generated with: nearleyc syntax/mad.ne -o src/parser.js)
const grammar = require("./parser.js");

// Convert parser node to html
const convert = (node) => {
    switch (node.t) {
        case 'h1':
        case 'h2':
        case 'h3':
        case 'h4':
        case 'h5':
        case 'h6':
        case 'p':
            return `<${node.t}>${node.v}</${node.t}>`;    
        case 'code':
            return `<pre><code>${node.v}</code></pre>`;    
        case 'quote':
            return `<blockquote>${node.v}</blockquote>`;
    }
}

// Compile source string to html
module.exports = (source) => {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
    parser.feed(source);

    const nodes = parser.results.shift() || []
    let data = '', prev = nodes?.shift();
    
    for (const node of nodes) {
        if(node.t === prev.t && node.s === 0) {
            if(node.t === 'code') {
                prev.v = prev.v.concat('<br>').concat(node.v);
            } else {
                prev.v = prev.v.concat(' ').concat(node.v);
            }
        } else {
            data += convert(prev);
            prev = node;
        }
    }
    data = prev ? data + convert(prev) : data;
    
    return data;
}