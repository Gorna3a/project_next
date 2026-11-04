---
id: "les-prototypes-and-inheritance"
type: "theory"
title: "Prototypes and Inheritance"
moduleId: "mod-09-closures-this-classes"
order: 4
status: "draft"
language: "en"
lastUpdated: "2026-10-20"
estimatedMinutes: 20
tags: ["javascript","prototypes","inheritance","objects"]
---

# Concept Overview

Every ordinary JavaScript object has a hidden link to another object called its prototype. When you read a property that the object does not own, JavaScript follows that link and keeps searching up the prototype chain. This is how objects share behavior without copying it.

## Key Principles & Frameworks

`Object.create(proto)` creates a new object whose prototype is `proto`.

```js
const animal = {
  eats: true,
  describe() {
    return this.name + " eats";
  },
};

const rabbit = Object.create(animal);
rabbit.name = "Rabbit";

console.log(rabbit.eats);
console.log(rabbit.describe());
console.log(Object.getPrototypeOf(rabbit) === animal);
```

This prints `true`, `Rabbit eats`, and `true`. `rabbit` does not own `eats` or `describe`; it inherits them from `animal`.

A property on the object itself shadows the inherited one.

```js
const animal = { eats: true };
const rabbit = Object.create(animal);

rabbit.eats = false;

console.log(rabbit.eats);
console.log(animal.eats);
```

This prints `false` and `true`. The assignment created an own property on `rabbit`; it did not change `animal`.

Property lookup walks the chain until it finds the property or reaches `null`. `Object.prototype` sits near the end of the chain for ordinary objects, which is why they have methods such as `toString`. `Object.create(null)` creates an object with no prototype and therefore no inherited methods.

```js
const bare = Object.create(null);
bare.name = "Bare";

console.log(Object.keys(bare));
console.log(typeof bare.toString);
```

This prints `["name"]` and `"undefined"`. A bare object is useful as a dictionary when you do not want inherited keys to interfere.

## Common Pitfalls & Anti-Patterns
- **Thinking `Object.create` copies properties**: It creates a link. Later changes to the prototype are visible through the new object.
- **Confusing own and inherited properties**: Use `Object.hasOwn(object, "key")` to check ownership, and `Object.keys` to list own enumerable keys.
- **Modifying built-in prototypes**: Adding methods to `Array.prototype` or `Object.prototype` affects every object of that type and can break other code.
- **Changing prototypes at runtime**: Replacing an object's prototype after creation can invalidate assumptions and hurt performance. Set it when the object is created.

## Quick Summary
- Every ordinary object has a prototype link.
- Property lookup walks the prototype chain.
- `Object.create(proto)` creates an object with a specific prototype.
- Own properties shadow inherited properties.
- Do not modify built-in prototypes.
