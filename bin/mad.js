#!/usr/bin/env node

const fs = require("fs").promises;
const compile = require("../src/compiler.js");

(async () => {
  const file = process.argv[2];
  const content = await fs.readFile(file);
  const result = compile(content.toString());
})();
