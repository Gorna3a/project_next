---
id: "py-ws-data-pipeline"
type: "workshop"
title: "Data Pipeline"
moduleId: "py-mod-10-iteration-and-functional-tools"
order: 5
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 50
tags: ["python", "comprehensions", "generators", "lambda", "workshop"]
---

# Workshop Overview

You will transform a small list of records through four stages. The first stage filters with a comprehension. The second stage transforms with a comprehension. The third stage streams names with a generator. The fourth stage sorts and totals with a lambda and a generator expression.

The records stay fixed. Every function returns a value, so the tests call them directly.

---

## Step 1: Filter active records

### Instructions
Define `active_records(records)` that returns a list of the records whose `"active"` value is true. Use a list comprehension.

Print the result for `records`.

### Hints
1. Start with `[record for record in records if ...]`.
2. Check `record["active"]` directly; it is already a boolean.
3. Return the new list; do not mutate the input.

### Starter State / Code
```python
records = [
    {"name": "Ana", "score": 92, "active": True},
    {"name": "Ben", "score": 78, "active": False},
    {"name": "Chen", "score": 88, "active": True},
    {"name": "Dara", "score": 65, "active": True},
]

# Define active_records below.
```

### Solution State / Code
```python
records = [
    {"name": "Ana", "score": 92, "active": True},
    {"name": "Ben", "score": 78, "active": False},
    {"name": "Chen", "score": 88, "active": True},
    {"name": "Dara", "score": 65, "active": True},
]


def active_records(records):
    return [record for record in records if record["active"]]


print(active_records(records))
```

### Evaluation Tests
```json
[
  { "type": "function-returns", "call": "active_records(records)", "expected": [{"name": "Ana", "score": 92, "active": true}, {"name": "Chen", "score": 88, "active": true}, {"name": "Dara", "score": 65, "active": true}], "message": "Only active records should be returned", "weight": 2, "required": true },
  { "type": "function-returns", "call": "active_records([])", "expected": [], "message": "An empty input should return an empty list", "required": true },
  { "type": "function-returns", "call": "len(active_records(records))", "expected": 3, "message": "There should be three active records", "required": true },
  { "type": "code-contains", "value": "[record for record in records if record[\"active\"]]", "message": "Use a list comprehension that filters on active", "required": true }
]
```

---

## Step 2: Transform records into pairs

### Instructions
Keep `active_records`. Define `score_pairs(records)` that returns a list of `[name, score]` pairs for every record, using a list comprehension.

Print the result for `records`.

### Hints
1. The expression should be `[record["name"], record["score"]]`.
2. Keep the loop as `for record in records`.
3. Return the new list instead of printing inside the function.

### Starter State / Code
```python
records = [
    {"name": "Ana", "score": 92, "active": True},
    {"name": "Ben", "score": 78, "active": False},
    {"name": "Chen", "score": 88, "active": True},
    {"name": "Dara", "score": 65, "active": True},
]


def active_records(records):
    return [record for record in records if record["active"]]


# Define score_pairs below.
```

### Solution State / Code
```python
records = [
    {"name": "Ana", "score": 92, "active": True},
    {"name": "Ben", "score": 78, "active": False},
    {"name": "Chen", "score": 88, "active": True},
    {"name": "Dara", "score": 65, "active": True},
]


def active_records(records):
    return [record for record in records if record["active"]]


def score_pairs(records):
    return [[record["name"], record["score"]] for record in records]


print(active_records(records))
print(score_pairs(records))
```

### Evaluation Tests
```json
[
  { "type": "function-returns", "call": "score_pairs(records)", "expected": [["Ana", 92], ["Ben", 78], ["Chen", 88], ["Dara", 65]], "message": "Each record should become a name and score pair", "weight": 2, "required": true },
  { "type": "function-returns", "call": "score_pairs([])", "expected": [], "message": "An empty input should return an empty list", "required": true },
  { "type": "function-returns", "call": "score_pairs([{\"name\": \"Eve\", \"score\": 10, \"active\": True}])", "expected": [["Eve", 10]], "message": "score_pairs should work with a different record", "required": true },
  { "type": "code-contains", "value": "[[record[\"name\"], record[\"score\"]] for record in records]", "message": "Use a list comprehension that builds name and score pairs", "required": true }
]
```

---

## Step 3: Stream high scorers

### Instructions
Keep the previous functions. Define `high_scorers(records, threshold=80)` as a generator function that yields the name of each record whose score is at least `threshold`.

Print `list(high_scorers(records))`.

### Hints
1. Use `yield` instead of building a list.
2. Loop over `records` and test `record["score"] >= threshold`.
3. A generator returns an iterator; wrap it in `list()` to see all values.

