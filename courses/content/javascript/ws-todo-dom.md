---
id: "ws-todo-dom"
type: "workshop"
title: "Build a Todo List with the DOM"
moduleId: "mod-11-modules-iterators-dom"
order: 6
status: "draft"
language: "en"
lastUpdated: "2026-10-20"
estimatedMinutes: 50
tags: ["dom","events","todo-list","workshop"]
---

# Workshop Overview

You will build a small to-do list from scratch. The workshop starts by rendering a list, adds a form for new items, wires the form submission, and finishes with click-to-toggle behavior using event delegation.

---

## Step 1: Render the initial list

### Instructions
Create a `<ul>` with the ID `todo-list`. For each string in `todos`, create an `<li>` with the class `todo-item` and set its text with `textContent`. Append the list to `document.body`.

### Hints
1. Use `document.createElement("ul")` and an `id` assignment.
2. Loop over `todos` with `forEach`.
3. Use `list.append(item)` for each new item.

### Starter State / Code
```js
const todos = ["Learn DOM", "Build a todo list"];

// Build the list below
```

### Solution State / Code
```js
const todos = ["Learn DOM", "Build a todo list"];

const list = document.createElement("ul");
list.id = "todo-list";

todos.forEach((todo) => {
  const item = document.createElement("li");
  item.className = "todo-item";
  item.textContent = todo;
  list.append(item);
});

document.body.append(list);
```

### Evaluation Tests
```json
[
  { "type": "dom-selector", "selector": "#todo-list", "count": 1, "message": "Create one list with the id todo-list", "required": true },
  { "type": "dom-selector", "selector": ".todo-item", "count": 2, "message": "Render one item per todo", "required": true },
  { "type": "code-contains", "value": "textContent", "message": "Set item text with textContent" }
]
```

---

## Step 2: Add the form controls

### Instructions
Create a `<form>` with the ID `todo-form`. Inside it, add an `<input>` with the ID `todo-input`, a placeholder, and `type="text"`. Add a submit `<button>` with the ID `add-todo` and the text `Add`. Append the form to `document.body`.

### Hints
1. Create each element with `document.createElement`.
2. Set IDs with `.id` and text with `.textContent`.
3. Append the input and button to the form, then the form to the body.

### Starter State / Code
```js
const todos = ["Learn DOM", "Build a todo list"];

const list = document.createElement("ul");
list.id = "todo-list";

todos.forEach((todo) => {
  const item = document.createElement("li");
  item.className = "todo-item";
  item.textContent = todo;
  list.append(item);
});

document.body.append(list);
```

### Solution State / Code
```js
const todos = ["Learn DOM", "Build a todo list"];

const list = document.createElement("ul");
list.id = "todo-list";

todos.forEach((todo) => {
  const item = document.createElement("li");
  item.className = "todo-item";
  item.textContent = todo;
  list.append(item);
});

const form = document.createElement("form");
form.id = "todo-form";

const input = document.createElement("input");
input.id = "todo-input";
input.type = "text";
input.placeholder = "New todo";

const button = document.createElement("button");
button.id = "add-todo";
button.type = "submit";
button.textContent = "Add";

form.append(input, button);
document.body.append(form);
document.body.append(list);
```

### Evaluation Tests
```json
[
  { "type": "dom-selector", "selector": "#todo-form", "count": 1, "message": "Create one form with the id todo-form", "required": true },
  { "type": "dom-selector", "selector": "#todo-input", "count": 1, "message": "Add the todo input", "required": true },
  { "type": "dom-selector", "selector": "#add-todo", "count": 1, "message": "Add the submit button", "required": true }
]
```

---

## Step 3: Handle form submission

### Instructions
Add a `submit` listener to the form. Prevent the default page reload, trim the input value, ignore empty input, create a new `li.todo-item` with the text, append it to the list, and clear the input.

### Hints
1. Call `event.preventDefault()` first.
2. Store `input.value.trim()` in a variable.
3. Create the item with `textContent` and append it to `list`.

### Starter State / Code
```js
const list = document.createElement("ul");
list.id = "todo-list";

const form = document.createElement("form");
form.id = "todo-form";

const input = document.createElement("input");
input.id = "todo-input";
input.type = "text";

const button = document.createElement("button");
button.id = "add-todo";
button.type = "submit";
button.textContent = "Add";

form.append(input, button);
document.body.append(form, list);
```

### Solution State / Code
```js
const list = document.createElement("ul");
list.id = "todo-list";

const form = document.createElement("form");
form.id = "todo-form";

const input = document.createElement("input");
input.id = "todo-input";
input.type = "text";
input.placeholder = "New todo";

const button = document.createElement("button");
button.id = "add-todo";
button.type = "submit";
button.textContent = "Add";

form.append(input, button);
document.body.append(form, list);

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = input.value.trim();

  if (!text) {
    return;
  }

  const item = document.createElement("li");
  item.className = "todo-item";
  item.textContent = text;
  list.append(item);

  input.value = "";
});
```

### Evaluation Tests
```json
[
  { "type": "code-contains", "value": "addEventListener", "message": "Listen for the form submit event", "required": true },
  { "type": "code-contains", "value": "preventDefault", "message": "Prevent the default form submission", "required": true },
  { "type": "code-contains", "value": "trim", "message": "Trim the input value" },
  { "type": "dom-selector", "selector": "#todo-form", "count": 1, "message": "Keep the form in the document" }
]
```

---

## Step 4: Toggle completed items

### Instructions
Add one `click` listener to the list. Use `event.target.closest(".todo-item")` to find the clicked item. If the item exists and belongs to the list, toggle the `completed` class. This is event delegation: one listener handles every current and future item.

### Hints
1. Attach the listener to `list`, not to each item.
2. `closest(".todo-item")` returns the item or `null`.
3. Use `list.contains(item)` to make sure the item belongs to this list.

### Starter State / Code
```js
const list = document.createElement("ul");
list.id = "todo-list";

const form = document.createElement("form");
form.id = "todo-form";

const input = document.createElement("input");
input.id = "todo-input";
input.type = "text";

const button = document.createElement("button");
button.id = "add-todo";
button.type = "submit";
button.textContent = "Add";

form.append(input, button);
document.body.append(form, list);

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  const item = document.createElement("li");
  item.className = "todo-item";
  item.textContent = text;
  list.append(item);
  input.value = "";
});
```

### Solution State / Code
```js
const list = document.createElement("ul");
list.id = "todo-list";

const form = document.createElement("form");
form.id = "todo-form";

const input = document.createElement("input");
input.id = "todo-input";
input.type = "text";
input.placeholder = "New todo";

const button = document.createElement("button");
button.id = "add-todo";
button.type = "submit";
button.textContent = "Add";

form.append(input, button);
document.body.append(form, list);

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  const item = document.createElement("li");
  item.className = "todo-item";
  item.textContent = text;
  list.append(item);
  input.value = "";
});

list.addEventListener("click", (event) => {
  const item = event.target.closest(".todo-item");

  if (!item || !list.contains(item)) {
    return;
  }

  item.classList.toggle("completed");
});
```

### Evaluation Tests
```json
[
  { "type": "code-contains", "value": "closest", "message": "Use closest to find the clicked item", "required": true },
  { "type": "code-contains", "value": "classList.toggle", "message": "Toggle the completed class", "required": true },
  { "type": "dom-selector", "selector": ".completed", "count": 0, "message": "Items should start without the completed class" },
  { "type": "dom-selector", "selector": "#todo-list", "count": 1, "message": "Keep the todo list in the document" }
]
```
