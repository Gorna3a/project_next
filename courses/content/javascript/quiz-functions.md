---
id: "quiz-functions"
type: "quiz"
title: "Functions Knowledge Check"
moduleId: "mod-06-functions"
order: 9
status: "draft"
language: "en"
lastUpdated: "2026-10-20"
passingScorePercent: 80
shuffleQuestions: true
shuffleOptions: true
tags: ["javascript","functions","quiz"]
---

# Questions

## Question 1
<!-- meta: {"type":"single","points":1} -->
What does a function return if it reaches the end without a `return` statement?

- [ ] 0
- [ ] null
- [x] undefined
- [ ] an empty string

*Explanation*: A function without an explicit return returns undefined.

---

## Question 2
<!-- meta: {"type":"code-output","points":1} -->
What does this code print?

```js
function add(a, b) {
  return a + b;
}
console.log(add(2, 3));
```

- [ ] 23
- [x] 5
- [ ] undefined
- [ ] NaN

*Explanation*: The arguments 2 and 3 are added inside the function, and the result 5 is returned and printed.

---

## Question 3
<!-- meta: {"type":"true-false","points":1} -->
Arrow functions are hoisted like function declarations.

- [ ] True
- [x] False

*Explanation*: Arrow functions are expressions assigned to variables, so they are not available before the assignment line.

---

## Question 4
<!-- meta: {"type":"single","points":1} -->
Which parameter list gives `name` a default value of `"friend"`?

- [ ] `function greet(name)`
- [ ] `function greet("friend")`
- [x] `function greet(name = "friend")`
- [ ] `function greet(...name)`

*Explanation*: A default parameter uses = in the parameter list and applies when the argument is undefined.

---

## Question 5
<!-- meta: {"type":"multiple","points":2} -->
Which statements about rest parameters are true? Select all that apply.

- [x] They collect extra arguments into a list.
- [x] They must be the last parameter.
- [ ] They expand a list into separate arguments.
- [ ] They work only in arrow functions.

*Explanation*: Rest collects arguments and must come last. Expanding a list is spread, and rest works in both regular and arrow functions.

---

## Question 6
<!-- meta: {"type":"code-output","points":1} -->
What does this code print?

```js
const double = n => n * 2;
console.log(double(5));
```

- [ ] 5
- [x] 10
- [ ] undefined
- [ ] NaN

*Explanation*: A concise arrow body returns the expression automatically, so double(5) returns 10.

---

## Question 7
<!-- meta: {"type":"true-false","points":1} -->
A recursive function needs a base case to stop calling itself.

- [x] True
- [ ] False

*Explanation*: Without a base case, recursion continues until the call stack overflows.

---

## Question 8
<!-- meta: {"type":"code-output","points":1} -->
What does this code print?

```js
function factorial(n) {
  if (n <= 1) {
    return 1;
  }
  return n * factorial(n - 1);
}
console.log(factorial(4));
```

- [ ] 4
- [ ] 12
- [x] 24
- [ ] 120

*Explanation*: 4 × 3 × 2 × 1 = 24. The base case returns 1 when n is 1 or less.
