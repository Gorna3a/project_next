---
id: "py-ws-type-inspector"
type: "workshop"
title: "Build a Type Inspector"
moduleId: "py-mod-02-variables-and-data-types"
order: 6
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 40
tags: ["python", "types", "conversion", "f-strings"]
---

# Workshop Overview

You will build a script that inspects values, converts text to numbers, tests truthiness, and shows how conversions and mixed arithmetic change types. Each step adds a few lines to the same script, and the final output is a compact type report.

---

## Step 1: Inspect the starting values

### Instructions
Print one line for each of the five constants. Use an f-string and `type()` so each line follows this format exactly: `count: 12 (<class 'int'>)`. Use the names `count`, `price`, `label`, `active`, and `missing` as the labels.

### Hints
1. An f-string starts with `f` and places expressions inside braces.
2. `type(value)` returns the type object that appears after the value.
3. Put the value and its type in the same f-string.

### Starter State / Code
```python
count = 12
price = 4.5
label = "widget"
active = True
missing = None

# Print one inspection line per value.
```

### Solution State / Code
```python
count = 12
price = 4.5
label = "widget"
active = True
missing = None

print(f"count: {count} ({type(count)})")
print(f"price: {price} ({type(price)})")
print(f"label: {label} ({type(label)})")
print(f"active: {active} ({type(active)})")
print(f"missing: {missing} ({type(missing)})")
```

### Evaluation Tests
```json
[
  { "type": "output-equals", "value": "count: 12 (<class 'int'>)\nprice: 4.5 (<class 'float'>)\nlabel: widget (<class 'str'>)\nactive: True (<class 'bool'>)\nmissing: None (<class 'NoneType'>)", "message": "Print one type inspection line for each constant", "weight": 2, "required": true },
  { "type": "code-contains", "value": "type(", "message": "Use type() to inspect each value", "required": true },
  { "type": "output-contains", "value": "missing: None (<class 'NoneType'>)", "message": "Show the type of None correctly" }
]
```

---

## Step 2: Convert text to numbers

### Instructions
Keep the inspection lines. Convert `quantity_text` to an integer and `price_text` to a float. Print `Quantity plus five: 30` and `Price doubled: 9.0` using the converted values in f-strings.

### Hints
1. `int()` converts text that represents a whole number.
2. `float()` converts text that represents a decimal number.
3. Perform the arithmetic inside the f-string braces or store the results in names first.

### Starter State / Code
```python
count = 12
price = 4.5
label = "widget"
active = True
missing = None

print(f"count: {count} ({type(count)})")
print(f"price: {price} ({type(price)})")
print(f"label: {label} ({type(label)})")
print(f"active: {active} ({type(active)})")
print(f"missing: {missing} ({type(missing)})")

quantity_text = "25"
price_text = "4.5"

# Convert and print the two results.
```

### Solution State / Code
```python
count = 12
price = 4.5
label = "widget"
active = True
missing = None

print(f"count: {count} ({type(count)})")
print(f"price: {price} ({type(price)})")
print(f"label: {label} ({type(label)})")
print(f"active: {active} ({type(active)})")
print(f"missing: {missing} ({type(missing)})")

quantity_text = "25"
price_text = "4.5"

quantity = int(quantity_text)
unit_price = float(price_text)

print(f"Quantity plus five: {quantity + 5}")
print(f"Price doubled: {unit_price * 2}")
```

### Evaluation Tests
```json
[
  { "type": "output-contains", "value": "Quantity plus five: 30", "message": "Convert the quantity to an int before adding five", "required": true },
  { "type": "output-contains", "value": "Price doubled: 9.0", "message": "Convert the price to a float before doubling it", "required": true },
  { "type": "code-contains", "value": "int(", "message": "Use int() for the quantity", "required": true },
  { "type": "code-contains", "value": "float(", "message": "Use float() for the price", "required": true }
]
```

---

## Step 3: Test truthiness

### Instructions
Keep the previous lines. Add four lines that show the truthiness of `0`, an empty string, the string `"False"`, and `None`. Use `bool()` and these exact labels: `bool(0)`, `bool(empty text)`, `bool(false text)`, and `bool(None)`.

### Hints
1. Store the empty string and the text `"False"` in variables so the f-string stays readable.
2. `bool()` returns `True` or `False` using Python's truthiness rules.
3. A non-empty string is truthy even when its text looks false.

### Starter State / Code
```python
count = 12
price = 4.5
label = "widget"
active = True
missing = None

print(f"count: {count} ({type(count)})")
print(f"price: {price} ({type(price)})")
print(f"label: {label} ({type(label)})")
print(f"active: {active} ({type(active)})")
print(f"missing: {missing} ({type(missing)})")

quantity_text = "25"
price_text = "4.5"

quantity = int(quantity_text)
unit_price = float(price_text)

print(f"Quantity plus five: {quantity + 5}")
print(f"Price doubled: {unit_price * 2}")

empty_text = ""
false_text = "False"

# Print the four truthiness lines.
```

