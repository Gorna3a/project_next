---
id: "quiz-closures-this-classes"
type: "quiz"
title: "Closures, this & Classes Knowledge Check"
moduleId: "mod-09-closures-this-classes"
order: 9
status: "draft"
language: "en"
lastUpdated: "2026-10-20"
passingScorePercent: 80
shuffleQuestions: true
shuffleOptions: true
tags: ["javascript","closures","this","classes","quiz"]
---

# Questions

## Question 1
<!-- meta: {"type":"code-output","points":1} -->
What does this code print?

```js
function makeCounter() {
  let count = 0;
  return function () {
    count += 1;
    return count;
  };
}

const next = makeCounter();
console.log(next());
console.log(next());
```

- [ ] 1, then 1
- [x] 1, then 2
- [ ] 2, then 2
- [ ] undefined, then undefined

*Explanation*: The returned function closes over count. Each call updates the same variable, so the second call returns 2.

---

## Question 2
<!-- meta: {"type":"single","points":1} -->
In the call `user.greet()`, what is `this` inside `greet`?

- [ ] The global object
- [x] The `user` object
- [ ] `undefined`
- [ ] The `greet` function

*Explanation*: In a method call, this is the object before the dot, which is user.

---

## Question 3
<!-- meta: {"type":"code-output","points":1} -->
What does this code print?

```js
const counter = {
  count: 10,
  start() {
    const read = () => this.count;
    return read();
  },
};

console.log(counter.start());
```

- [x] 10
- [ ] undefined
- [ ] The global count
- [ ] TypeError

*Explanation*: The arrow function inherits this from start, so this.count is 10.

---

## Question 4
<!-- meta: {"type":"multiple","points":2} -->
Which statements about `call`, `apply`, and `bind` are true? Select all that apply.

- [x] `call` runs the function immediately with an explicit `this`
- [x] `apply` accepts arguments as an array
- [x] `bind` returns a new function with `this` fixed
- [ ] `bind` runs the function immediately

*Explanation*: call and apply invoke immediately; bind returns a new function. apply takes an argument array.

---

## Question 5
<!-- meta: {"type":"multiple","points":2} -->
Which statements about prototypes are true? Select all that apply.

- [x] Property lookup walks the prototype chain
- [x] `Object.create(proto)` creates an object whose prototype is `proto`
- [x] An object can override an inherited property with its own property
- [ ] `Object.create` copies every property from the prototype into the new object

*Explanation*: Object.create links to the prototype rather than copying it. Lookup follows the chain, and own properties shadow inherited ones.

---

## Question 6
<!-- meta: {"type":"single","points":1} -->
In a subclass constructor, what must happen before you use `this`?

- [ ] You must call `bind`
- [x] You must call `super()`
- [ ] You must call `static`
- [ ] You must return an object

*Explanation*: A subclass constructor must call super() before accessing this.

---

## Question 7
<!-- meta: {"type":"single","points":1} -->
What does a field declared with `#count` mean in a class?

- [ ] It is a static field
- [x] It is private and accessible only inside the class body
- [ ] It is read-only from outside the class
- [ ] It is inherited by every subclass

*Explanation*: The # prefix marks a private field. It cannot be accessed outside the class that declares it.

---

## Question 8
<!-- meta: {"type":"code-output","points":1} -->
What does this code print?

```js
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    return this.name + " makes a sound";
  }
}

class Dog extends Animal {
  speak() {
    return this.name + " barks";
  }
}

const dog = new Dog("Rex");
console.log(dog.speak());
```

- [ ] Rex makes a sound
- [x] Rex barks
- [ ] undefined
- [ ] TypeError

*Explanation*: Dog overrides speak, so the subclass method runs and returns "Rex barks".
