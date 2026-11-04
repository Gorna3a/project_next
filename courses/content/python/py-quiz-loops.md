---
id: "py-quiz-loops"
type: "quiz"
title: "Loops Knowledge Check"
moduleId: "py-mod-04-loops"
order: 8
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
passingScorePercent: 80
shuffleQuestions: true
shuffleOptions: true
tags: ["python", "loops", "quiz"]
---

# Questions

## Question 1
<!-- meta: {"type":"single","points":1} -->
Which values does `range(1, 5)` produce?

- [x] `1, 2, 3, 4`
- [ ] `1, 2, 3, 4, 5`
- [ ] `0, 1, 2, 3, 4`
- [ ] `2, 3, 4, 5`

*Explanation*: The start value is included and the stop value is excluded. `range(1, 5)` produces four values: 1, 2, 3, and 4.

---

## Question 2
<!-- meta: {"type":"code-output","points":1} -->
What does this code print?

```python
total = 0
for number in range(1, 5):
    total += number
print(total)
```

- [x] `10`
- [ ] `15`
- [ ] `4`
- [ ] `5`

*Explanation*: The loop adds 1 + 2 + 3 + 4. The stop value 5 is excluded, so the total is 10.

---

## Question 3
<!-- meta: {"type":"true-false","points":1} -->
A `while` loop checks its condition before each iteration.

- [x] True
- [ ] False

*Explanation*: The condition is tested before the body runs. If it is false at the start, the body never runs.

---

## Question 4
<!-- meta: {"type":"code-output","points":1} -->
What does this code print?

```python
for number in range(1, 6):
    if number == 4:
        break
    print(number)
```

- [x] `1, 2, 3`
- [ ] `1, 2, 3, 4`
- [ ] `1, 2, 3, 4, 5`
- [ ] `4`

*Explanation*: The loop prints 1, 2, and 3. When number becomes 4, break exits the loop before the print runs.

---

## Question 5
<!-- meta: {"type":"code-output","points":1} -->
What does this code print?

```python
for number in range(1, 6):
    if number % 2 == 0:
        continue
    print(number)
```

- [x] `1, 3, 5`
- [ ] `2, 4`
- [ ] `1, 2, 3, 4, 5`
- [ ] `1, 3, 5, 6`

*Explanation*: Even numbers reach continue, which skips the rest of that iteration. Only the odd numbers 1, 3, and 5 are printed.

---

## Question 6
<!-- meta: {"type":"single","points":1} -->
When does a loop `else` block run?

- [x] When the loop finishes normally without executing `break`
- [ ] After every iteration of the loop
- [ ] Only when the loop body never runs
- [ ] Whenever `break` exits the loop

*Explanation*: The loop else runs after a normal finish. A break skips it, and an empty loop that never runs still finishes normally.

---

## Question 7
<!-- meta: {"type":"code-output","points":1} -->
What does this code print?

```python
count = 0
for row in range(3):
    for column in range(2):
        count += 1
print(count)
```

- [x] `6`
- [ ] `3`
- [ ] `5`
- [ ] `9`

*Explanation*: The outer loop runs 3 times and the inner loop runs 2 times per outer pass, so count increments 3 * 2 = 6 times.

---

## Question 8
<!-- meta: {"type":"multiple","points":2} -->
Which statements about loops are true? Select all that apply.

- [x] The stop value in `range` is excluded.
- [x] A `while` loop can run zero times.
- [x] `break` exits only the nearest enclosing loop.
- [ ] A loop `else` block runs after `break`.
- [ ] `range(5)` includes the value `5`.

*Explanation*: The stop value is exclusive, a while condition can be false immediately, and break leaves one loop. A loop else is skipped by break, and range(5) stops at 4.
