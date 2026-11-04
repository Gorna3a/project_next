---
id: "rev-closures-this-classes"
type: "review"
title: "Closures, this & Classes Quick Reference"
moduleId: "mod-09-closures-this-classes"
order: 8
status: "draft"
language: "en"
lastUpdated: "2026-10-20"
covers: ["les-lexical-scope-and-closures","les-this-keyword","les-call-apply-bind","les-prototypes-and-inheritance","les-classes","ws-counter-and-bank-account","lab-class-hierarchy"]
tags: ["javascript","closures","this","classes","reference"]
---

# Quick Reference Summary

## Core Terminology / Formula Matrix
| Term / Command | Definition / Formula | Common Usage |
| :--- | :--- | :--- |
| Lexical scope | Scope based on where code is written | Inner functions read outer variables |
| Closure | Function plus its remembered outer scope | Private state, factories |
| `this` in a method | The object before the dot | `user.greet()` → `user` |
| `this` in a plain call | `undefined` in strict mode, global otherwise | Avoid relying on it |
| Arrow `this` | Inherited from the surrounding scope | Callbacks inside methods |
| `fn.call(thisArg, ...args)` | Runs immediately with explicit `this` | Function borrowing |
| `fn.apply(thisArg, argsArray)` | Runs immediately with array arguments | Forwarding argument arrays |
| `fn.bind(thisArg, ...args)` | Returns a new bound function | Callbacks and partial application |
| Prototype | Object linked to another object for lookup | Shared behavior |
| `Object.create(proto)` | Creates an object with a given prototype | Prototypal inheritance |
| `class` | Syntax over prototype-based inheritance | Reusable object blueprints |
| `constructor` | Initializes a new instance | Set instance fields |
| `extends` / `super` | Inherit / call the parent constructor | Class hierarchies |
| `static` | Member on the class, not instances | Utility methods |
| `get` / `set` | Property-style accessors | Computed or guarded properties |
| `#field` | Private class field | Internal state |

## Key Concepts Comparison
- **Closure vs private field**: Both hide state. A closure keeps state in a function scope; a private field keeps it on the instance behind `#`.
- **Regular function vs arrow function**: A regular function gets `this` from its call site; an arrow gets `this` from where it was defined.
- **`call` vs `apply` vs `bind`**: `call` and `apply` invoke now; `bind` returns a new function. `call` takes individual arguments; `apply` takes an array.
- **Prototype vs class**: Classes are syntax over prototypes. Methods live on the prototype, and instances look up behavior through the chain.

## Critical Syntax / Templates
```js
// Closure with private state
function makeCounter() {
  let count = 0;
  return {
    increment() {
      count += 1;
      return count;
    },
    value() {
      return count;
    },
  };
}

// Losing and restoring this
const user = {
  name: "Sam",
  greet() {
    return "Hi, " + this.name;
  },
};

console.log(user.greet());
const boundGreet = user.greet.bind(user);
console.log(boundGreet());

// Prototypal inheritance
const animal = { eats: true };
const rabbit = Object.create(animal);
rabbit.name = "Rabbit";

// Class inheritance
class Shape {
  constructor(name) {
    this.name = name;
  }

  area() {
    throw new Error("Area must be implemented");
  }

  describe() {
    return `${this.name} has area ${this.area()}`;
  }
}

class Rectangle extends Shape {
  constructor(width, height) {
    super("Rectangle");
    this.width = width;
    this.height = height;
  }

  area() {
    return this.width * this.height;
  }
}
```
