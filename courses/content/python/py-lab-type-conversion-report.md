---
id: "py-lab-type-conversion-report"
type: "lab"
title: "Type Conversion Report"
moduleId: "py-mod-02-variables-and-data-types"
order: 7
difficulty: "beginner"
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 25
passingScorePercent: 100
revealSolutionAfterAttempts: 3
tags: ["python", "types", "conversion", "f-strings"]
---

# Objective

Convert the three provided string constants to numbers, calculate a subtotal and a total, and print a five-line report. Each line must show both the value and its type.

The expected output is:

```text
Quantity: 12 (<class 'int'>)
Unit price: 3.5 (<class 'float'>)
Discount: 2 (<class 'int'>)
Subtotal: 42.0 (<class 'float'>)
Total: 40.0 (<class 'float'>)
```

## Requirements
- Convert `quantity_text` with `int()`, `price_text` with `float()`, and `discount_text` with `int()`.
- Calculate `subtotal` as quantity times unit price.
- Calculate `total` as subtotal minus discount.
- Use f-strings and `type()` to print each line in the format shown.
- Do not change the values stored in the three text constants.
- Do not use `input()`; the constants are the only input.

## Starter State / Workspace
```python
quantity_text = "12"
price_text = "3.5"
discount_text = "2"

# Convert the values, calculate the totals, and print the report.
```

## Evaluation Tests
```json
[
  { "type": "output-equals", "value": "Quantity: 12 (<class 'int'>)\nUnit price: 3.5 (<class 'float'>)\nDiscount: 2 (<class 'int'>)\nSubtotal: 42.0 (<class 'float'>)\nTotal: 40.0 (<class 'float'>)", "message": "The report should match the five expected lines", "weight": 3, "required": true },
  { "type": "output-contains", "value": "Subtotal: 42.0 (<class 'float'>)", "message": "The subtotal should be 42.0 and have type float", "required": true },
  { "type": "output-contains", "value": "Total: 40.0 (<class 'float'>)", "message": "The total should be 40.0 and have type float", "required": true },
  { "type": "code-contains", "value": "int(", "message": "Use int() to convert the whole-number text", "required": true },
  { "type": "code-contains", "value": "float(", "message": "Use float() to convert the decimal text", "required": true },
  { "type": "code-contains", "value": "type(", "message": "Show each value's type in the report", "required": true }
]
```

## Hints
> [!TIP]
> **Hint 1:** `int()` handles whole-number text, and `float()` handles decimal text. Convert each constant before doing arithmetic.

> [!TIP]
> **Hint 2:** Calculate the subtotal first, then subtract the discount to get the total. Keeping the steps separate makes the report easier to check.

> [!TIP]
> **Hint 3:** Each f-string can show a value and its type with `{value} ({type(value)})`. Match the labels and punctuation in the expected output.

## Reference Solution
```python
quantity_text = "12"
price_text = "3.5"
discount_text = "2"

quantity = int(quantity_text)
price = float(price_text)
discount = int(discount_text)

subtotal = quantity * price
total = subtotal - discount

print(f"Quantity: {quantity} ({type(quantity)})")
print(f"Unit price: {price} ({type(price)})")
print(f"Discount: {discount} ({type(discount)})")
print(f"Subtotal: {subtotal} ({type(subtotal)})")
print(f"Total: {total} ({type(total)})")
```
