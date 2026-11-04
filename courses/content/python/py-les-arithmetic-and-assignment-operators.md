---
id: "py-les-arithmetic-and-assignment-operators"
type: "theory"
title: "Arithmetic and Assignment Operators"
moduleId: "py-mod-03-operators-and-conditionals"
order: 1
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 20
tags: ["python", "operators", "arithmetic", "precedence"]
---

# Concept Overview

Arithmetic operators calculate new values from numbers. Assignment operators store a value in a name and can update an existing value in one step. Python's arithmetic set includes the four basic operations plus floor division, remainder, and exponentiation.

Most of the rules match everyday arithmetic. Two operators need extra care: `//` rounds down instead of truncating toward zero, and `%` follows the sign of the divisor.

## Key Principles & Frameworks

### The arithmetic operators

| Operator | Name | Example | Result |
| :--- | :--- | :--- | :--- |
| `+` | Addition | `17 + 5` | `22` |
| `-` | Subtraction | `17 - 5` | `12` |
| `*` | Multiplication | `17 * 5` | `85` |
| `/` | True division | `17 / 5` | `3.4` |
| `//` | Floor division | `17 // 5` | `3` |
| `%` | Remainder | `17 % 5` | `2` |
| `**` | Exponentiation | `2 ** 5` | `32` |

`/` always returns a float, even when the result is a whole number:

```python
print(8 / 2)
```

Output:

```text
4.0
```

`**` raises the left operand to the power on the right. It is right-associative, so `2 ** 3 ** 2` means `2 ** (3 ** 2)`, which is `2 ** 9`, or `512`.

### Floor division and remainders

Floor division returns the largest integer less than or equal to the exact quotient. For positive numbers it looks like ordinary division with the fractional part removed:

```python
print(17 // 5)
print(17 % 5)
```

Output:

```text
3
2
```

`17 // 5` is `3` because `3 * 5` is `15`, and `17 % 5` is `2` because `2` is left over.

Negative numbers reveal the difference between flooring and truncating:

```python
print(-17 // 5)
print(-17 % 5)
```

Output:

```text
-4
3
```

The exact quotient is `-3.4`. Flooring moves down to `-4`, not toward zero. The remainder is the value that satisfies `-17 == (-4 * 5) + 3`, so it is `3`.

The modulo result has the same sign as the divisor:

```python
print(7 % 3)
print(-7 % 3)
print(7 % -3)
```

Output:

```text
1
2
-2
```

Use `//` when you need a whole-number quotient and `%` when you need what is left over.

### The divmod function

`divmod(a, b)` returns both the floor quotient and the remainder in one call. The result holds two values, which you can unpack into two names:

```python
quotient, remainder = divmod(17, 5)

print(quotient)
print(remainder)
```

Output:

```text
3
2
```

The function is convenient when a calculation needs both parts, such as converting total minutes into hours and minutes.

### Operator precedence

Python evaluates operators in a defined order. The relevant levels, from highest to lowest, are:

1. Parentheses
2. Exponentiation `**`
3. Unary `+` and `-`
4. Multiplication, division, floor division, and remainder: `* / // %`
5. Addition and subtraction: `+ -`

Comparisons and logical operators have lower precedence and appear in the next lessons.

```python
print(2 + 3 * 4)
print((2 + 3) * 4)
print(-2 ** 2)
print((-2) ** 2)
```

Output:

```text
14
20
-4
4
```

`**` binds more tightly than unary minus, so `-2 ** 2` is `-(2 ** 2)`. Use parentheses when the intended grouping is not obvious. Parentheses also make code easier to review.

### Compound assignment

A compound assignment combines an operation with assignment:

```python
score = 10
score += 5
print(score)

score *= 2
print(score)
```

Output:

```text
15
30
```

The full set is `+=`, `-=`, `*=`, `/=`, `//=`, `%=`, and `**=`. Each one is shorthand for applying the operator and assigning the result:

```text
score += 5   is equivalent to   score = score + 5
```

The right-hand side is evaluated first. `score += 2 * 3` adds `6` to the current score.

### Division by zero

Division and remainder by zero are errors:

```python
# 10 / 0 raises ZeroDivisionError.
# 10 // 0 raises ZeroDivisionError.
# 10 % 0 raises ZeroDivisionError.
```

Module 8 covers how to handle these errors. Until then, make sure a divisor cannot be zero before the calculation runs.

## Common Pitfalls & Anti-Patterns
- **Expecting `//` to truncate toward zero**: It rounds down. `-17 // 5` is `-4`, not `-3`.
- **Assuming `%` is always positive**: The result follows the divisor's sign. `7 % -3` is `-2`.
- **Expecting `/` to return an integer**: It always returns a float.
- **Forgetting exponent precedence**: `-2 ** 2` is `-4`. Add parentheses when you mean `(-2) ** 2`.
- **Assuming `**` is left-associative**: It is right-associative. `2 ** 3 ** 2` is `512`, not `64`.
- **Dividing by zero**: `/`, `//`, and `%` all raise `ZeroDivisionError`.
- **Overusing compound assignment for clarity**: `x += 1` is clear; a long chain of updates may be easier to read as separate steps.
- **Ignoring parentheses**: They cost nothing and prevent precedence mistakes.

## Quick Summary
- `+`, `-`, `*`, `/`, `//`, `%`, and `**` are the arithmetic operators.
- `/` returns a float; `//` floors toward negative infinity.
- `%` returns the remainder and follows the divisor's sign.
- `divmod(a, b)` returns the quotient and remainder together.
- Parentheses, exponentiation, unary signs, multiplication group, then addition group determine precedence.
- Compound assignment updates a name with `+=`, `-=`, `*=`, `/=`, `//=`, `%=`, and `**=`.
