---
id: "py-quiz-operators-and-conditionals"
type: "quiz"
title: "Operators & Conditionals Knowledge Check"
moduleId: "py-mod-03-operators-and-conditionals"
order: 9
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
passingScorePercent: 80
shuffleQuestions: true
shuffleOptions: true
tags: ["python", "operators", "conditionals", "quiz"]
---

# Questions

## Question 1
<!-- meta: {"type":"single","points":1} -->
What is the result of `17 // 5`?

- [x] `3`
- [ ] `3.4`
- [ ] `2`
- [ ] `4`

*Explanation*: Floor division returns the largest integer less than or equal to the exact quotient. The exact quotient is 3.4, so the floor is 3.

---

## Question 2
<!-- meta: {"type":"code-output","points":1} -->
What does this code print?

```python
print(-17 // 5)
```

- [x] `-4`
- [ ] `-3`
- [ ] `-3.4`
- [ ] `3`

*Explanation*: Floor division rounds down, not toward zero. The exact quotient is -3.4, and the floor is -4.

---

## Question 3
<!-- meta: {"type":"code-output","points":1} -->
What does this code print?

```python
print(17 % 5)
```

- [x] `2`
- [ ] `3`
- [ ] `3.4`
- [ ] `0`

*Explanation*: 17 divided by 5 is 3 with a remainder of 2. The modulo operator returns that remainder.

---

## Question 4
<!-- meta: {"type":"single","points":1} -->
What is the difference between `==` and `is`?

- [x] `==` compares values, while `is` compares object identity.
- [ ] `==` compares object identity, while `is` compares values.
- [ ] They are interchangeable for all values.
- [ ] `is` only works with strings.

*Explanation*: Equality checks whether values are equal. Identity checks whether two names refer to the same object. Use is None for None checks.

---

## Question 5
<!-- meta: {"type":"code-output","points":1} -->
What does this code print?

```python
print(0 or "fallback")
```

- [x] `fallback`
- [ ] `0`
- [ ] `True`
- [ ] `False`

*Explanation*: or returns the first truthy operand. Since 0 is falsy, it returns the next operand, the string "fallback".

---

## Question 6
<!-- meta: {"type":"true-false","points":1} -->
The `and` and `or` operators always return a boolean value.

- [ ] True
- [x] False

*Explanation*: and and or return one of their operands. For example, 0 or "fallback" returns the string. Use bool() if you need a strict boolean.

---

## Question 7
<!-- meta: {"type":"multiple","points":2} -->
Which statements about `match` are true? Select all that apply.

- [x] Only the first matching case runs.
- [x] `case _:` is a wildcard that matches any value.
- [x] A guard adds an `if` condition to a case.
- [ ] Execution falls through to the next case after a match.

*Explanation*: Python's match does not fall through. The wildcard matches anything and should usually be last, and guards add extra conditions to a case.

---

## Question 8
<!-- meta: {"type":"code-output","points":1} -->
What does this code print?

```python
age = 20
print("adult" if age >= 18 else "minor")
```

- [x] `adult`
- [ ] `minor`
- [ ] `True`
- [ ] `20`

*Explanation*: The condition is true, so the conditional expression chooses the value before if, which is "adult".
