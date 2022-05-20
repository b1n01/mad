#!/usr/bin/env node

const fs = require("fs").promises;
const compile = require("../src/mad.compiler.js");

(async () => {
  const file = process.argv[2];
  const content = await fs.readFile(file);
  const result = compile(content.toString());
  fs.writeFile(file.replace(".mad", ".html"), result);
})();
