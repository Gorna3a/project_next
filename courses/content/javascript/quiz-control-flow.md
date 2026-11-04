---
id: "quiz-control-flow"
type: "quiz"
title: "Control Flow Knowledge Check"
moduleId: "mod-05-control-flow"
order: 7
status: "draft"
language: "en"
lastUpdated: "2026-10-20"
passingScorePercent: 80
shuffleQuestions: true
shuffleOptions: true
tags: ["javascript","control-flow","quiz"]
---

# Questions

## Question 1
<!-- meta: {"type":"single","points":1} -->
Which loop always runs its body at least once?

- [ ] for
- [ ] while
- [x] do...while
- [ ] switch

*Explanation*: A do...while loop checks its condition after the body, so the first iteration always runs.

---

## Question 2
<!-- meta: {"type":"code-output","points":1} -->
What does this code print?

```js
for (let i = 0; i < 3; i++) {
  console.log(i);
}
```

- [x] 0 1 2 on separate lines
- [ ] 0 1 2 3 on separate lines
- [ ] 1 2 3 on separate lines
- [ ] 0 0 0 on separate lines

*Explanation*: The loop starts at 0 and stops before 3, so it prints 0, 1, and 2.

---

## Question 3
<!-- meta: {"type":"true-false","points":1} -->
In a nested loop, `break` exits only the innermost loop.

- [x] True
- [ ] False

*Explanation*: break leaves the nearest loop. The outer loop keeps running unless you add another condition or use a labeled break.

---

## Question 4
<!-- meta: {"type":"single","points":1} -->
What is missing from a `switch` case that causes execution to fall through into the next case?

- [ ] default
- [ ] continue
- [x] break
- [ ] return

*Explanation*: Without break, execution continues into the following cases after a match.

---

## Question 5
<!-- meta: {"type":"multiple","points":2} -->
Which of these are loop statements in JavaScript? Select all that apply.

- [x] for
- [x] while
- [x] do...while
- [ ] if

*Explanation*: for, while, and do...while repeat code. if is a conditional statement, not a loop.

---

## Question 6
<!-- meta: {"type":"code-output","points":1} -->
What does this code print?

```js
let total = 0;
for (let i = 1; i <= 4; i++) {
  total += i;
}
console.log(total);
```

- [ ] 4
- [ ] 6
- [x] 10
- [ ] 15

*Explanation*: The loop adds 1 + 2 + 3 + 4, which equals 10.

---

## Question 7
<!-- meta: {"type":"true-false","points":1} -->
Writing `if (x = 5)` compares `x` with 5.

- [ ] True
- [x] False

*Explanation*: A single equals sign assigns 5 to x and then tests the assigned value. Use === for comparison.

---

## Question 8
<!-- meta: {"type":"code-output","points":1} -->
What does this code print?

```js
for (let i = 1; i <= 5; i++) {
  if (i === 3) {
    continue;
  }
  console.log(i);
}
```

- [ ] 1 2 3 4 5 on separate lines
- [x] 1 2 4 5 on separate lines
- [ ] 1 2 on separate lines
- [ ] 3 on its own line

*Explanation*: continue skips the rest of the iteration when i is 3, so 3 is not printed.
