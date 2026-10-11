---
id: "les-javascript-versions"
type: "theory"
title: "JavaScript Versions and Compatibility"
moduleId: "mod-01-getting-started"
order: 2
status: "draft"
language: "en"
lastUpdated: "2026-10-04"
estimatedMinutes: 10
tags: ["ecmascript","versions","compatibility"]
---


# Concept Overview

JavaScript is updated every year under the name ECMAScript. ES5 (2009) and ES6, also called ES2015, were the biggest steps. ES6 added let, const, arrow functions, classes, and promises, which this course uses throughout.

## Key Principles & Frameworks

New features reach browsers at different times. Before using a recent feature in a web project, check a compatibility table such as MDN or Can I Use. Build tools can translate newer syntax into older syntax when you must support old browsers.

```js
// ES6+ syntax: works in all modern browsers and Node.js
const greet = (name) => `Hello, ${name}!`;
console.log(greet("Sam"));
```

## Common Pitfalls & Anti-Patterns
- **Assuming every browser is current**: Always check compatibility before relying on a brand-new feature.
- **Mixing old and new styles**: Pick modern syntax (let/const) and stay consistent in a project.

## Quick Summary
- ECMAScript releases yearly; ES2015 (ES6) was a major milestone.
- Check compatibility tables before using new features.
