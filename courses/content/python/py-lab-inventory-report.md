---
id: "py-lab-inventory-report"
type: "lab"
title: "Inventory Report"
moduleId: "py-mod-06-collections"
order: 8
difficulty: "beginner"
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 35
passingScorePercent: 100
revealSolutionAfterAttempts: 3
tags: ["python", "collections", "dictionaries", "inventory"]
---

# Objective

Summarize a list of inventory dictionaries. You will build a report dictionary, find low-stock items, and create a price lookup. All three functions return values so the tests can call them directly.

## Requirements
- Keep the provided `inventory` list unchanged.
- Define `build_report(inventory)`. It returns a dictionary with these keys:
  - `"total_items"`: the sum of all quantities
  - `"total_value"`: the sum of `price * quantity` for every item
  - `"names"`: the item names in their original order
  - `"most_expensive"`: the name of the item with the highest price
- Assume `inventory` is non-empty. If two items share the highest price, keep the first one.
- Define `low_stock(inventory, threshold=2)`. Return a list of names whose quantity is less than or equal to `threshold`, in original order.
- Define `price_map(inventory)`. Return a dictionary that maps each item name to its price.
- Use loops and dictionary operations from this module. Do not use comprehensions; Module 10 covers them.
- Return every result. Do not print inside the functions.

## Starter State / Workspace
```python
inventory = [
    {"name": "Keyboard", "price": 50, "quantity": 3},
    {"name": "Mouse", "price": 20, "quantity": 5},
    {"name": "Monitor", "price": 150, "quantity": 2},
]

# Define build_report, low_stock, and price_map below.
```

## Evaluation Tests
```json
[
  { "type": "function-returns", "call": "build_report(inventory)", "expected": {"total_items": 10, "total_value": 550, "names": ["Keyboard", "Mouse", "Monitor"], "most_expensive": "Monitor"}, "message": "The report should contain the correct totals, names, and most expensive item", "weight": 3, "required": true },
  { "type": "function-returns", "call": "build_report([{\"name\": \"Cable\", \"price\": 5, \"quantity\": 4}])", "expected": {"total_items": 4, "total_value": 20, "names": ["Cable"], "most_expensive": "Cable"}, "message": "build_report should work with a single item", "weight": 2, "required": true },
  { "type": "function-returns", "call": "low_stock(inventory)", "expected": ["Monitor"], "message": "The default threshold should find the monitor", "weight": 2, "required": true },
  { "type": "function-returns", "call": "low_stock(inventory, 3)", "expected": ["Keyboard", "Monitor"], "message": "A threshold of 3 should include the keyboard and monitor", "required": true },
  { "type": "function-returns", "call": "low_stock(inventory, 0)", "expected": [], "message": "A threshold of 0 should return an empty list", "required": true },
  { "type": "function-returns", "call": "price_map(inventory)", "expected": {"Keyboard": 50, "Mouse": 20, "Monitor": 150}, "message": "price_map should map every name to its price", "weight": 2, "required": true },
  { "type": "code-contains", "value": "def build_report", "message": "Define the build_report function", "required": true },
  { "type": "code-contains", "value": "def low_stock", "message": "Define the low_stock function", "required": true },
  { "type": "code-contains", "value": "def price_map", "message": "Define the price_map function", "required": true },
  { "type": "code-contains", "value": "for item in inventory", "message": "Loop over the inventory records", "required": true }
]
```

## Hints
> [!TIP]
> **Hint 1:** In `build_report`, use accumulators for `total_items`, `total_value`, and `names`. Initialize `most_expensive` and its price from the first record, then compare the rest.

> [!TIP]
> **Hint 2:** In `low_stock`, compare `item["quantity"] <= threshold` and append only `item["name"]` to the result list.

> [!TIP]
> **Hint 3:** In `price_map`, start with `prices = {}` and assign `prices[item["name"]] = item["price"]` inside the loop.

## Reference Solution
```python
inventory = [
    {"name": "Keyboard", "price": 50, "quantity": 3},
    {"name": "Mouse", "price": 20, "quantity": 5},
    {"name": "Monitor", "price": 150, "quantity": 2},
]


def build_report(inventory):
    """Return totals, names, and the most expensive item."""
    total_items = 0
    total_value = 0
    names = []
    most_expensive = inventory[0]["name"]
    highest_price = inventory[0]["price"]

    for item in inventory:
        total_items += item["quantity"]
        total_value += item["price"] * item["quantity"]
        names.append(item["name"])
        if item["price"] > highest_price:
            highest_price = item["price"]
            most_expensive = item["name"]

    return {
        "total_items": total_items,
        "total_value": total_value,
        "names": names,
        "most_expensive": most_expensive,
    }


def low_stock(inventory, threshold=2):
    """Return names of items at or below the quantity threshold."""
    names = []
    for item in inventory:
        if item["quantity"] <= threshold:
            names.append(item["name"])
    return names


def price_map(inventory):
    """Return a dictionary mapping each item name to its price."""
    prices = {}
    for item in inventory:
        prices[item["name"]] = item["price"]
    return prices
```