### Starter State / Code
```python
records = [
    {"name": "Ana", "score": 92, "active": True},
    {"name": "Ben", "score": 78, "active": False},
    {"name": "Chen", "score": 88, "active": True},
    {"name": "Dara", "score": 65, "active": True},
]


def active_records(records):
    return [record for record in records if record["active"]]


def score_pairs(records):
    return [[record["name"], record["score"]] for record in records]


# Define high_scorers below.
```

### Solution State / Code
```python
records = [
    {"name": "Ana", "score": 92, "active": True},
    {"name": "Ben", "score": 78, "active": False},
    {"name": "Chen", "score": 88, "active": True},
    {"name": "Dara", "score": 65, "active": True},
]


def active_records(records):
    return [record for record in records if record["active"]]


def score_pairs(records):
    return [[record["name"], record["score"]] for record in records]


def high_scorers(records, threshold=80):
    for record in records:
        if record["score"] >= threshold:
            yield record["name"]


print(active_records(records))
print(score_pairs(records))
print(list(high_scorers(records)))
```

### Evaluation Tests
```json
[
  { "type": "function-returns", "call": "list(high_scorers(records))", "expected": ["Ana", "Chen"], "message": "The default threshold should yield Ana and Chen", "weight": 2, "required": true },
  { "type": "function-returns", "call": "list(high_scorers(records, 70))", "expected": ["Ana", "Ben", "Chen"], "message": "A lower threshold should include Ben", "required": true },
  { "type": "function-returns", "call": "list(high_scorers(records, 100))", "expected": [], "message": "A threshold above every score should yield nothing", "required": true },
  { "type": "function-returns", "call": "list(high_scorers([]))", "expected": [], "message": "An empty input should yield nothing", "required": true },
  { "type": "code-contains", "value": "def high_scorers(records, threshold=80)", "message": "Define the generator with the requested signature", "required": true },
  { "type": "code-contains", "value": "yield record[\"name\"]", "message": "Yield each matching name", "required": true }
]
```

---

## Step 4: Total the top scores

### Instructions
Keep the previous functions. Define `top_total(records, count)` that returns the sum of the highest `count` scores. Use `sorted()` with a `lambda` as the key function and a generator expression for the sum.

Print `top_total(records, 2)`.

### Hints
1. Sort a copy of the records by score in descending order with `key=lambda record: record["score"]` and `reverse=True`.
2. Slice the first `count` records.
3. Use `sum(record["score"] for record in ...)` to total them.

### Starter State / Code
```python
records = [
    {"name": "Ana", "score": 92, "active": True},
    {"name": "Ben", "score": 78, "active": False},
    {"name": "Chen", "score": 88, "active": True},
    {"name": "Dara", "score": 65, "active": True},
]


def active_records(records):
    return [record for record in records if record["active"]]


def score_pairs(records):
    return [[record["name"], record["score"]] for record in records]


def high_scorers(records, threshold=80):
    for record in records:
        if record["score"] >= threshold:
            yield record["name"]


# Define top_total below.
```

### Solution State / Code
```python
records = [
    {"name": "Ana", "score": 92, "active": True},
    {"name": "Ben", "score": 78, "active": False},
    {"name": "Chen", "score": 88, "active": True},
    {"name": "Dara", "score": 65, "active": True},
]


def active_records(records):
    return [record for record in records if record["active"]]


def score_pairs(records):
    return [[record["name"], record["score"]] for record in records]


def high_scorers(records, threshold=80):
    for record in records:
        if record["score"] >= threshold:
            yield record["name"]


def top_total(records, count):
    ordered = sorted(records, key=lambda record: record["score"], reverse=True)
    return sum(record["score"] for record in ordered[:count])


print(active_records(records))
print(score_pairs(records))
print(list(high_scorers(records)))
print(top_total(records, 2))
```

### Evaluation Tests
```json
[
  { "type": "function-returns", "call": "top_total(records, 2)", "expected": 180, "message": "The top two scores should add to 180", "weight": 2, "required": true },
  { "type": "function-returns", "call": "top_total(records, 1)", "expected": 92, "message": "The top score is 92", "required": true },
  { "type": "function-returns", "call": "top_total(records, 4)", "expected": 323, "message": "All four scores should add to 323", "required": true },
  { "type": "function-returns", "call": "top_total(records, 0)", "expected": 0, "message": "A count of zero should total zero", "required": true },
  { "type": "code-contains", "value": "lambda record: record[\"score\"]", "message": "Use a lambda as the sort key", "required": true },
  { "type": "code-contains", "value": "sorted(records", "message": "Sort the records before slicing", "required": true },
  { "type": "code-contains", "value": "sum(record[\"score\"] for record in", "message": "Use a generator expression for the sum", "required": true }
]
```
