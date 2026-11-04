---
id: "les-objects"
type: "theory"
title: "Objects: Properties, Spread, and Destructuring"
moduleId: "mod-07-arrays-objects-json"
order: 3
status: "draft"
language: "en"
lastUpdated: "2026-10-20"
estimatedMinutes: 20
tags: ["javascript","objects","properties"]
---

# Concept Overview

An object stores related values under named keys. Objects model records such as a user, a product, or a configuration. You read and write properties with dot or bracket notation, copy and merge objects with spread, and extract fields with destructuring.

## Key Principles & Frameworks

An object literal uses curly braces with key-value pairs. Keys are strings (or symbols), and values can be any type.

```js
const user = {
  name: "Sam",
  age: 20,
  active: true,
};

console.log(user.name);       // "Sam"
console.log(user["age"]);     // 20
```

Dot notation is shorter, but bracket notation works with keys stored in variables or keys that are not valid identifiers.

```js
const key = "name";
console.log(user[key]);   // "Sam"
```

Objects can hold functions. The method shorthand writes the function without the `function` keyword.

```js
const counter = {
  count: 0,
  increment() {
    this.count++;
  },
};
counter.increment();
console.log(counter.count);   // 1
```

Spread copies an object's own enumerable properties into a new object. Later properties override earlier ones.

```js
const user = { name: "Sam", age: 20 };
const updated = { ...user, age: 21 };
console.log(updated);   // { name: "Sam", age: 21 }
```

Destructuring extracts properties into variables. You can rename a property with a colon.

```js
const user = { name: "Sam", age: 20 };
const { name, age: years } = user;
console.log(name, years);   // Sam 20
```

`Object.keys`, `Object.values`, and `Object.entries` return arrays of keys, values, or key-value pairs.

```js
const user = { name: "Sam", age: 20 };
console.log(Object.keys(user));      // ["name", "age"]
console.log(Object.values(user));    // ["Sam", 20]
console.log(Object.entries(user));   // [["name", "Sam"], ["age", 20]]
```

Objects are copied by reference. Spread makes a shallow copy: nested objects are still shared.

```js
const original = { name: "Sam", address: { city: "Oslo" } };
const copy = { ...original };
copy.address.city = "Bergen";
console.log(original.address.city);   // "Bergen"
```

## Common Pitfalls & Anti-Patterns
- **Copying by reference**: `const copy = original` shares the same object. Use `{ ...original }` for a shallow copy.
- **Assuming spread is deep**: Nested objects are still shared. Copy nested levels explicitly when needed.
- **Reading missing properties**: A missing key returns `undefined`; it does not throw.
- **Using dot notation with dynamic keys**: `user.key` looks for a property literally named `key`. Use `user[key]` when the key is in a variable.

## Quick Summary
- Objects store named values and support dot and bracket access.
- Method shorthand defines functions inside objects.
- Spread creates a shallow copy and can override properties.
- Destructuring extracts fields into variables.
- Use `Object.keys`, `values`, and `entries` to turn an object into arrays.
