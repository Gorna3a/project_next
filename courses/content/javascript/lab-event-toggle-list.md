---
id: "lab-event-toggle-list"
type: "lab"
title: "Event-Driven Toggle List"
moduleId: "mod-11-modules-iterators-dom"
order: 7
difficulty: "intermediate"
status: "draft"
language: "en"
lastUpdated: "2026-10-20"
estimatedMinutes: 30
passingScorePercent: 100
revealSolutionAfterAttempts: 3
tags: ["dom","events","delegation","toggle"]
---

# Objective

Implement `setupToggleList(root)` for a list element. A click on any `<li>` should toggle its `completed` class. Use one delegated listener on `root` and return a cleanup function that removes the listener.

## Requirements
- Use `addEventListener` on the list, not on each item
- Use `event.target.closest("li")` to find the clicked item
- Ignore clicks outside an item
- Toggle the `completed` class with `classList.toggle`
- Return a function that removes the listener
- Do not remove listeners for other features

## Starter State / Workspace
```js
function setupToggleList(root) {
  // Add delegation and return a cleanup function
}

const list = document.createElement("ul");
list.id = "toggle-list";

["Buy milk", "Walk the dog", "Write code"].forEach((text) => {
  const item = document.createElement("li");
  item.textContent = text;
  list.append(item);
});

document.body.append(list);
setupToggleList(list);
```

## Evaluation Tests
```json
[
  { "type": "function-returns", "call": "typeof setupToggleList", "expected": "function", "message": "setupToggleList should be a function", "required": true },
  { "type": "function-returns", "call": "(() => { const root = { listeners: 0, addEventListener() { this.listeners += 1; }, removeEventListener() { this.listeners -= 1; }, contains() { return true; } }; const cleanup = setupToggleList(root); const before = root.listeners; cleanup(); return [before, root.listeners]; })()", "expected": [1, 0], "message": "setupToggleList should add one listener and return a cleanup function", "weight": 2, "required": true },
  { "type": "code-contains", "value": "closest", "message": "Use closest to identify the clicked item", "required": true },
  { "type": "code-contains", "value": "classList.toggle", "message": "Toggle the completed class", "required": true },
  { "type": "code-contains", "value": "removeEventListener", "message": "Cleanup should remove the listener" },
  { "type": "dom-selector", "selector": "#toggle-list", "count": 1, "message": "The toggle list should exist", "required": true },
  { "type": "dom-selector", "selector": "#toggle-list li", "count": 3, "message": "The list should contain three items" },
  { "type": "dom-selector", "selector": ".completed", "count": 0, "message": "Items should start without the completed class" }
]
```

## Hints
> [!TIP]
> **Hint 1:** Define a named `handleClick` function so the same reference can be passed to both `addEventListener` and `removeEventListener`.

> [!TIP]
> **Hint 2:** Inside the handler, `event.target.closest("li")` may return `null` when the click is outside an item.

> [!TIP]
> **Hint 3:** Return a function that calls `root.removeEventListener("click", handleClick)`.

## Reference Solution
```js
function setupToggleList(root) {
  function handleClick(event) {
    const item = event.target.closest("li");

    if (!item || !root.contains(item)) {
      return;
    }

    item.classList.toggle("completed");
  }

  root.addEventListener("click", handleClick);

  return function cleanup() {
    root.removeEventListener("click", handleClick);
  };
}

const list = document.createElement("ul");
list.id = "toggle-list";

["Buy milk", "Walk the dog", "Write code"].forEach((text) => {
  const item = document.createElement("li");
  item.textContent = text;
  list.append(item);
});

document.body.append(list);
const cleanup = setupToggleList(list);
```
