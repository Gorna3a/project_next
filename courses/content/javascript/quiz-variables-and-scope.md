---
id: "quiz-variables-and-scope"
type: "quiz"
title: "Variables & Scope Knowledge Check"
moduleId: "mod-02-variables-and-scope"
order: 8
status: "draft"
language: "en"
lastUpdated: "2026-10-04"
passingScorePercent: 80
shuffleQuestions: true
shuffleOptions: true
tags: ["javascript","variables","quiz"]
---

# Questions

## Question 1
<!-- meta: {"type":"single","points":1} -->
Which keyword declares a block-scoped variable that can be reassigned later?

- [ ] var
- [x] let
- [ ] const
- [ ] static

*Explanation*: let creates a block-scoped variable, and unlike const it allows reassignment.

---

## Question 2
<!-- meta: {"type":"single","points":1} -->
What happens when you assign a new value to a const variable?

- [ ] The old value is kept silently
- [ ] The variable becomes a let variable
- [x] A TypeError is thrown
- [ ] The program restarts

*Explanation*: Reassigning a const variable throws a TypeError at runtime.

---

## Question 3
<!-- meta: {"type":"multiple","points":2} -->
Which of these are legal JavaScript variable names? Select all that apply.

- [x] _count
- [ ] 2fast
- [x] $total
- [x] userName
- [ ] my-name

*Explanation*: Names may start with a letter, _ or $, and use camelCase. They cannot start with a digit or contain dashes.

---

## Question 4
<!-- meta: {"type":"true-false","points":1} -->
A variable declared with var inside a block is visible after the block ends.

- [x] True
- [ ] False

*Explanation*: True. var is function-scoped, so it leaks out of blocks, unlike let and const.

---

## Question 5
<!-- meta: {"type":"true-false","points":1} -->
You can reassign a let variable but not a const variable.

- [x] True
- [ ] False

*Explanation*: True. let allows reassignment while const throws a TypeError on reassignment.

---

## Question 6
<!-- meta: {"type":"single","points":1} -->
A let variable is declared inside an if block. Where can it be used?

- [ ] Anywhere in the program
- [ ] Anywhere after the block
- [x] Only inside that block
- [ ] Only on the next line

*Explanation*: let is block-scoped, so it exists only inside the block that declares it.

---

## Question 7
<!-- meta: {"type":"code-output","points":1} -->
What does this code print?

```js
var x = 1;
if (true) {
  var x = 2;
}
console.log(x);
```

- [ ] 1
- [x] 2
- [ ] undefined
- [ ] ReferenceError

*Explanation*: var ignores blocks, so the assignment inside the if changes the same variable to 2.

---

## Question 8
<!-- meta: {"type":"code-output","points":1} -->
What does this code print?

```js
console.log(score);
let score = 10;
```

- [ ] 10
- [ ] undefined
- [x] ReferenceError
- [ ] NaN

*Explanation*: score is in the temporal dead zone on line 1, so reading it throws a ReferenceError.
