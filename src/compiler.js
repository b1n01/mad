const nearley = require("nearley");

// Load the grammar (generated with: nearleyc syntax/mad.ne -o src/parser.js)
const grammar = require("./parser.js");

// Convert parsed node to html
const convert = (node) => {
    let data = '';
    for (const tag of node.tags) data += `<${tag}>`;
    data += node.v;
    for (const tag of node.tags.reverse()) data += `</${tag}>`;
    return data;
}

// Compile mad to html
module.exports = (source) => {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
    parser.feed(source);

    const nodes = parser.results.shift() || []
    let data = '', prev = nodes?.shift();
    
    for (const node of nodes) {
        if(node.t === prev.t && node.s === 0) {
            prev.v = prev.v.concat(prev.g).concat(node.v);
        } else {
            data += convert(prev);
            prev = node;
        }
    }
    
    data = prev ? data + convert(prev) : data;
    
    return data;
}