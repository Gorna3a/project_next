---
id: "py-les-numbers"
type: "theory"
title: "Numbers: Integers, Floats, and Complex Values"
moduleId: "py-mod-02-variables-and-data-types"
order: 2
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 20
tags: ["python", "numbers", "int", "float", "precision"]
---

# Concept Overview

Python has three built-in numeric types: integers, floating-point numbers, and complex numbers. Integers represent whole numbers, floats represent numbers with a fractional part, and complex numbers represent values with a real and an imaginary part.

Most everyday programs use integers and floats. Complex numbers are less common, but they appear in engineering, scientific computing, and signal processing.

## Key Principles & Frameworks

### Integers

An integer is a whole number with no fractional part:

```python
count = 42
temperature = -5
zero = 0

print(count)
print(temperature)
print(zero)
```

Python integers have arbitrary precision. They can grow beyond the fixed-size limits of many other languages, so very large whole numbers remain exact. The tradeoff is that operations on enormous integers can be slower and use more memory.

Underscores can separate groups of digits in numeric literals to improve readability:

```python
population = 8_000_000_000
distance = 1_000_000

print(population)
print(distance)
```

The underscores are ignored by Python; the values are `8000000000` and `1000000`.

### Floats

A float represents a number with a decimal point or an exponent:

```python
price = 19.99
ratio = 0.5
large = 1.5e3

print(price)
print(ratio)
print(large)
```

`1.5e3` means `1.5` times `10` to the power `3`, so it prints as `1500.0`. A float can also be written with a trailing `.0`:

```python
whole_as_float = 3.0
print(whole_as_float)
```

Floats are stored in binary floating-point format. Many decimal fractions cannot be represented exactly. A well-known example:

```python
print(0.1 + 0.2)
```

Output:

```text
0.30000000000000004
```

The result is very close to `0.3`, but not exactly equal. This is not a Python bug; it is a property of binary floating-point arithmetic. For money or other exact decimal calculations, use the `decimal` module, which is introduced with the standard library in Module 7. When comparing floats, use a tolerance instead of exact equality.

### Complex numbers

A complex number has a real part and an imaginary part. Python writes the imaginary unit with `j`:

```python
value = 2 + 3j

print(value)
print(value.real)
print(value.imag)
```

Output:

```text
(2+3j)
2.0
3.0
```

The `.real` and `.imag` attributes return floats. Complex numbers support arithmetic, but most introductory programs do not need them.

### Basic arithmetic

The four basic operators are `+`, `-`, `*`, and `/`:

```python
print(7 + 2)
print(7 - 2)
print(7 * 2)
print(7 / 2)
```

Output:

```text
9
5
14
3.5
```

Division with `/` always returns a float, even when both operands are integers and the result is a whole number:

```python
print(8 / 2)
```

Output:

```text
4.0
```

Module 3 adds floor division, remainder, exponentiation, and compound assignment.

### Type mixing

When an integer and a float are combined, Python converts the integer to a float for the operation:

```python
total = 2 + 3.5
print(total)
```

Output:

```text
5.5
```

The result is a float. This implicit conversion is convenient, but it also means a calculation can produce `4.0` when you expected the integer `4`.

## Common Pitfalls & Anti-Patterns
- **Expecting `/` to return an integer**: It always returns a float. `8 / 2` is `4.0`.
- **Comparing floats for exact equality**: `0.1 + 0.2` is not exactly `0.3`. Use a tolerance or an exact decimal type.
- **Assuming floats are exact decimal values**: Binary floating-point cannot represent every decimal fraction.
- **Thinking integers overflow at a fixed size**: Python integers grow as needed, though very large values cost time and memory.
- **Confusing `1.5e3` with a string**: It is a numeric literal equal to `1500.0`.
- **Using a comma as a decimal separator**: `19,99` is not the number `19.99`. Use a period.
- **Assuming `3.0` and `3` are the same type**: They compare as equal numerically, but one is a float and one is an int.

## Quick Summary
- `int` stores whole numbers and supports arbitrary precision.
- `float` stores binary floating-point values and is not exact for every decimal.
- `complex` values use `j` for the imaginary part.
- Underscores make large numeric literals easier to read.
- `/` always returns a float; mixing an int and a float produces a float.