### Solution State / Code
```python
count = 12
price = 4.5
label = "widget"
active = True
missing = None

print(f"count: {count} ({type(count)})")
print(f"price: {price} ({type(price)})")
print(f"label: {label} ({type(label)})")
print(f"active: {active} ({type(active)})")
print(f"missing: {missing} ({type(missing)})")

quantity_text = "25"
price_text = "4.5"

quantity = int(quantity_text)
unit_price = float(price_text)

print(f"Quantity plus five: {quantity + 5}")
print(f"Price doubled: {unit_price * 2}")

empty_text = ""
false_text = "False"

print(f"bool(0): {bool(0)}")
print(f"bool(empty text): {bool(empty_text)}")
print(f"bool(false text): {bool(false_text)}")
print(f"bool(None): {bool(None)}")
```

### Evaluation Tests
```json
[
  { "type": "output-contains", "value": "bool(0): False", "message": "Zero is falsy", "required": true },
  { "type": "output-contains", "value": "bool(empty text): False", "message": "An empty string is falsy", "required": true },
  { "type": "output-contains", "value": "bool(false text): True", "message": "The non-empty string is truthy", "required": true },
  { "type": "output-contains", "value": "bool(None): False", "message": "None is falsy" }
]
```

---

## Step 4: Show str() and implicit conversion

### Instructions
Keep the previous lines. Convert the integer `42` to text with `str()` and store the result. Compute `1 + 2.5` and store the result. Print `Number as text: 42 (<class 'str'>)` and `Mixed total: 3.5 (<class 'float'>)` using f-strings and `type()`.

### Hints
1. `str(42)` returns a new string; it does not change the integer.
2. Mixing an integer and a float produces a float through implicit conversion.
3. Show both the value and `type(value)` on each line.

### Starter State / Code
```python
count = 12
price = 4.5
label = "widget"
active = True
missing = None

print(f"count: {count} ({type(count)})")
print(f"price: {price} ({type(price)})")
print(f"label: {label} ({type(label)})")
print(f"active: {active} ({type(active)})")
print(f"missing: {missing} ({type(missing)})")

quantity_text = "25"
price_text = "4.5"

quantity = int(quantity_text)
unit_price = float(price_text)

print(f"Quantity plus five: {quantity + 5}")
print(f"Price doubled: {unit_price * 2}")

empty_text = ""
false_text = "False"

print(f"bool(0): {bool(0)}")
print(f"bool(empty text): {bool(empty_text)}")
print(f"bool(false text): {bool(false_text)}")
print(f"bool(None): {bool(None)}")

# Add the final two lines.
```

### Solution State / Code
```python
count = 12
price = 4.5
label = "widget"
active = True
missing = None

print(f"count: {count} ({type(count)})")
print(f"price: {price} ({type(price)})")
print(f"label: {label} ({type(label)})")
print(f"active: {active} ({type(active)})")
print(f"missing: {missing} ({type(missing)})")

quantity_text = "25"
price_text = "4.5"

quantity = int(quantity_text)
unit_price = float(price_text)

print(f"Quantity plus five: {quantity + 5}")
print(f"Price doubled: {unit_price * 2}")

empty_text = ""
false_text = "False"

print(f"bool(0): {bool(0)}")
print(f"bool(empty text): {bool(empty_text)}")
print(f"bool(false text): {bool(false_text)}")
print(f"bool(None): {bool(None)}")

number_text = str(42)
mixed_total = 1 + 2.5

print(f"Number as text: {number_text} ({type(number_text)})")
print(f"Mixed total: {mixed_total} ({type(mixed_total)})")
```

### Evaluation Tests
```json
[
  { "type": "output-equals", "value": "count: 12 (<class 'int'>)\nprice: 4.5 (<class 'float'>)\nlabel: widget (<class 'str'>)\nactive: True (<class 'bool'>)\nmissing: None (<class 'NoneType'>)\nQuantity plus five: 30\nPrice doubled: 9.0\nbool(0): False\nbool(empty text): False\nbool(false text): True\nbool(None): False\nNumber as text: 42 (<class 'str'>)\nMixed total: 3.5 (<class 'float'>)", "message": "The final script should print all thirteen lines exactly", "weight": 3, "required": true },
  { "type": "code-contains", "value": "str(", "message": "Use str() to convert the integer to text", "required": true },
  { "type": "output-contains", "value": "Mixed total: 3.5 (<class 'float'>)", "message": "Show the float result of mixing an int and a float", "required": true }
]
```
