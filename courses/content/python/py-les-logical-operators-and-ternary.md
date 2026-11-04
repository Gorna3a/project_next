---
id: "py-les-logical-operators-and-ternary"
type: "theory"
title: "Logical Operators and Conditional Expressions"
moduleId: "py-mod-03-operators-and-conditionals"
order: 3
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 20
tags: ["python", "operators", "logic", "short-circuit", "ternary"]
---

# Concept Overview

Logical operators combine conditions. `and` requires both sides to be truthy, `or` requires at least one, and `not` reverses a truth value. Python evaluates them from left to right and stops as soon as the result is known.

Python's `and` and `or` return one of their operands, not necessarily a boolean. That behavior is useful for defaults and compact expressions, but it can surprise you if you expect only `True` and `False`.

A conditional expression chooses between two values in one line. It is often called a ternary expression.

## Key Principles & Frameworks

### Truthiness review

Every value is truthy or falsy. `0`, `0.0`, `""`, and `None` are falsy; most other values are truthy. Logical operators use these rules.

### and

`and` returns the first falsy operand, or the last operand if every operand is truthy:

```python
print(True and False)
print(True and True)

print(0 and "yes")
print("a" and "b")
```

Output:

```text
False
True
0
b
```

The first pair contains booleans and returns booleans. The second pair returns the actual operands: `0` is falsy, so it is returned immediately; both strings are truthy, so the last one is returned.

### or

`or` returns the first truthy operand, or the last operand if every operand is falsy:

```python
print(True or False)
print(False or False)

print(0 or "fallback")
print("a" or "b")
```

Output:

```text
True
False
fallback
a
```

`0` is falsy, so `0 or "fallback"` moves to the second operand and returns it. `"a"` is truthy, so `"a" or "b"` returns `"a"` without evaluating `"b"`.

### not

`not` always returns a boolean:

```python
print(not True)
print(not False)
print(not 0)
print(not "text")
```

Output:

```text
False
True
True
False
```

### Short-circuit evaluation

Python stops evaluating as soon as the result is known:

- `and` stops at the first falsy operand.
- `or` stops at the first truthy operand.

```python
print(False and 1 / 0)
print(True or 1 / 0)
```

Output:

```text
False
True
```

The division by zero is never evaluated because the left operand already decides the result. This behavior is useful for guarding expensive or unsafe work, but the expression must still be readable. Module 5 shows how short-circuit evaluation interacts with function calls.

### Precedence

The relevant order, from highest to lowest, is:

1. Parentheses
2. Comparisons (`==`, `<`, `in`, and so on)
3. `not`
4. `and`
5. `or`

```python
print(not 0 and 1)
print(not (0 and 1))
```

Output:

```text
1
True
```

The first expression is `(not 0) and 1`, which becomes `True and 1`, so it returns `1`. The second is `not (0 and 1)`, which becomes `not 0`, so it returns `True`. Parentheses remove doubt.

### Conditional expressions

A conditional expression chooses one of two values:

```text
value_if_true if condition else value_if_false
```

```python
age = 20
status = "adult" if age >= 18 else "minor"
print(status)
```

Output:

```text
adult
```

The condition is evaluated first. If it is truthy, the expression before `if` is chosen; otherwise, the expression after `else` is chosen.

Conditional expressions are useful for short, simple choices:

```python
score = 72
result = "pass" if score >= 60 else "fail"
print(result)
```

Output:

```text
pass
```

For multi-step decisions, use an `if` statement. A conditional expression should fit comfortably on one line and remain easy to read.

## Common Pitfalls & Anti-Patterns
- **Assuming `and` and `or` always return booleans**: They return operands. Wrap the expression in `bool()` if you need a strict boolean.
- **Using `or` for defaults without considering valid falsy values**: `0 or 10` returns `10`, which may hide a legitimate zero.
- **Forgetting short-circuit order**: Only the left-to-right stopping rule is guaranteed. Put the condition that decides fastest on the left.
- **Relying on side effects in the skipped operand**: If an expression is not evaluated, its side effects do not happen.
- **Misreading `not` precedence**: `not a and b` means `(not a) and b`, not `not (a and b)`.
- **Nesting conditional expressions deeply**: They become hard to read. Use `if` statements instead.
- **Confusing the conditional expression with an `if` statement**: The expression produces a value; the statement controls a block.
- **Using `&` or `|` for logic**: Those are bitwise operators, not logical operators.

## Quick Summary
- `and` returns the first falsy operand or the last operand.
- `or` returns the first truthy operand or the last operand.
- `not` always returns `True` or `False`.
- `and` and `or` short-circuit from left to right.
- Precedence is comparisons, then `not`, then `and`, then `or`.
- A conditional expression chooses between two values with `value_if_true if condition else value_if_false`.
