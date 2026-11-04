---
id: "les-json"
type: "theory"
title: "JSON: Stringify, Parse, and Structured Data"
moduleId: "mod-07-arrays-objects-json"
order: 6
status: "draft"
language: "en"
lastUpdated: "2026-10-20"
estimatedMinutes: 15
tags: ["javascript","json","data"]
---

# Concept Overview

JSON (JavaScript Object Notation) is a text format for structured data. It looks like JavaScript object and array literals, but it is stricter. `JSON.stringify` converts a JavaScript value into JSON text, and `JSON.parse` converts JSON text back into JavaScript values.

## Key Principles & Frameworks

JSON supports objects, arrays, strings, numbers, booleans, and `null`. Keys must be double-quoted strings, and trailing commas and comments are not allowed.

```js
const user = {
  name: "Sam",
  age: 20,
  active: true,
};

const text = JSON.stringify(user);
console.log(text);
```

This prints `{"name":"Sam","age":20,"active":true}`. The result is a string, not an object.

`JSON.parse` turns valid JSON text back into a JavaScript value.

```js
const text = '{"name":"Sam","age":20}';
const user = JSON.parse(text);
console.log(user.name);   // "Sam"
```

Pass a third argument to `JSON.stringify` to indent the output for readability.

```js
const user = { name: "Sam", age: 20 };
console.log(JSON.stringify(user, null, 2));
```

This prints the object across several lines with two-space indentation.

JSON is commonly used to send data between a server and a browser. The structure is the same in both directions: objects and arrays nest to form records and lists.

```js
const order = {
  id: 42,
  items: [
    { name: "Keyboard", quantity: 1 },
    { name: "Mouse", quantity: 2 },
  ],
};
console.log(JSON.stringify(order));
```

## Common Pitfalls & Anti-Patterns
- **Expecting `undefined` and functions to survive**: `JSON.stringify` omits object properties whose value is `undefined` or a function. Inside arrays, those values become `null`.
- **Assuming JSON is JavaScript**: JSON requires double quotes, forbids comments, and forbids trailing commas. A JavaScript object literal is not automatically valid JSON.
- **Parsing invalid text**: `JSON.parse` throws an error when the text is not valid JSON. Only parse trusted, valid JSON.
- **Serializing unsupported values**: BigInt values and circular references cannot be stringified directly.

## Quick Summary
- JSON is a text format for objects, arrays, strings, numbers, booleans, and `null`.
- `JSON.stringify` converts values to JSON text; `JSON.parse` converts text back.
- `undefined` and functions are dropped from objects and become `null` in arrays.
- JSON is stricter than JavaScript literals: double quotes, no comments, no trailing commas.
