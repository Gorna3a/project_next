---
id: "les-classes"
type: "theory"
title: "Classes"
moduleId: "mod-09-closures-this-classes"
order: 5
status: "draft"
language: "en"
lastUpdated: "2026-10-20"
estimatedMinutes: 25
tags: ["javascript","classes","inheritance","private-fields"]
---

# Concept Overview

A `class` is a clear syntax for creating objects with shared methods and inheritance. Under the hood, classes still use prototypes: methods live on the class prototype and instances are linked to it. Classes add a constructor, `extends`, `super`, static members, getters and setters, and private fields.

## Key Principles & Frameworks

A class declaration defines a constructor and methods. Create instances with `new`.

```js
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    return this.name + " makes a sound";
  }

  static kingdom() {
    return "Animalia";
  }
}

const animal = new Animal("Generic animal");
console.log(animal.speak());
console.log(Animal.kingdom());
```

This prints `Generic animal makes a sound` and `Animalia`. The `speak` method is available on instances; the static `kingdom` method belongs to the class itself.

Use `extends` to inherit and `super` to call the parent constructor. A subclass can override a method.

```js
class Dog extends Animal {
  constructor(name, breed) {
    super(name);
    this.breed = breed;
  }

  speak() {
    return this.name + " barks";
  }
}

const dog = new Dog("Rex", "Labrador");
console.log(dog.speak());
console.log(dog instanceof Dog);
console.log(dog instanceof Animal);
```

This prints `Rex barks`, `true`, and `true`. A subclass constructor must call `super()` before it uses `this`.

Getters and setters run when a property is read or assigned.

```js
class Temperature {
  constructor(celsius) {
    this.celsius = celsius;
  }

  get fahrenheit() {
    return (this.celsius * 9) / 5 + 32;
  }

  set fahrenheit(value) {
    this.celsius = ((value - 32) * 5) / 9;
  }
}

const temperature = new Temperature(0);
console.log(temperature.fahrenheit);
temperature.fahrenheit = 212;
console.log(temperature.celsius);
```

This prints `32` and `100`. The getter and setter are accessed like ordinary properties, not called as methods.

Private fields start with `#` and are accessible only inside the class body.

```js
class BankAccount {
  #balance;

  constructor(initial) {
    this.#balance = initial;
  }

  deposit(amount) {
    this.#balance += amount;
    return this.#balance;
  }

  get balance() {
    return this.#balance;
  }
}

const account = new BankAccount(100);
account.deposit(50);
console.log(account.balance);
```

This prints `150`. `#balance` cannot be read or changed from outside the class.

## Common Pitfalls & Anti-Patterns
- **Forgetting `new`**: Calling a class as a normal function throws a `TypeError`. Use `new ClassName(...)`.
- **Using `this` before `super()`**: In a subclass constructor, call `super()` first.
- **Losing `this` when extracting a method**: `const speak = dog.speak;` loses the instance. Call `dog.speak()` or bind the method.
- **Modifying built-in prototypes**: Do not add methods to `Array.prototype`, `Object.prototype`, or other built-ins. It affects every value of that type.
- **Assuming private fields are inherited**: A private field belongs to the class that declares it. It is not part of the public interface.

## Quick Summary
- Classes provide syntax over prototype-based inheritance.
- `constructor` initializes instances; `new` creates them.
- `extends` and `super` build subclasses and call the parent constructor.
- `static` members belong to the class; getters and setters look like properties.
- Private fields with `#` are accessible only inside the class body.
- Forgetting `new` or losing `this` are common class mistakes.
