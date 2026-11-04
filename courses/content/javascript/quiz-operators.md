---
id: "quiz-operators"
type: "quiz"
title: "Operators & Comparison Knowledge Check"
moduleId: "mod-04-operators-and-comparison"
order: 8
status: "draft"
language: "en"
lastUpdated: "2026-10-20"
passingScorePercent: 80
shuffleQuestions: true
shuffleOptions: true
tags: ["javascript","operators","quiz"]
---

# Questions

## Question 1
<!-- meta: {"type":"single","points":1} -->
Which operator compares both type and value without coercion?

- [ ] ==
- [x] ===
- [ ] !=
- [ ] =

*Explanation*: === checks both type and value, so 5 and "5" are not equal. == would coerce first.

---

## Question 2
<!-- meta: {"type":"multiple","points":2} -->
Which of these expressions evaluate to true? Select all that apply.

- [x] 5 == "5"
- [ ] 5 === "5"
- [x] Object.is(NaN, NaN)
- [ ] NaN === NaN

*Explanation*: == coerces the string to a number, so 5 == "5" is true. Object.is treats NaN as equal to itself. === never coerces, and NaN is never === to itself.

---

## Question 3
<!-- meta: {"type":"true-false","points":1} -->
The expression `1 < 2 < 3` checks whether 2 is between 1 and 3.

- [ ] True
- [x] False

*Explanation*: Chained comparisons evaluate left to right: (1 < 2) becomes true, then true becomes 1, and 1 < 3 is true. Use 1 < 2 && 2 < 3 for a real range test.

---

## Question 4
<!-- meta: {"type":"code-output","points":1} -->
What does this code print?

```js
let x = 0;
console.log(x || 10);
console.log(x ?? 10);
```

- [ ] 0 10
- [ ] 10 10
- [x] 10 0
- [ ] 0 0

*Explanation*: || replaces any falsy value, so 0 becomes 10. ?? replaces only null or undefined, so 0 survives.

---

## Question 5
<!-- meta: {"type":"single","points":1} -->
What does `2 ** 3` return?

- [ ] 6
- [ ] 5
- [x] 8
- [ ] 9

*Explanation*: ** is exponentiation, so 2 raised to the power of 3 is 8.

---

## Question 6
<!-- meta: {"type":"true-false","points":1} -->
`typeof null` returns the string "null".

- [ ] True
- [x] False

*Explanation*: False. typeof null returns "object", a historical quirk. Compare directly with null instead.

---

## Question 7
<!-- meta: {"type":"code-output","points":1} -->
What does this code print?

```js
let n = 5;
console.log(++n, n++);
```

- [ ] 5 5
- [ ] 5 6
- [ ] 6 7
- [x] 6 6

*Explanation*: Prefix ++n changes n to 6 first and returns 6. Postfix n++ returns the current 6, then changes n to 7. So both printed values are 6.

---

## Question 8
<!-- meta: {"type":"single","points":1} -->
When does the `??` operator use its right-hand value?

- [ ] When the left side is any falsy value
- [x] When the left side is null or undefined
- [ ] When the left side is 0 or an empty string
- [ ] When the left side is false

*Explanation*: ?? is the nullish coalescing operator. It falls back only for null or undefined, leaving 0, "", and false in place.
