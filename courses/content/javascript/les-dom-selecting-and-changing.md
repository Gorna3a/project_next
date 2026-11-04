---
id: "les-dom-selecting-and-changing"
type: "theory"
title: "Selecting and Changing DOM Elements"
moduleId: "mod-11-modules-iterators-dom"
order: 3
status: "draft"
language: "en"
lastUpdated: "2026-10-20"
estimatedMinutes: 20
tags: ["javascript","dom","queryselector","mutation"]
---

# Concept Overview

The DOM is the browser's object model of the page. JavaScript can select elements, read and change their content, add or remove classes, and create new nodes. Most page interactions start with a selection and end with a safe update.

## Key Principles & Frameworks

`document.querySelector` returns the first element that matches a CSS selector, or `null` if nothing matches.

```js
const heading = document.querySelector("h1");
const list = document.querySelector("#todo-list");

console.log(heading?.textContent);
```

Use `querySelectorAll` to get every match as a static `NodeList`.

```js
const items = document.querySelectorAll(".todo-item");

items.forEach((item) => {
  console.log(item.textContent);
});
```

`getElementById` is a direct lookup when you already have an ID.

```js
const app = document.getElementById("app");
```

Create elements with `document.createElement`, set safe text with `textContent`, and append them with `append`.

```js
const list = document.querySelector("#todo-list");

if (!list) {
  throw new Error("Todo list not found");
}

const item = document.createElement("li");
item.textContent = "Write tests";
item.className = "todo-item";
item.classList.add("pending");

list.append(item);
```

Use `classList` to add, remove, or toggle classes without rewriting the whole class attribute.

```js
item.classList.remove("pending");
item.classList.toggle("completed");
```

Remove an element from the DOM with `remove`.

```js
item.remove();
```

`innerHTML` parses a string as HTML. It is convenient for trusted templates but dangerous with user input because it can inject scripts or event handlers. Prefer `textContent` for text.

```js
const safe = document.createElement("p");
safe.textContent = userInput;

container.append(safe);
```

## Common Pitfalls & Anti-Patterns
- **Forgetting that `querySelector` can return `null`**: Check the result or use optional chaining before reading properties.
- **Using `innerHTML` with user input**: This creates an XSS risk. Use `textContent` and DOM methods.
- **Treating a `NodeList` as an array**: It has `forEach` but not every array method. Use `Array.from` when you need `map` or `filter`.
- **Rebuilding the entire list for one change**: Update the affected node instead. It preserves focus and is faster.
- **Duplicate IDs**: `getElementById` returns the first match. Keep IDs unique.

## Quick Summary
- `querySelector` returns the first match or `null`.
- `querySelectorAll` returns a static `NodeList`.
- `createElement`, `textContent`, `append`, and `classList` build and update safe DOM nodes.
- `remove` detaches an element.
- Never put untrusted text into `innerHTML`.
