---
id: "les-modules-commonjs-esm"
type: "theory"
title: "Modules: CommonJS and ESM"
moduleId: "mod-11-modules-iterators-dom"
order: 1
status: "draft"
language: "en"
lastUpdated: "2026-10-20"
estimatedMinutes: 20
tags: ["javascript","modules","commonjs","esm"]
---

# Concept Overview

A module is a file with its own scope. It can export values for other files to use and import values from other modules. JavaScript has two main module systems: CommonJS, used historically by Node.js, and ECMAScript modules (ESM), the standard used by browsers and modern Node.js.

## Key Principles & Frameworks

CommonJS uses `require` and `module.exports`.

```js
// math.js
function add(a, b) {
  return a + b;
}

module.exports = { add };
```

```js
// app.js
const { add } = require("./math.js");
console.log(add(2, 3));
```

`module.exports` is the value another file receives from `require`. Assigning `exports.name = value` also works because `exports` starts as a reference to `module.exports`, but reassigning `exports` directly breaks that link.

ESM uses `export` and `import`.

```js
// math.js
export function add(a, b) {
  return a + b;
}

export const version = "1.0.0";
```

```js
// app.js
import { add, version } from "./math.js";
console.log(add(2, 3), version);
```

ESM also supports a default export.

```js
// logger.js
export default function log(message) {
  console.log(message);
}
```

```js
// app.js
import log from "./logger.js";
log("Hello");
```

Named exports use braces and must match the exported name. A default export is imported without braces and can be given any local name.

ESM imports are live bindings and read-only from the importing file. You cannot reassign an imported binding, but the module that owns it can update it.

In browsers, load an ES module with `type="module"`.

```html
<script type="module" src="./app.js"></script>
```

In Node.js, ESM is enabled with `"type": "module"` in `package.json`, `.mjs` files, or modern configuration. Do not mix `require` and `import` in the same file.

## Common Pitfalls & Anti-Patterns
- **Mixing `require` and `import` in one file**: Choose one module system per file and configure the project consistently.
- **Confusing default and named exports**: `import log from "./logger.js"` and `import { log } from "./logger.js"` are different.
- **Omitting file extensions in browser ESM**: Browsers do not guess extensions. Write `"./math.js"`.
- **Reassigning an imported binding**: ESM imports are read-only. Export a function that changes state instead.
- **Circular imports**: Modules that import each other can see partially initialized values. Restructure shared code into a third module.

## Quick Summary
- Modules give each file its own scope.
- CommonJS uses `require` and `module.exports`.
- ESM uses `import` and `export`; named and default exports differ.
- Browser ESM needs `<script type="module">` and explicit file extensions.
- Keep one module system per file and avoid circular dependencies.
