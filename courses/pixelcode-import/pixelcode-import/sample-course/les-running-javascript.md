---
id: "les-running-javascript"
type: "theory"
title: "Running JavaScript"
moduleId: "mod-01-getting-started"
order: 3
status: "draft"
language: "en"
lastUpdated: "2026-10-04"
estimatedMinutes: 15
tags: ["console","node","browser"]
---


# Concept Overview

There are three common ways to run JavaScript: the browser developer console for quick experiments, a script tag inside an HTML page for real web pages, and Node.js for running files from your terminal. The function console.log prints a value so you can see what your code is doing.

## Key Principles & Frameworks

In the browser, open DevTools and use the Console tab to type code and see results instantly. In an HTML file, place your code inside a script tag, and it runs when the page loads. With Node.js installed, save your code in a file and run it with the node command. In all three, console.log writes its arguments to the output.

```js
// Save as hello.js, then run:  node hello.js
console.log("Hello, world!");
console.log("The answer is", 42);
```

## Common Pitfalls & Anti-Patterns
- **Forgetting to save the file**: Node runs the saved file, not what is on screen in your editor.
- **Looking at the wrong output**: console.log writes to the Console tab or terminal, not to the web page itself.

## Quick Summary
- Use the browser console, a script tag, or Node.js to run code.
- console.log prints values so you can inspect them.
