---
id: "py-quiz-functions"
type: "quiz"
title: "Functions Knowledge Check"
moduleId: "py-mod-05-functions"
order: 9
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
passingScorePercent: 80
shuffleQuestions: true
shuffleOptions: true
tags: ["python", "functions", "parameters", "scope", "quiz"]
---

# Questions

## Question 1
<!-- meta: {"type":"single","points":1} -->
What does a function return if it has no `return` statement and finishes normally?

- [x] `None`
- [ ] `0`
- [ ] An empty string
- [ ] It raises an error

*Explanation*: Python functions return None when they finish without executing a return statement.

---

## Question 2
<!-- meta: {"type":"code-output","points":1} -->
What does this code print?

```python
def add(a, b):
    return a + b

print(add(2, 3))
```

- [x] `5`
- [ ] `23`
- [ ] `None`
- [ ] `a + b`

*Explanation*: The arguments 2 and 3 are matched to a and b, and return sends their sum back to print.

---

## Question 3
<!-- meta: {"type":"code-output","points":1} -->
What does this code print?

```python
def show(value):
    print(value)

result = show(10)
print(result)
```

- [x] `10` then `None`
- [ ] `10` then `10`
- [ ] `None` then `10`
- [ ] `None` only

*Explanation*: show prints 10 but has no return statement, so result is None. The second print displays that None.

---

## Question 4
<!-- meta: {"type":"true-false","points":1} -->
Parameters are the names in a function definition, while arguments are the values supplied in a call.

- [x] True
- [ ] False

*Explanation*: Parameters receive arguments. For def greet(name):, name is the parameter; in greet("Sam"), "Sam" is the argument.

---

## Question 5
<!-- meta: {"type":"code-output","points":1} -->
What does this code print?

```python
def greet(name, greeting="Hello"):
    return f"{greeting}, {name}!"

print(greet("Sam", greeting="Hi"))
```

- [x] `Hi, Sam!`
- [ ] `Hello, Sam!`
- [ ] `Hi, name!`
- [ ] `Sam, Hi!`

*Explanation*: "Sam" is matched to name, and the keyword argument overrides the default greeting with "Hi".

---

## Question 6
<!-- meta: {"type":"code-output","points":1} -->
What does this code print?

```python
def total(*numbers):
    result = 0
    for number in numbers:
        result += number
    return result

print(total(1, 2, 3))
```

- [x] `6`
- [ ] `123`
- [ ] `0`
- [ ] `(1, 2, 3)`

*Explanation*: *numbers collects the three positional arguments into a tuple, and the loop adds them to produce 6.

---

## Question 7
<!-- meta: {"type":"code-output","points":1} -->
What does this code print?

```python
print(round(2.5))
print(sum(range(1, 4)))
```

- [x] `2` then `6`
- [ ] `3` then `6`
- [ ] `2` then `10`
- [ ] `3` then `10`

*Explanation*: round uses banker's rounding, so 2.5 goes to the nearest even integer 2. range(1, 4) produces 1, 2, and 3, which sum to 6.

---

## Question 8
<!-- meta: {"type":"multiple","points":2} -->
Which statements about functions are true? Select all that apply.

- [x] `*args` collects extra positional arguments into a tuple.
- [x] A bare `*` makes the following parameters keyword-only.
- [x] Assigning to a name inside a function creates a local unless `global` or `nonlocal` is declared.
- [ ] A mutable default value is recreated on every call.
- [ ] `sum` can add strings directly.

*Explanation*: *args collects positional values, a bare * forces keyword-only parameters, and local assignment shadows outer names unless declared otherwise. Mutable defaults are created once, and sum does not concatenate strings.
