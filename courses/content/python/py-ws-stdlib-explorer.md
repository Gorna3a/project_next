---
id: "py-ws-stdlib-explorer"
type: "workshop"
title: "Standard Library Explorer"
moduleId: "py-mod-07-modules-and-standard-library"
order: 4
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 50
tags: ["python", "modules", "math", "statistics", "datetime"]
---

# Workshop Overview

You will build three groups of helpers using Python's standard library. The first group uses `math` for geometry, the second uses `statistics` for a score summary, and the third uses `datetime` for date arithmetic.

All seven inputs are fixed, and every function returns a value. The tests call the functions directly, so keep the printed examples and return the results described in each step.

---

## Step 1: Geometry helpers

### Instructions
Import `math` and define two functions:

- `circle_metrics(radius)` returns a dictionary with `"area"` and `"circumference"`. Round both values to two decimal places.
- `distance(x1, y1, x2, y2)` returns the distance between two points using the Pythagorean formula. Round the result to two decimal places.

Print `circle_metrics(3)` and `distance(0, 0, 3, 4)`.

### Hints
1. The area is `math.pi * radius ** 2`, and the circumference is `2 * math.pi * radius`.
2. The distance is `math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)`.
3. Use `round(value, 2)` for each returned number.

### Starter State / Code
```python
import math

# Define circle_metrics and distance below.
```

### Solution State / Code
```python
import math


def circle_metrics(radius):
    """Return the area and circumference of a circle, rounded to 2 decimals."""
    return {
        "area": round(math.pi * radius ** 2, 2),
        "circumference": round(2 * math.pi * radius, 2),
    }


def distance(x1, y1, x2, y2):
    """Return the distance between two points, rounded to 2 decimals."""
    return round(math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2), 2)


print(circle_metrics(3))
print(distance(0, 0, 3, 4))
```

### Evaluation Tests
```json
[
  { "type": "function-returns", "call": "circle_metrics(3)", "expected": {"area": 28.27, "circumference": 18.85}, "message": "A radius of 3 should produce the correct area and circumference", "weight": 2, "required": true },
  { "type": "function-returns", "call": "circle_metrics(0.5)", "expected": {"area": 0.79, "circumference": 3.14}, "message": "circle_metrics should work with a fractional radius", "required": true },
  { "type": "function-returns", "call": "distance(0, 0, 3, 4)", "expected": 5.0, "message": "The distance from (0, 0) to (3, 4) should be 5.0", "weight": 2, "required": true },
  { "type": "function-returns", "call": "distance(1, 1, 4, 5)", "expected": 5.0, "message": "distance should work with non-zero starting coordinates", "required": true },
  { "type": "code-contains", "value": "math.pi", "message": "Use math.pi for the circle calculations", "required": true },
  { "type": "code-contains", "value": "math.sqrt", "message": "Use math.sqrt for the distance", "required": true }
]
```

---

## Step 2: Score summary

### Instructions
Keep the geometry helpers. Add `scores = [88, 92, 79, 92, 85]` and define `describe(values)`.

It returns a dictionary with three keys:

- `"mean"`: the arithmetic mean
- `"median"`: the middle value
- `"mode"`: the most frequent value

Round each value to two decimal places. Print `describe(scores)`.

### Hints
1. Import `statistics` alongside `math`.
2. `statistics.mean`, `statistics.median`, and `statistics.mode` each accept the list directly.
3. Build the dictionary with `round(...)` around each call.

### Starter State / Code
```python
import math
import statistics


def circle_metrics(radius):
    """Return the area and circumference of a circle, rounded to 2 decimals."""
    return {
        "area": round(math.pi * radius ** 2, 2),
        "circumference": round(2 * math.pi * radius, 2),
    }


def distance(x1, y1, x2, y2):
    """Return the distance between two points, rounded to 2 decimals."""
    return round(math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2), 2)


print(circle_metrics(3))
print(distance(0, 0, 3, 4))

scores = [88, 92, 79, 92, 85]

# Define describe below.
```

### Solution State / Code
```python
import math
import statistics


def circle_metrics(radius):
    """Return the area and circumference of a circle, rounded to 2 decimals."""
    return {
        "area": round(math.pi * radius ** 2, 2),
        "circumference": round(2 * math.pi * radius, 2),
    }


def distance(x1, y1, x2, y2):
    """Return the distance between two points, rounded to 2 decimals."""
    return round(math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2), 2)


scores = [88, 92, 79, 92, 85]


def describe(values):
    """Return the mean, median, and mode, rounded to 2 decimals."""
    return {
        "mean": round(statistics.mean(values), 2),
        "median": round(statistics.median(values), 2),
        "mode": round(statistics.mode(values), 2),
    }


print(circle_metrics(3))
print(distance(0, 0, 3, 4))
print(describe(scores))
```

