---
id: "py-ws-comparison-playground"
type: "workshop"
title: "Comparison Playground"
moduleId: "py-mod-03-operators-and-conditionals"
order: 6
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 45
tags: ["python", "operators", "comparisons", "logic", "match"]
---

# Workshop Overview

You will build a script that prints the results of arithmetic, comparisons, and logical expressions, then uses those results in an `if`/`elif` chain and a `match` statement. Each step adds a section to the same script so you can compare the operators side by side.

---

## Step 1: Arithmetic check

### Instructions
Use `a = 17` and `b = 5` to print the ten arithmetic lines shown in the solution. Include the four basic operations, floor division, remainder, exponentiation, `divmod`, and the negative floor and remainder results.

### Hints
1. Use f-strings to insert the values and results into labels.
2. `divmod(a, b)` returns two values; unpack them into `quotient` and `remainder`.
3. For the negative results, use `-a // b` and `-a % b`.

### Starter State / Code
```python
a = 17
b = 5

# Print the arithmetic results below.
```

### Solution State / Code
```python
a = 17
b = 5

print(f"{a} + {b} = {a + b}")
print(f"{a} - {b} = {a - b}")
print(f"{a} * {b} = {a * b}")
print(f"{a} / {b} = {a / b}")
print(f"{a} // {b} = {a // b}")
print(f"{a} % {b} = {a % b}")
print(f"2 ** 5 = {2 ** 5}")

quotient, remainder = divmod(a, b)
print(f"divmod({a}, {b}) = ({quotient}, {remainder})")

print(f"-{a} // {b} = {-a // b}")
print(f"-{a} % {b} = {-a % b}")
```

### Evaluation Tests
```json
[
  { "type": "output-equals", "value": "17 + 5 = 22\n17 - 5 = 12\n17 * 5 = 85\n17 / 5 = 3.4\n17 // 5 = 3\n17 % 5 = 2\n2 ** 5 = 32\ndivmod(17, 5) = (3, 2)\n-17 // 5 = -4\n-17 % 5 = 3", "message": "Print all ten arithmetic results exactly", "weight": 2, "required": true },
  { "type": "output-contains", "value": "-17 // 5 = -4", "message": "Floor division rounds down for negative numbers", "required": true },
  { "type": "output-contains", "value": "divmod(17, 5) = (3, 2)", "message": "Unpack and print the divmod result", "required": true },
  { "type": "code-contains", "value": "//", "message": "Use floor division", "required": true },
  { "type": "code-contains", "value": "**", "message": "Use exponentiation" }
]
```

---

## Step 2: Compare values

### Instructions
Keep the arithmetic output. Add the ten comparison lines shown in the solution. Include equality, inequality, ordering, a chained comparison, string ordering, string membership, numeric equality across types, and text versus number equality.

### Hints
1. Comparison expressions produce `True` or `False`; embed them directly in an f-string.
2. A chained comparison such as `18 <= age < 65` checks both bounds.
3. Store the strings in variables so the labels stay readable.

### Starter State / Code
```python
a = 17
b = 5

print(f"{a} + {b} = {a + b}")
print(f"{a} - {b} = {a - b}")
print(f"{a} * {b} = {a * b}")
print(f"{a} / {b} = {a / b}")
print(f"{a} // {b} = {a // b}")
print(f"{a} % {b} = {a % b}")
print(f"2 ** 5 = {2 ** 5}")

quotient, remainder = divmod(a, b)
print(f"divmod({a}, {b}) = ({quotient}, {remainder})")

print(f"-{a} // {b} = {-a // b}")
print(f"-{a} % {b} = {-a % b}")

# Add the comparison results below.
```

### Solution State / Code
```python
a = 17
b = 5

print(f"{a} + {b} = {a + b}")
print(f"{a} - {b} = {a - b}")
print(f"{a} * {b} = {a * b}")
print(f"{a} / {b} = {a / b}")
print(f"{a} // {b} = {a // b}")
print(f"{a} % {b} = {a % b}")
print(f"2 ** 5 = {2 ** 5}")

quotient, remainder = divmod(a, b)
print(f"divmod({a}, {b}) = ({quotient}, {remainder})")

print(f"-{a} // {b} = {-a // b}")
print(f"-{a} % {b} = {-a % b}")

print(f"5 == 5 -> {5 == 5}")
print(f"5 != 3 -> {5 != 3}")
print(f"3 < 5 -> {3 < 5}")
print(f"5 <= 5 -> {5 <= 5}")

age = 25
print(f"18 <= 25 < 65 -> {18 <= age < 65}")

left = "apple"
right = "banana"
print(f"apple < banana -> {left < right}")

text = "Python"
substring = "yth"
missing = "java"
print(f"substring in text -> {substring in text}")
print(f"missing not in text -> {missing not in text}")

print(f"1 == 1.0 -> {1 == 1.0}")
text_one = "1"
print(f"text_one == 1 -> {text_one == 1}")
```

