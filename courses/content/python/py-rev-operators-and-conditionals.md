---
id: "py-rev-operators-and-conditionals"
type: "review"
title: "Operators & Conditionals Quick Reference"
moduleId: "py-mod-03-operators-and-conditionals"
order: 8
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
covers: ["py-les-arithmetic-and-assignment-operators", "py-les-comparison-and-identity-operators", "py-les-logical-operators-and-ternary", "py-les-conditionals", "py-les-match-statement", "py-ws-comparison-playground", "py-lab-eligibility-checker"]
tags: ["python", "operators", "conditionals", "reference"]
---

# Quick Reference Summary

## Core Terminology / Formula Matrix
| Term / Command | Definition / Formula | Common Usage |
| :--- | :--- | :--- |
| `+ - * /` | Basic arithmetic; `/` returns a float | Calculations |
| `//` | Floor division, rounding down | Whole-number quotients |
| `%` | Remainder; sign follows the divisor | Leftovers and cycles |
| `**` | Exponentiation, right-associative | Powers |
| `divmod(a, b)` | Returns quotient and remainder together | Time and unit conversion |
| `+= -= *= /=` | Compound assignment | Updating a value |
| Precedence | Parentheses, `**`, unary signs, `* / // %`, `+ -` | Evaluating expressions |
| `== !=` | Equality and inequality | Comparing values |
| `< > <= >=` | Ordering comparisons | Ranges and thresholds |
| Chained comparison | `0 < x < 10` means both comparisons | Range checks |
| `is` / `is not` | Identity comparison | Checking for `None` |
| `in` / `not in` | Substring membership for strings | Text searches |
| `and` | Returns first falsy operand or last operand | Combining conditions |
| `or` | Returns first truthy operand or last operand | Defaults and alternatives |
| `not` | Returns a boolean | Negating a condition |
| Short-circuit | Stops when the result is known | Avoiding unnecessary work |
| Conditional expression | `a if condition else b` | Choosing between two values |
| `if` / `elif` / `else` | Runs the first true branch | Multi-way decisions |
| `match` / `case` | Dispatches on patterns | Value-based branching |
| `case _:` | Wildcard pattern, usually last | Default match branch |
| Guard | `case pattern if condition:` | Extra condition on a case |

## Key Concepts Comparison
- **`==` vs. `is`**: `==` compares values; `is` compares object identity. Use `is None` for `None` and `==` for ordinary values.
- **`/` vs. `//`**: `/` returns a float exact quotient; `//` returns the floor as an integer. For negatives, floor division goes down: `-17 // 5` is `-4`.
- **`and`/`or` vs. `not`**: `and` and `or` return operands and short-circuit. `not` always returns `True` or `False`.
- **`elif` vs. separate `if`**: `elif` forms one mutually exclusive chain; separate `if` statements are independent and can all run.
- **`if` vs. `match`**: `if` handles ranges and complex conditions; `match` dispatches cleanly on literal values, alternatives, and guards.
- **Flooring vs. truncation**: `//` floors toward negative infinity. `int()` on a float truncates toward zero. `-17 // 5` is `-4`, while `int(-3.9)` is `-3`.
- **Match vs. C-style switch**: Python's `match` does not fall through. Only the first matching case runs.

## Critical Syntax / Templates
```python
# Arithmetic and divmod
print(17 // 5)
print(17 % 5)
print(2 ** 5)
quotient, remainder = divmod(17, 5)

# Compound assignment
score = 10
score += 5

# Comparisons, chaining, identity, membership
print(5 == 5)
print(18 <= 25 < 65)
result = None
print(result is None)
print("yth" in "Python")

# Logical operators and conditional expression
print(0 or "fallback")
print(not 0)
status = "adult" if 20 >= 18 else "minor"

# if / elif / else
score = 72
if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
else:
    grade = "F"

# match / case with or-pattern, guard, and wildcard
command = "start"
match command:
    case "start" | "go":
        print("Starting")
    case "stop" | "halt":
        print("Stopping")
    case _:
        print("Unknown")

# Review only: bitwise operators
print(5 & 3)    # 1
print(5 | 2)    # 7
print(5 ^ 1)    # 4
print(1 << 3)   # 8

# Review only: walrus operator
text = "Python"
if (length := len(text)) > 0:
    print(f"Length: {length}")

# Review only: integer interning is an implementation detail
a = 256
b = 256
print(a == b)   # True
print(a is b)   # May be True in CPython; never rely on it
```
