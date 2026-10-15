---
id: "quiz-data-types"
type: "quiz"
title: "Data Types & Conversion Knowledge Check"
moduleId: "mod-03-data-types-and-conversion"
order: 8
status: "draft"
language: "en"
lastUpdated: "2026-10-15"
passingScorePercent: 80
shuffleQuestions: true
shuffleOptions: true
tags: ["javascript","data-types","quiz"]
---

# Questions

## Question 1
<!-- meta: {"type":"single","points":1} -->
What does typeof "hello" return?

- [ ] "text"
- [x] "string"
- [ ] "word"
- [ ] "character"

*Explanation*: typeof answers with the type as a lowercase string, so text values report "string".

---

## Question 2
<!-- meta: {"type":"code-output","points":1} -->
What does this code print?

```js
console.log(Number("42px"));
```

- [ ] 42
- [x] NaN
- [ ] "42px"
- [ ] 0

*Explanation*: Number() is strict: the whole string must be numeric or the result is NaN. parseInt("42px", 10) would give 42.

---

## Question 3
<!-- meta: {"type":"multiple","points":2} -->
Which of these values are falsy? Select all that apply.

- [x] 0
- [ ] "0"
- [x] ""
- [x] null
- [ ] "false"

*Explanation*: The falsy values include 0, the empty string, and null. Non-empty strings like "0" and "false" are truthy.

---

## Question 4
<!-- meta: {"type":"true-false","points":1} -->
A value of NaN is equal to itself.

- [ ] True
- [x] False

*Explanation*: NaN is never equal to anything, not even to itself; use Number.isNaN to detect it.

---

## Question 5
<!-- meta: {"type":"single","points":1} -->
Which call converts the text "42" into the number 42?

- [ ] String(42)
- [ ] Boolean("42")
- [ ] "42" + 0
- [x] Number("42")

*Explanation*: Number is the strict numeric converter. Boolean gives true, and String and + produce text.

---

## Question 6
<!-- meta: {"type":"true-false","points":1} -->
typeof null returns the string "object".

- [x] True
- [ ] False

*Explanation*: True. This is a historical bug that was kept for compatibility; compare against null directly instead.

---

## Question 7
<!-- meta: {"type":"code-output","points":1} -->
What does this code print?

```js
console.log("5" - 1);
```

- [ ] "51"
- [ ] NaN
- [x] 4
- [ ] "4"

*Explanation*: The minus operator forces numeric conversion, so "5" becomes 5 and the result is the number 4.

---

## Question 8
<!-- meta: {"type":"true-false","points":1} -->
The expression "5" + 1 produces the number 6.

- [ ] True
- [x] False

*Explanation*: False. With +, a string on either side means concatenation, so the result is the string "51".
