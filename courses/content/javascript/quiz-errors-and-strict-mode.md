---
id: "quiz-errors-and-strict-mode"
type: "quiz"
title: "Errors & Strict Mode Knowledge Check"
moduleId: "mod-08-errors-and-strict-mode"
order: 7
status: "draft"
language: "en"
lastUpdated: "2026-10-20"
passingScorePercent: 80
shuffleQuestions: true
shuffleOptions: true
tags: ["javascript","errors","strict-mode","quiz"]
---

# Questions

## Question 1
<!-- meta: {"type":"single","points":1} -->
Which block always runs, whether or not an error occurs?

- [ ] try
- [ ] catch
- [x] finally
- [ ] throw

*Explanation*: The finally block runs after try and catch on both the success and failure paths.

---

## Question 2
<!-- meta: {"type":"code-output","points":1} -->
What does this code print?

```js
try {
  throw new Error("boom");
} catch (error) {
  console.log(error.message);
} finally {
  console.log("done");
}
```

- [ ] boom
- [ ] done
- [x] boom, then done
- [ ] done, then boom

*Explanation*: The catch block prints the message, and the finally block always runs afterward.

---

## Question 3
<!-- meta: {"type":"true-false","points":1} -->
Throwing a string is better than throwing an `Error` object.

- [ ] True
- [x] False

*Explanation*: Error objects carry a name, message, and stack trace. Strings carry none of that diagnostic information.

---

## Question 4
<!-- meta: {"type":"single","points":1} -->
In strict mode, what happens when you assign to a variable that was never declared?

- [ ] It creates a global variable
- [x] It throws a ReferenceError
- [ ] It returns undefined
- [ ] It logs a warning

*Explanation*: Strict mode turns accidental global creation into a ReferenceError.

---

## Question 5
<!-- meta: {"type":"multiple","points":2} -->
Which of these are built-in `Error` subclasses? Select all that apply.

- [x] TypeError
- [x] RangeError
- [x] SyntaxError
- [ ] StringError

*Explanation*: TypeError, RangeError, and SyntaxError are built-in error types. StringError is not a standard JavaScript error.

---

## Question 6
<!-- meta: {"type":"code-output","points":1} -->
What does this code print?

```js
function check(n) {
  if (n < 0) {
    throw new RangeError("negative");
  }
  return n;
}

try {
  console.log(check(-1));
} catch (error) {
  console.log(error.name);
}
```

- [ ] negative
- [x] RangeError
- [ ] Error
- [ ] -1

*Explanation*: The thrown error is a RangeError, and error.name is "RangeError".

---

## Question 7
<!-- meta: {"type":"true-false","points":1} -->
A `return` inside `finally` can override a `return` from `try`.

- [x] True
- [ ] False

*Explanation*: A return in finally replaces any pending return or throw from try and catch.

---

## Question 8
<!-- meta: {"type":"code-output","points":1} -->
What does this code print?

```js
"use strict";
try {
  leakedValue = 5;
  console.log("assigned");
} catch (error) {
  console.log(error.name);
}
```

- [ ] assigned
- [x] ReferenceError
- [ ] TypeError
- [ ] 5

*Explanation*: Strict mode rejects the assignment to an undeclared variable, so the catch block prints the error name.
