---
id: "lab-inventory-report"
type: "lab"
title: "Inventory Report"
moduleId: "mod-07-arrays-objects-json"
order: 8
difficulty: "intermediate"
status: "draft"
language: "en"
lastUpdated: "2026-10-20"
estimatedMinutes: 35
passingScorePercent: 100
revealSolutionAfterAttempts: 3
tags: ["arrays","objects","json","reduce"]
---

# Objective

Build an inventory report from an array of product objects and return it as a JSON string. The report must include the total number of items, the total value, the product names sorted alphabetically, and the name of the most expensive product.

Use the `inventory` array in the starter code. Your `buildReport` function must work for any non-empty array of products with the same shape.

## Requirements
- Return a JSON string created with `JSON.stringify`
- Use `reduce` for the totals and the most expensive product
- Use `map` and `sort` for the sorted names
- Do not mutate the original inventory array
- Property order in the JSON must be: `totalItems`, `totalValue`, `names`, `mostExpensive`

## Starter State / Workspace
```js
const inventory = [
  { name: "Keyboard", price: 40, quantity: 3 },
  { name: "Mouse", price: 20, quantity: 5 },
  { name: "Monitor", price: 150, quantity: 1 },
];

// Define buildReport below
```

## Evaluation Tests
```json
[
  { "type": "function-returns", "call": "buildReport(inventory)", "expected": "{\"totalItems\":9,\"totalValue\":370,\"names\":[\"Keyboard\",\"Monitor\",\"Mouse\"],\"mostExpensive\":\"Monitor\"}", "message": "The report must contain the correct totals, sorted names, and most expensive product", "weight": 2, "required": true },
  { "type": "function-returns", "call": "buildReport([{ name: \"Cable\", price: 5, quantity: 2 }])", "expected": "{\"totalItems\":2,\"totalValue\":10,\"names\":[\"Cable\"],\"mostExpensive\":\"Cable\"}", "message": "buildReport should work for any non-empty inventory", "weight": 2, "required": true },
  { "type": "code-contains", "value": "JSON.stringify", "message": "Return the report as JSON with JSON.stringify" },
  { "type": "code-contains", "value": "reduce", "message": "Use reduce for the totals" },
  { "type": "code-contains", "value": "sort", "message": "Sort the product names alphabetically" }
]
```

## Hints
> [!TIP]
> **Hint 1:** Build a plain object with the four report fields, then pass it to `JSON.stringify`.

> [!TIP]
> **Hint 2:** `reduce` can compute both totals. For the most expensive product, compare each item's `price` with the current top item.

> [!TIP]
> **Hint 3:** `items.map((item) => item.name).sort()` gives the names in alphabetical order without changing the original objects.

## Reference Solution
```js
const inventory = [
  { name: "Keyboard", price: 40, quantity: 3 },
  { name: "Mouse", price: 20, quantity: 5 },
  { name: "Monitor", price: 150, quantity: 1 },
];

function buildReport(items) {
  const report = {
    totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
    totalValue: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    names: items.map((item) => item.name).sort(),
    mostExpensive: items.reduce(
      (top, item) => (item.price > top.price ? item : top),
      items[0]
    ).name,
  };
  return JSON.stringify(report);
}
```
