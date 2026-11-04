---
id: "les-dom-events"
type: "theory"
title: "DOM Events"
moduleId: "mod-11-modules-iterators-dom"
order: 4
status: "draft"
language: "en"
lastUpdated: "2026-10-20"
estimatedMinutes: 20
tags: ["javascript","dom","events","delegation"]
---

# Concept Overview

Events let the page react to clicks, input, submissions, and other user actions. You register a listener with `addEventListener`. The browser calls it with an event object that describes what happened and where. Event delegation lets one listener on a parent handle many children.

## Key Principles & Frameworks

Register a listener with the event type and a function.

```js
const button = document.querySelector("#save");

button.addEventListener("click", () => {
  console.log("Saved");
});
```

The event object carries useful properties. `event.target` is the element that triggered the event; `event.currentTarget` is the element whose listener is running.

```js
button.addEventListener("click", (event) => {
  console.log(event.target);
  console.log(event.currentTarget);
});
```

For form submissions, call `event.preventDefault()` to stop the browser's default navigation or reload.

```js
const form = document.querySelector("#todo-form");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  console.log("Form submitted");
});
```

`stopPropagation()` prevents the event from bubbling to ancestors. Use it sparingly; delegation often works better when events bubble normally.

Event delegation attaches one listener to a parent and checks which child was involved.

```js
const list = document.querySelector("#todo-list");

list.addEventListener("click", (event) => {
  const item = event.target.closest(".todo-item");

  if (!item || !list.contains(item)) {
    return;
  }

  item.classList.toggle("completed");
});
```

This works for current and future items. Without delegation, you would need a listener on every item, and newly added items would need their own listeners.

Remove a listener with the same function reference and the same capture option.

```js
function handleClick() {
  console.log("clicked");
}

button.addEventListener("click", handleClick);
button.removeEventListener("click", handleClick);
```

An anonymous arrow function cannot be removed later because you do not keep a reference to it.

## Common Pitfalls & Anti-Patterns
- **Forgetting to remove listeners**: Long-lived listeners keep elements and their data reachable. Return or store a cleanup function.
- **Adding a listener repeatedly**: Each call adds another listener unless you remove the old one or guard the setup.
- **Losing `this` in a callback**: Prefer `event.currentTarget` over `this` in listeners, or bind the handler. See Module 9.
- **Calling `stopPropagation` everywhere**: It can break delegation and other listeners. Use it only when necessary.
- **Assuming `event.target` is the element with the listener**: It may be a child. Use `closest` when delegating.

## Quick Summary
- `addEventListener(type, handler)` subscribes to an event.
- The event object exposes `target`, `currentTarget`, and methods such as `preventDefault`.
- Delegation uses one parent listener and `closest` to handle child elements.
- Remove listeners with the same function reference.
- Avoid unnecessary `stopPropagation` and always clean up long-lived listeners.
