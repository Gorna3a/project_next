---
id: "rev-modules-iterators-dom"
type: "review"
title: "Modules, Iterators & the DOM Quick Reference"
moduleId: "mod-11-modules-iterators-dom"
order: 8
status: "draft"
language: "en"
lastUpdated: "2026-10-20"
covers: ["les-modules-commonjs-esm","les-iterators-and-generators","les-dom-selecting-and-changing","les-dom-events","les-browser-devtools","ws-todo-dom","lab-event-toggle-list"]
tags: ["javascript","modules","iterators","dom","reference"]
---

# Quick Reference Summary

## Core Terminology / Formula Matrix
| Term / Command | Definition / Formula | Common Usage |
| :--- | :--- | :--- |
| CommonJS | `require` / `module.exports` | Node.js modules |
| ESM | `import` / `export` | Browsers and modern Node.js |
| Named export | `export const name = ...` | Import with `{ name }` |
| Default export | `export default ...` | Import without braces |
| Iterable | Implements `[Symbol.iterator]` | Works with `for...of` |
| Iterator | Has `next()` returning `{ value, done }` | Tracks sequence position |
| Generator | `function*` with `yield` | Lazy sequences |
| `yield*` | Delegates to another iterable | Compose generators |
| `querySelector` | First matching element or `null` | Select by CSS selector |
| `querySelectorAll` | Static `NodeList` of matches | Select many elements |
| `createElement` | Creates a DOM node | Build UI dynamically |
| `textContent` | Safe text content | Insert untrusted text |
| `innerHTML` | Parses an HTML string | Trusted templates only |
| `addEventListener` | Registers an event handler | Clicks, input, submit |
| `event.target` | Element that triggered the event | Delegation |
| `closest` | Nearest ancestor matching a selector | Find the clicked item |
| `removeEventListener` | Removes a matching handler | Cleanup |
| `preventDefault` | Cancels the browser default | Form submission |
| DevTools Elements | Live DOM and CSS inspector | Debug markup and styles |
| DevTools Network | Request log with status and timing | Debug API calls |
| DevTools Sources | Breakpoints and stepping | Debug JavaScript |

## Key Concepts Comparison
- **CommonJS vs ESM**: CommonJS uses `require` and `module.exports`; ESM uses `import` and `export`, with static bindings and browser support.
- **Iterable vs iterator**: An iterable produces an iterator; the iterator tracks position and returns `{ value, done }`.
- **Generator vs regular function**: A generator returns an iterator and runs lazily; a regular function runs immediately.
- **`textContent` vs `innerHTML`**: `textContent` inserts text safely; `innerHTML` parses markup and can introduce XSS.
- **Direct listeners vs delegation**: Direct listeners attach to each element; delegation attaches one listener to a parent and uses `closest`.

## Critical Syntax / Templates
```js
// ES module
export function add(a, b) {
  return a + b;
}

import { add } from "./math.js";

// Generator
function* ids() {
  yield 1;
  yield 2;
}

for (const id of ids()) {
  console.log(id);
}

// Safe DOM update
const item = document.createElement("li");
item.className = "todo-item";
item.textContent = "New task";
list.append(item);

// Event delegation with cleanup
function setupList(root) {
  function handleClick(event) {
    const item = event.target.closest(".todo-item");
    if (!item || !root.contains(item)) return;
    item.classList.toggle("completed");
  }

  root.addEventListener("click", handleClick);
  return () => root.removeEventListener("click", handleClick);
}
```
