---
id: "quiz-arrays-objects-json"
type: "quiz"
title: "Arrays, Objects & JSON Knowledge Check"
moduleId: "mod-07-arrays-objects-json"
order: 10
status: "draft"
language: "en"
lastUpdated: "2026-10-20"
passingScorePercent: 80
shuffleQuestions: true
shuffleOptions: true
tags: ["javascript","arrays","objects","json","quiz"]
---

# Questions

## Question 1
<!-- meta: {"type":"code-output","points":1} -->
What does this code print?

```js
const result = [1, 2, 3].map((n) => n * 2);
console.log(result);
```

- [ ] [1, 2, 3]
- [x] [2, 4, 6]
- [ ] [3, 6, 9]
- [ ] [2, 4]

*Explanation*: map returns a new array with each item transformed by the callback, so each number is doubled.

---

## Question 2
<!-- meta: {"type":"code-output","points":1} -->
What does this code print?

```js
const numbers = [10, 2, 1];
console.log(numbers.sort());
```

- [ ] [1, 2, 10]
- [x] [1, 10, 2]
- [ ] [10, 2, 1]
- [ ] [2, 1, 10]

*Explanation*: The default sort converts values to strings and compares them lexicographically, so "1", "10", and "2" appear in that order. Pass a numeric comparator for numeric order.

---

## Question 3
<!-- meta: {"type":"true-false","points":1} -->
`filter` changes the original array.

- [ ] True
- [x] False

*Explanation*: filter returns a new array and leaves the original unchanged.

---

## Question 4
<!-- meta: {"type":"multiple","points":2} -->
Which of these array methods mutate the original array? Select all that apply.

- [x] push
- [x] sort
- [ ] slice
- [x] splice

*Explanation*: push, sort, and splice change the original array. slice returns a copy.

---

## Question 5
<!-- meta: {"type":"single","points":1} -->
Which loop visits the values of an array directly?

- [ ] for...in
- [x] for...of
- [ ] switch
- [ ] while...of

*Explanation*: for...of visits the values of an iterable. for...in visits keys, which are string indexes on arrays.

---

## Question 6
<!-- meta: {"type":"code-output","points":1} -->
What does this code print?

```js
const user = { name: "Sam", age: 20 };
const copy = { ...user, age: 21 };
console.log(copy.age);
```

- [ ] 20
- [x] 21
- [ ] undefined
- [ ] "Sam"

*Explanation*: Spread copies the original properties, then the later age property overrides the copied value.

---

## Question 7
<!-- meta: {"type":"true-false","points":1} -->
`JSON.stringify` removes object properties whose value is `undefined`.

- [x] True
- [ ] False

*Explanation*: JSON has no undefined value, so those properties are omitted from the resulting text. Inside arrays, undefined becomes null.

---

## Question 8
<!-- meta: {"type":"code-output","points":1} -->
What does this code print?

```js
const numbers = [1, 2, 3, 4];
const result = numbers.reduce((sum, n) => sum + n, 10);
console.log(result);
```

- [ ] 10
- [ ] 14
- [x] 20
- [ ] 24

*Explanation*: reduce starts with 10, then adds 1 + 2 + 3 + 4, producing 20.