### Evaluation Tests
```json
[
  { "type": "function-returns", "call": "describe(scores)", "expected": {"mean": 87.2, "median": 88, "mode": 92}, "message": "The summary should contain the correct mean, median, and mode", "weight": 3, "required": true },
  { "type": "function-returns", "call": "describe([2, 4, 4, 6])", "expected": {"mean": 4.0, "median": 4.0, "mode": 4.0}, "message": "describe should work with a different even-length list", "weight": 2, "required": true },
  { "type": "code-contains", "value": "statistics.mean", "message": "Use statistics.mean", "required": true },
  { "type": "code-contains", "value": "statistics.median", "message": "Use statistics.median", "required": true },
  { "type": "code-contains", "value": "statistics.mode", "message": "Use statistics.mode", "required": true }
]
```

---

## Step 3: Date helpers

### Instructions
Keep the previous functions. Add `start_date = "2026-11-04"` and import `date` and `timedelta` from `datetime`.

Define:

- `shift_date(start_iso, days)` returns the ISO date string that is `days` after `start_iso`. Negative values move backward.
- `days_between(start_iso, end_iso)` returns the whole number of days from `start_iso` to `end_iso`. The result is negative when the end is earlier.

Print `shift_date(start_date, 10)` and `days_between(start_date, "2026-11-14")`.

Do not use `date.today()` or `datetime.now()`; the tests rely on fixed dates.

### Hints
1. Parse with `date.fromisoformat(start_iso)`.
2. Add a `timedelta(days=days)` to move forward or backward.
3. Subtract two `date` objects to get a `timedelta`; read its `.days` attribute.

### Starter State / Code
```python
import math
import statistics
from datetime import date, timedelta


def circle_metrics(radius):
    """Return the area and circumference of a circle, rounded to 2 decimals."""
    return {
        "area": round(math.pi * radius ** 2, 2),
        "circumference": round(2 * math.pi * radius, 2),
    }


def distance(x1, y1, x2, y2):
    """Return the distance between two points, rounded to 2 decimals."""
    return round(math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2), 2)


def describe(values):
    """Return the mean, median, and mode, rounded to 2 decimals."""
    return {
        "mean": round(statistics.mean(values), 2),
        "median": round(statistics.median(values), 2),
        "mode": round(statistics.mode(values), 2),
    }


scores = [88, 92, 79, 92, 85]
start_date = "2026-11-04"

print(circle_metrics(3))
print(distance(0, 0, 3, 4))
print(describe(scores))

# Define shift_date and days_between below.
```

### Solution State / Code
```python
import math
import statistics
from datetime import date, timedelta


def circle_metrics(radius):
    """Return the area and circumference of a circle, rounded to 2 decimals."""
    return {
        "area": round(math.pi * radius ** 2, 2),
        "circumference": round(2 * math.pi * radius, 2),
    }


def distance(x1, y1, x2, y2):
    """Return the distance between two points, rounded to 2 decimals."""
    return round(math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2), 2)


def describe(values):
    """Return the mean, median, and mode, rounded to 2 decimals."""
    return {
        "mean": round(statistics.mean(values), 2),
        "median": round(statistics.median(values), 2),
        "mode": round(statistics.mode(values), 2),
    }


def shift_date(start_iso, days):
    """Return the ISO date that is days after start_iso."""
    start = date.fromisoformat(start_iso)
    return (start + timedelta(days=days)).isoformat()


def days_between(start_iso, end_iso):
    """Return the number of days from start_iso to end_iso."""
    start = date.fromisoformat(start_iso)
    end = date.fromisoformat(end_iso)
    return (end - start).days


scores = [88, 92, 79, 92, 85]
start_date = "2026-11-04"

print(circle_metrics(3))
print(distance(0, 0, 3, 4))
print(describe(scores))
print(shift_date(start_date, 10))
print(days_between(start_date, "2026-11-14"))
```

### Evaluation Tests
```json
[
  { "type": "function-returns", "call": "shift_date(\"2026-11-04\", 10)", "expected": "2026-11-14", "message": "Ten days after 2026-11-04 should be 2026-11-14", "weight": 2, "required": true },
  { "type": "function-returns", "call": "shift_date(\"2026-12-30\", 5)", "expected": "2027-01-04", "message": "shift_date should cross a year boundary", "required": true },
  { "type": "function-returns", "call": "shift_date(\"2026-11-04\", -3)", "expected": "2026-11-01", "message": "A negative number of days should move backward", "required": true },
  { "type": "function-returns", "call": "days_between(\"2026-11-04\", \"2026-11-14\")", "expected": 10, "message": "The difference should be 10 days", "weight": 2, "required": true },
  { "type": "function-returns", "call": "days_between(\"2026-11-14\", \"2026-11-04\")", "expected": -10, "message": "The difference should be negative when the end is earlier", "required": true },
  { "type": "function-throws", "call": "shift_date(\"not-a-date\", 1)", "errorType": "ValueError", "message": "An invalid ISO date should raise ValueError", "required": true },
  { "type": "code-contains", "value": "date.fromisoformat", "message": "Parse the date strings with date.fromisoformat", "required": true },
  { "type": "code-contains", "value": "timedelta", "message": "Use timedelta for date shifts", "required": true },
  { "type": "code-not-contains", "value": "date.today", "message": "Do not depend on the current date", "required": true },
  { "type": "code-not-contains", "value": "datetime.now", "message": "Do not depend on the current time", "required": true }
]
```
