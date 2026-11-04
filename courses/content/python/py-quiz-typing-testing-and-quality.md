---
id: "py-quiz-typing-testing-and-quality"
type: "quiz"
title: "Typing, Testing and Code Quality Knowledge Check"
moduleId: "py-mod-16-typing-testing-and-quality"
order: 10
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
passingScorePercent: 80
shuffleQuestions: true
shuffleOptions: true
tags: ["python", "typing", "testing", "quality", "quiz"]
---

# Questions

## Question 1
<!-- meta: {"type":"single","points":1} -->
What does a type hint guarantee at runtime?

- [ ] It prevents wrong-typed arguments at the call site
- [x] It states the expected type without changing runtime behavior
- [ ] It converts values to the annotated type automatically
- [ ] It raises `TypeError` for mismatched values

*Explanation*: Hints guide humans and static tools. Python does not enforce them when the program runs.

---

## Question 2
<!-- meta: {"type":"multiple","points":2} -->
Which statements about types and checkers are correct? Select all that apply.

- [x] `list[int]` describes a list whose items are integers
- [x] `X | None` describes a value that may be missing
- [x] `mypy` checks annotations without running the code
- [ ] `Any` is the strongest annotation because it allows every type
- [ ] `Optional[X]` means `X` with a default value

*Explanation*: Built-in generics name item types. The union form covers missing values. `mypy` and similar tools check statically. `Any` disables checking, and `Optional` is not about defaults.

---

## Question 3
<!-- meta: {"type":"true-false","points":1} -->
A formatter such as `black` is the same thing as a linter such as `ruff`.

- [ ] True
- [x] False

*Explanation*: A formatter rewrites layout for consistency. A linter reports suspicious patterns. They serve different roles.

---

## Question 4
<!-- meta: {"type":"code-output","points":1} -->
What does this code print?

```python
def average(numbers: list[int]) -> float:
    return sum(numbers) / len(numbers)

print(average([2, 4, 6]))
```

- [x] `4.0`
- [ ] `12`
- [ ] `4`
- [ ] It raises a type error

*Explanation*: The sum is 12 and the count is 3. Division gives the float `4.0`. The annotation does not affect the result.

---

## Question 5
<!-- meta: {"type":"single","points":1} -->
In `unittest`, `setUp` runs how many times per test method?

- [ ] Once for the whole class
- [x] Once before each test method
- [ ] Only when a test fails
- [ ] It never runs automatically

*Explanation*: `setUp` prepares fresh fixtures before every test, keeping tests independent.

---

## Question 6
<!-- meta: {"type":"multiple","points":2} -->
Which practices make tests deterministic and maintainable? Select all that apply.

- [x] Use fixed input values in every test
- [x] Test return values and observable behavior
- [x] Keep each test focused on one behavior
- [ ] Depend on the current time or random values
- [ ] Test internal implementation details

*Explanation*: Fixed values remove flakiness. Behavior tests survive refactors. Focused tests point to one failure. Time and randomness make tests flaky.

---

## Question 7
<!-- meta: {"type":"true-false","points":1} -->
Running `python -m doctest module.py` checks the examples inside docstrings.

- [x] True
- [ ] False

*Explanation*: `doctest` runs every `>>>` example and compares its output exactly. Examples must match byte for byte.

---

## Question 8
<!-- meta: {"type":"code-output","points":1} -->
What does this code print?

```python
def multiply_many(values: list[int]) -> int:
    result = 1
    for value in values:
        result *= value
    return result

print(multiply_many([2, 3, 4]))
print(multiply_many([]))
```

- [x] `24` then `1`
- [ ] `24` then `0`
- [ ] `9` then `1`
- [ ] `24` then `24`

*Explanation*: The loop multiplies 2, 3, and 4 for a product of 24. With no values, the starting product `1` is returned unchanged.
