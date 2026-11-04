---
id: "py-quiz-variables-and-data-types"
type: "quiz"
title: "Variables & Data Types Knowledge Check"
moduleId: "py-mod-02-variables-and-data-types"
order: 9
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
passingScorePercent: 80
shuffleQuestions: true
shuffleOptions: true
tags: ["python", "variables", "types", "quiz"]
---

# Questions

## Question 1
<!-- meta: {"type":"single","points":1} -->
Which name is a valid Python variable name?

- [x] `user_name`
- [ ] `2nd_place`
- [ ] `user-name`
- [ ] `class`

*Explanation*: A name can contain letters, digits, and underscores, but it cannot start with a digit, contain a hyphen, or be a keyword such as class.

---

## Question 2
<!-- meta: {"type":"code-output","points":1} -->
What does this code print?

```python
x = 5
y = x
x = 9
print(y)
```

- [x] `5`
- [ ] `9`
- [ ] `None`
- [ ] `x`

*Explanation*: y refers to the integer 5. Rebinding x to 9 does not change y.

---

## Question 3
<!-- meta: {"type":"code-output","points":1} -->
What does this code print?

```python
print(0.1 + 0.2)
```

- [x] `0.30000000000000004`
- [ ] `0.3`
- [ ] `3`
- [ ] `0.0`

*Explanation*: Binary floating-point cannot represent 0.1 and 0.2 exactly, so their sum is very close to but not exactly 0.3.

---

## Question 4
<!-- meta: {"type":"true-false","points":1} -->
Strings in Python are immutable.

- [x] True
- [ ] False

*Explanation*: You cannot change a character in place. String methods return new strings, and you can rebind a variable to a new string.

---

## Question 5
<!-- meta: {"type":"code-output","points":1} -->
What does this code print?

```python
text = "Python"
print(text[1:4])
```

- [x] `yth`
- [ ] `ytho`
- [ ] `Pyt`
- [ ] `Python`

*Explanation*: The slice starts at index 1 and stops before index 4, so it returns the characters at indexes 1, 2, and 3.

---

## Question 6
<!-- meta: {"type":"single","points":1} -->
What happens when you run `int("3.5")`?

- [ ] It returns `3`.
- [ ] It returns `3.5`.
- [x] It raises `ValueError`.
- [ ] It returns `0`.

*Explanation*: int() accepts integer text, not text with a decimal point. Use float("3.5") first if you need a numeric value.

---

## Question 7
<!-- meta: {"type":"multiple","points":2} -->
Which values are falsy? Select all that apply.

- [x] `0`
- [x] `""`
- [x] `None`
- [ ] `"False"`

*Explanation*: Zero, an empty string, and None are falsy. The non-empty string "False" is truthy because it contains characters.

---

## Question 8
<!-- meta: {"type":"code-output","points":1} -->
What does this code print?

```python
count = 3
print(f"Count: {count * 2}")
```

- [x] `Count: 6`
- [ ] `Count: 3`
- [ ] `Count: {count * 2}`
- [ ] `6`

*Explanation*: The f-string evaluates the expression inside the braces and inserts the result into the text.
