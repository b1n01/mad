const nearley = require("nearley");

// Load the grammar (generated with: nearleyc syntax/mad.ne -o src/parser.js)
const grammar = require("./parser.js");

// Convert an AST node of type "attr" to string
const parseAttrs = (nodes) => {
  let attrs = [];
  let classes = [];

  for (const node of nodes) {
    switch (node.t) {
      case "bool-attr":
        attrs.push(node.v);
        break;
      case "named-attr":
        attrs.push(`${node.n}="${node.v}"`);
        break;
      case "class-attr":
        classes.push(node.v);
        break;
      case "id-attr":
        attrs.push(`id="${node.v}"`);
        break;
      default:
        console.log(`Ignoring attribute of type "${node.t}"`);
        break;
    }
  }

  const classString = classes.length
    ? " " + `class="${classes.join(" ")}"`
    : "";
  const attrsString = attrs.length ? " " + attrs.join(" ") : "";
  return `${classString}${attrsString}`;
};

// Convert ast node to html
const parseNode = (node) => {
  attrs = parseAttrs(node.a || []);

  let data = "";
  switch (node.t) {
    case "p":
    case "h1":
    case "h2":
    case "h3":
    case "h4":
    case "h5":
    case "h6":
    case "p":
      data += `<${node.t}${attrs}>${node.v}</${node.t}>`;
      break;
    case "quote":
      data += `<blockquote${attrs}>${node.v}</blockquote>`;
      break;
    case "code":
      data += `<pre${attrs}><code>${node.v}</code></pre>`;
      break;
    default:
      console.log(`Ignoring ast node of type "${node.t}"`);
      break;
  }

  return data;
};

// Convert .mad string to html
module.exports = (source) => {
  const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
  parser.feed(source);

  const ast = parser.results;
  if (ast.length > 1) {
    console.log("Ambiguos syntax");
    process.exit(1);
  }

  const nodes = ast.shift() || [];
  let prev = nodes?.shift();
  prev = { ...prev, s: 0, a: [] };
  let result = "";

  for (let node of nodes) {
    if (prev.t === "empty") {
      node.s = prev.s ? prev.s + 1 : 1;
      node.a = prev.a || [];
    } else if (prev.t === "attr") {
      node.s = prev.s || 0;
      node.a = prev.v;
    } else {
      if (prev.t === node.t && prev.s === 0) {
        let glue = node.t === "code" ? "<br>" : " ";
        node.v = [prev.v, node.v].join(glue);
        node.a = prev.a;
        node.s = prev.s || 0;
      } else {
        result += parseNode(prev);
      }
    }
    prev = node;
  }

  result += parseNode(prev);

  return result;
};
