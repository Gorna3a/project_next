---
id: "quiz-modules-iterators-dom"
type: "quiz"
title: "Modules, Iterators & the DOM Knowledge Check"
moduleId: "mod-11-modules-iterators-dom"
order: 9
status: "draft"
language: "en"
lastUpdated: "2026-10-20"
passingScorePercent: 80
shuffleQuestions: true
shuffleOptions: true
tags: ["javascript","modules","dom","quiz"]
---

# Questions

## Question 1
<!-- meta: {"type":"single","points":1} -->
Which import matches a named export called `add`?

- [x] `import { add } from "./math.js";`
- [ ] `import add from "./math.js";`
- [ ] `const add = require("./math.js");`
- [ ] `import * as add from "./math.js";`

*Explanation*: Named exports are imported with braces. A default export is imported without braces.

---

## Question 2
<!-- meta: {"type":"code-output","points":1} -->
What does this code print?

```js
function* values() {
  yield 1;
  yield 2;
}

const generator = values();
console.log(generator.next().value);
console.log(generator.next().value);
```

- [x] 1, then 2
- [ ] 1, then 1
- [ ] 2, then 2
- [ ] undefined, then undefined

*Explanation*: Each next() resumes the generator and returns the next yielded value.

---

## Question 3
<!-- meta: {"type":"single","points":1} -->
What does `document.querySelector(".missing")` return when nothing matches?

- [ ] An empty array
- [ ] An empty NodeList
- [x] `null`
- [ ] `undefined`

*Explanation*: querySelector returns the first matching element or null. querySelectorAll returns an empty NodeList.

---

## Question 4
<!-- meta: {"type":"single","points":1} -->
What is the safest way to insert untrusted user text into an element?

- [ ] `element.innerHTML = text`
- [x] `element.textContent = text`
- [ ] `element.outerHTML = text`
- [ ] `document.write(text)`

*Explanation*: textContent treats the value as text and does not parse HTML or execute scripts.

---

## Question 5
<!-- meta: {"type":"true-false","points":1} -->
Calling a generator function runs its body immediately.

- [ ] True
- [x] False

*Explanation*: Calling a generator returns a generator object. The body runs only when next() is called.

---

## Question 6
<!-- meta: {"type":"multiple","points":2} -->
Which statements about ES modules are true? Select all that apply.

- [x] Named exports are imported with braces
- [x] A default export is imported without braces
- [x] Browser ESM paths should include the file extension
- [ ] `require` and `import` can be freely mixed in the same file

*Explanation*: Named and default imports have different syntax. Browsers need explicit extensions. Mixing require and import in one file is not supported.

---

## Question 7
<!-- meta: {"type":"single","points":1} -->
What is the main advantage of event delegation for a dynamic list?

- [ ] It removes the need for event objects
- [x] One parent listener handles current and future items
- [ ] It prevents all bubbling
- [ ] It makes every item a button

*Explanation*: Delegation attaches one listener to a parent and uses the event target to find the relevant child, so new items work automatically.

---

## Question 8
<!-- meta: {"type":"single","points":1} -->
Which DevTools panel shows an HTTP status code and response body?

- [ ] Elements
- [ ] Sources
- [x] Network
- [ ] Console

*Explanation*: The Network panel records requests and shows status, headers, response data, and timing.