### Evaluation Tests
```json
[
  { "type": "output-contains", "value": "5 == 5 -> True", "message": "Equality should produce True", "required": true },
  { "type": "output-contains", "value": "18 <= 25 < 65 -> True", "message": "The chained comparison should produce True", "required": true },
  { "type": "output-contains", "value": "missing not in text -> True", "message": "Use not in for the missing substring", "required": true },
  { "type": "output-contains", "value": "1 == 1.0 -> True", "message": "Numeric equality across int and float is True", "required": true },
  { "type": "output-contains", "value": "text_one == 1 -> False", "message": "Text and number are not equal", "required": true },
  { "type": "code-contains", "value": "<=", "message": "Use a comparison operator", "required": true }
]
```

---

## Step 3: Logical values

### Instructions
Keep the previous output. Add the nine logical lines shown in the solution. Include `and`, `or`, `not`, operand-returning examples, and the two short-circuit expressions.

### Hints
1. `and` and `or` return operands, so some labels end with a string or `0` instead of a boolean.
2. `False and 1 / 0` stops before the division because the left side is false.
3. `True or 1 / 0` stops before the division because the left side is true.

### Starter State / Code
```python
a = 17
b = 5

print(f"{a} + {b} = {a + b}")
print(f"{a} - {b} = {a - b}")
print(f"{a} * {b} = {a * b}")
print(f"{a} / {b} = {a / b}")
print(f"{a} // {b} = {a // b}")
print(f"{a} % {b} = {a % b}")
print(f"2 ** 5 = {2 ** 5}")

quotient, remainder = divmod(a, b)
print(f"divmod({a}, {b}) = ({quotient}, {remainder})")

print(f"-{a} // {b} = {-a // b}")
print(f"-{a} % {b} = {-a % b}")

print(f"5 == 5 -> {5 == 5}")
print(f"5 != 3 -> {5 != 3}")
print(f"3 < 5 -> {3 < 5}")
print(f"5 <= 5 -> {5 <= 5}")

age = 25
print(f"18 <= 25 < 65 -> {18 <= age < 65}")

left = "apple"
right = "banana"
print(f"apple < banana -> {left < right}")

text = "Python"
substring = "yth"
missing = "java"
print(f"substring in text -> {substring in text}")
print(f"missing not in text -> {missing not in text}")

print(f"1 == 1.0 -> {1 == 1.0}")
text_one = "1"
print(f"text_one == 1 -> {text_one == 1}")

# Add the logical results below.
```

### Solution State / Code
```python
a = 17
b = 5

print(f"{a} + {b} = {a + b}")
print(f"{a} - {b} = {a - b}")
print(f"{a} * {b} = {a * b}")
print(f"{a} / {b} = {a / b}")
print(f"{a} // {b} = {a // b}")
print(f"{a} % {b} = {a % b}")
print(f"2 ** 5 = {2 ** 5}")

quotient, remainder = divmod(a, b)
print(f"divmod({a}, {b}) = ({quotient}, {remainder})")

print(f"-{a} // {b} = {-a // b}")
print(f"-{a} % {b} = {-a % b}")

print(f"5 == 5 -> {5 == 5}")
print(f"5 != 3 -> {5 != 3}")
print(f"3 < 5 -> {3 < 5}")
print(f"5 <= 5 -> {5 <= 5}")

age = 25
print(f"18 <= 25 < 65 -> {18 <= age < 65}")

left = "apple"
right = "banana"
print(f"apple < banana -> {left < right}")

text = "Python"
substring = "yth"
missing = "java"
print(f"substring in text -> {substring in text}")
print(f"missing not in text -> {missing not in text}")

print(f"1 == 1.0 -> {1 == 1.0}")
text_one = "1"
print(f"text_one == 1 -> {text_one == 1}")

print(f"True and False -> {True and False}")
print(f"True or False -> {True or False}")
print(f"not True -> {not True}")
print(f'0 and "yes" -> {0 and "yes"}')
print(f'"a" and "b" -> {"a" and "b"}')
print(f'0 or "fallback" -> {0 or "fallback"}')
print(f'"a" or "b" -> {"a" or "b"}')
print(f"False and 1 / 0 -> {False and 1 / 0}")
print(f"True or 1 / 0 -> {True or 1 / 0}")
```

### Evaluation Tests
```json
[
  { "type": "output-contains", "value": "0 and \"yes\" -> 0", "message": "and returns the first falsy operand", "required": true },
  { "type": "output-contains", "value": "0 or \"fallback\" -> fallback", "message": "or returns the first truthy operand", "required": true },
  { "type": "output-contains", "value": "False and 1 / 0 -> False", "message": "and short-circuits before the division", "required": true },
  { "type": "output-contains", "value": "True or 1 / 0 -> True", "message": "or short-circuits before the division", "required": true },
  { "type": "code-contains", "value": " and ", "message": "Use the and operator", "required": true },
  { "type": "code-contains", "value": " or ", "message": "Use the or operator", "required": true },
  { "type": "code-contains", "value": "not ", "message": "Use the not operator" }
]
```

