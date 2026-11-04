---
id: "py-les-conditionals"
type: "theory"
title: "Conditionals: if, elif, and else"
moduleId: "py-mod-03-operators-and-conditionals"
order: 4
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 20
tags: ["python", "conditionals", "if", "elif", "else"]
---

# Concept Overview

An `if` statement runs a block of code only when a condition is truthy. `elif` adds another condition to test when the previous ones fail, and `else` provides a fallback when no condition matches.

Conditions are ordinary expressions. They can use comparisons, membership tests, logical operators, or simple truthiness.

## Key Principles & Frameworks

### The basic form

```python
temperature = 18

if temperature < 0:
    print("Freezing")
elif temperature < 15:
    print("Cold")
elif temperature < 25:
    print("Mild")
else:
    print("Warm")
```

Output:

```text
Mild
```

Python checks the conditions from top to bottom. The first true condition runs its block, and the rest of the chain is skipped. If none match, the `else` block runs.

The syntax rules are strict:

- The header line ends with a colon.
- The block below the header is indented by four spaces.
- Every line in the same block uses the same indentation.
- `elif` and `else` align with the `if`.

### Conditions and truthiness

A condition does not have to be a comparison. Python tests its truthiness:

```python
name = ""

if name:
    print(f"Hello, {name}")
else:
    print("Name is missing")
```

Output:

```text
Name is missing
```

An empty string is falsy. A non-empty string is truthy. The same rule applies to numbers and `None`.

Explicit comparisons are often clearer when a specific value matters:

```python
count = 0

if count == 0:
    print("Nothing to process")
else:
    print(f"Processing {count} items")
```

Output:

```text
Nothing to process
```

Use truthiness for "is there anything here?" checks. Use an explicit comparison when the exact value or type matters.

### elif versus separate if statements

`elif` is part of one decision chain. Separate `if` statements are independent decisions:

```python
score = 85

if score >= 70:
    print("C or better")

if score >= 80:
    print("B or better")
```

Output:

```text
C or better
B or better
```

Both conditions are true, so both blocks run. With `elif`, only the first matching block would run:

```python
score = 85

if score >= 90:
    print("A")
elif score >= 80:
    print("B")
elif score >= 70:
    print("C")
```

Output:

```text
B
```

Choose `elif` when the options are mutually exclusive. Choose separate `if` statements when several independent actions may apply.

### Nested conditions

An `if` statement can contain another `if` statement. Indent the inner block one more level:

```python
age = 20
has_ticket = True

if age >= 18:
    if has_ticket:
        print("Admitted")
    else:
        print("Buy a ticket")
else:
    print("Too young")
```

Output:

```text
Admitted
```

Nesting expresses a sequence of decisions: first check age, then check the ticket. For simple combinations, a logical operator is shorter:

```python
age = 20
has_ticket = True

if age >= 18 and has_ticket:
    print("Admitted")
```

Use nesting when the inner decision only makes sense after the outer one passes. Avoid deep nesting; flatten it with `elif`, combined conditions, or functions once Module 5 introduces them.

### Common patterns

A range check reads naturally with a chained comparison:

```python
age = 25

if 18 <= age < 65:
    print("Working age")
```

Output:

```text
Working age
```

A membership check works for strings:

```python
language = "Python"

if "py" in language.lower():
    print("Python-like name")
```

Output:

```text
Python-like name
```

The `.lower()` call returns a new string, and `in` checks the substring. Neither operation changes `language`.

## Common Pitfalls & Anti-Patterns
- **Using `=` instead of `==`**: `if score = 10:` is a syntax error. Use `==` for comparison.
- **Forgetting the colon**: Every `if`, `elif`, and `else` header ends with `:`.
- **Mixing indentation levels**: Use four spaces consistently and never mix tabs and spaces.
- **Expecting all `if` branches to run**: Only the first true branch in an `if`/`elif` chain runs.
- **Using separate `if` statements for mutually exclusive choices**: Use `elif` to make the exclusivity explicit.
- **Nesting too deeply**: Deep indentation is hard to follow. Combine conditions or restructure the logic.
- **Testing truthiness when a specific value matters**: `if count:` treats `0` as false; use `if count == 0:` when zero is meaningful.
- **Attaching `else` to the wrong `if`**: Indentation determines which `if` owns an `else`. Keep nesting shallow.
- **Repeating the same condition**: Store a result in a name or simplify the expression.

## Quick Summary
- `if` runs a block when its condition is truthy.
- `elif` tests another condition after earlier ones fail.
- `else` runs when no condition matches.
- Headers end with `:`, and blocks are indented four spaces.
- `elif` makes a single decision chain; separate `if` statements are independent.
- Nested conditions express dependent decisions; keep nesting shallow.
