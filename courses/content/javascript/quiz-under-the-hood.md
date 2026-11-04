---
id: "quiz-under-the-hood"
type: "quiz"
title: "Under the Hood Knowledge Check"
moduleId: "mod-12-under-the-hood"
order: 7
status: "draft"
language: "en"
lastUpdated: "2026-10-20"
passingScorePercent: 80
shuffleQuestions: true
shuffleOptions: true
tags: ["javascript","memory","performance","quiz"]
---

# Questions

## Question 1
<!-- meta: {"type":"single","points":1} -->
When can the garbage collector reclaim an object?

- [ ] As soon as it is created
- [ ] Only when the page is closed
- [x] When it is no longer reachable from the program's roots
- [ ] When it has no properties

*Explanation*: The collector reclaims values that cannot be reached through references from roots such as globals, the call stack, closures, and the DOM.

---

## Question 2
<!-- meta: {"type":"single","points":1} -->
Which of these is a common memory leak?

- [ ] A function that returns a new object
- [x] A `setInterval` that is never cleared
- [ ] A local variable that goes out of scope
- [ ] A `WeakMap` with object keys

*Explanation*: An uncleared interval keeps running and retains its callback scope. Local variables and weak keys can be collected.

---

## Question 3
<!-- meta: {"type":"true-false","points":1} -->
A `WeakMap` key prevents the key object from being garbage collected.

- [ ] True
- [x] False

*Explanation*: WeakMap keys are weakly held. If no other reference to the key exists, the key and its entry can be collected.

---

## Question 4
<!-- meta: {"type":"true-false","points":1} -->
You should optimize code first and measure performance later.

- [ ] True
- [x] False

*Explanation*: Measure first. Without a profile or timing, you may optimize code that is not the bottleneck.

---

## Question 5
<!-- meta: {"type":"multiple","points":2} -->
Which actions help prevent memory leaks? Select all that apply.

- [x] Clearing intervals with `clearInterval`
- [x] Removing event listeners with `removeEventListener`
- [x] Using a `WeakMap` for object-keyed caches that should not retain keys
- [ ] Storing every removed DOM node in a global array

*Explanation*: Timers and listeners need explicit cleanup, and weak collections avoid retaining object keys. Storing removed nodes in a global array keeps them alive.

---

## Question 6
<!-- meta: {"type":"single","points":1} -->
Which DevTools panel is used to capture and compare heap snapshots?

- [ ] Elements
- [ ] Network
- [x] Memory
- [ ] Sources

*Explanation*: The Memory panel provides heap snapshots, allocation timelines, and sampling.

---

## Question 7
<!-- meta: {"type":"single","points":1} -->
What does `performance.now()` return?

- [ ] The current date and time as a string
- [x] A high-resolution timestamp in milliseconds
- [ ] The number of CPU cycles
- [ ] The page load time only

*Explanation*: performance.now() returns a high-resolution timestamp measured in milliseconds, useful for elapsed-time calculations.

---

## Question 8
<!-- meta: {"type":"single","points":1} -->
A returned closure reads one property from a large array. Why can the array stay in memory?

- [ ] Arrays are always permanent
- [x] The closure keeps a reference to the array
- [ ] The garbage collector ignores arrays
- [ ] The array is a global variable

*Explanation*: The closure captures the array binding, so the array remains reachable as long as the closure exists, even if it only uses one property.