---

## Step 4: Classify and dispatch

### Instructions
Keep the previous output. Add an `if`/`elif`/`else` chain that assigns a grade for `score = 72`, then print `score 72: grade C`. Add a `match` statement for `command = "start"` that assigns an action and print `command start: Starting`. Include cases for `"start" | "go"`, `"stop" | "halt"`, and a wildcard.

### Hints
1. Order the grade checks from highest to lowest so the first matching branch wins.
2. Use `elif` so only one grade branch runs.
3. Put `case _:` last in the match statement.

### Starter State / Code
```python
a = 17
b = 5

print(f"{a} + {b} = {a + b}")
print(f"{a} - {b} = {a - b}")
print(f"{a} * {b} = {a * b}")
print(f"{a} / {b} = {a / b}")
print(f"{a} // {b} = {a // b}")
print(f"{a} % {b} = {a % b}")
print(f"2 ** 5 = {2 ** 5}")

quotient, remainder = divmod(a, b)
print(f"divmod({a}, {b}) = ({quotient}, {remainder})")

print(f"-{a} // {b} = {-a // b}")
print(f"-{a} % {b} = {-a % b}")

print(f"5 == 5 -> {5 == 5}")
print(f"5 != 3 -> {5 != 3}")
print(f"3 < 5 -> {3 < 5}")
print(f"5 <= 5 -> {5 <= 5}")

age = 25
print(f"18 <= 25 < 65 -> {18 <= age < 65}")

left = "apple"
right = "banana"
print(f"apple < banana -> {left < right}")

text = "Python"
substring = "yth"
missing = "java"
print(f"substring in text -> {substring in text}")
print(f"missing not in text -> {missing not in text}")

print(f"1 == 1.0 -> {1 == 1.0}")
text_one = "1"
print(f"text_one == 1 -> {text_one == 1}")

print(f"True and False -> {True and False}")
print(f"True or False -> {True or False}")
print(f"not True -> {not True}")
print(f'0 and "yes" -> {0 and "yes"}')
print(f'"a" and "b" -> {"a" and "b"}')
print(f'0 or "fallback" -> {0 or "fallback"}')
print(f'"a" or "b" -> {"a" or "b"}')
print(f"False and 1 / 0 -> {False and 1 / 0}")
print(f"True or 1 / 0 -> {True or 1 / 0}")

# Add the grade and command decisions below.
```

### Solution State / Code
```python
a = 17
b = 5

print(f"{a} + {b} = {a + b}")
print(f"{a} - {b} = {a - b}")
print(f"{a} * {b} = {a * b}")
print(f"{a} / {b} = {a / b}")
print(f"{a} // {b} = {a // b}")
print(f"{a} % {b} = {a % b}")
print(f"2 ** 5 = {2 ** 5}")

quotient, remainder = divmod(a, b)
print(f"divmod({a}, {b}) = ({quotient}, {remainder})")

print(f"-{a} // {b} = {-a // b}")
print(f"-{a} % {b} = {-a % b}")

print(f"5 == 5 -> {5 == 5}")
print(f"5 != 3 -> {5 != 3}")
print(f"3 < 5 -> {3 < 5}")
print(f"5 <= 5 -> {5 <= 5}")

age = 25
print(f"18 <= 25 < 65 -> {18 <= age < 65}")

left = "apple"
right = "banana"
print(f"apple < banana -> {left < right}")

text = "Python"
substring = "yth"
missing = "java"
print(f"substring in text -> {substring in text}")
print(f"missing not in text -> {missing not in text}")

print(f"1 == 1.0 -> {1 == 1.0}")
text_one = "1"
print(f"text_one == 1 -> {text_one == 1}")

print(f"True and False -> {True and False}")
print(f"True or False -> {True or False}")
print(f"not True -> {not True}")
print(f'0 and "yes" -> {0 and "yes"}')
print(f'"a" and "b" -> {"a" and "b"}')
print(f'0 or "fallback" -> {0 or "fallback"}')
print(f'"a" or "b" -> {"a" or "b"}')
print(f"False and 1 / 0 -> {False and 1 / 0}")
print(f"True or 1 / 0 -> {True or 1 / 0}")

score = 72

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
else:
    grade = "F"

print(f"score {score}: grade {grade}")

command = "start"

match command:
    case "start" | "go":
        action = "Starting"
    case "stop" | "halt":
        action = "Stopping"
    case _:
        action = "Unknown"

print(f"command {command}: {action}")
```

### Evaluation Tests
```json
[
  { "type": "output-contains", "value": "score 72: grade C", "message": "The grade chain should select C for 72", "required": true },
  { "type": "output-contains", "value": "command start: Starting", "message": "The match statement should select Starting", "required": true },
  { "type": "code-contains", "value": "elif ", "message": "Use an elif chain for the grade", "required": true },
  { "type": "code-contains", "value": "match ", "message": "Use a match statement for the command", "required": true },
  { "type": "code-contains", "value": "case _:", "message": "Include a wildcard case" }
]
```
