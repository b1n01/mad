const nearley = require("nearley");

// Load the grammar (generated with: nearleyc syntax/mad.ne -o src/parser.js)
const grammar = require("./parser.js");

// Convert an ast node of type "attr" to string
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
const parseNode = (node, attrs) => {
  attrs = parseAttrs(attrs);

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
    console.log("Ambiguos syntax alert");
    process.exit(1);
  }

  const nodes = ast.shift() || [];
  let prev = nodes?.shift() || [];
  let result = "";
  let attrs = [];

  for (let node of nodes) {
    if (prev.t === "attr") {
      attrs = prev.v;
      prev = node;
    } else {
      if (prev.t === node.t && node.s === 0) {
        const glue = node.t === "code" ? "<br>" : " ";
        node.v = prev.v.concat(glue).concat(node.v);
      } else {
        result += parseNode(prev, attrs);
        attrs = [];
      }
      prev = node;
    }
  }

  result += parseNode(prev, attrs);

  return result;
};
