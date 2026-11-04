---
id: "py-lab-date-and-math-helpers"
type: "lab"
title: "Date and Math Helpers"
moduleId: "py-mod-07-modules-and-standard-library"
order: 5
difficulty: "beginner"
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 40
passingScorePercent: 100
revealSolutionAfterAttempts: 3
tags: ["python", "standard-library", "math", "statistics", "datetime"]
---

# Objective

Build four helper functions on top of the standard library. Two use numeric modules, and two use fixed dates. The tests call each function directly, so every function must return its result.

## Requirements
- Keep the provided `scores` list unchanged.
- Define `compound_amount(principal, annual_rate, years)`. Return the balance after compound growth, rounded to two decimal places. Use `math.pow(1 + annual_rate, years)` and multiply by `principal`.
- Define `summarize(values)`. Return a dictionary with `"mean"`, `"median"`, and `"stdev"`, each rounded to two decimal places. Use `statistics.mean`, `statistics.median`, and `statistics.stdev`. Assume `values` contains at least two numbers.
- Define `add_weekdays(start_iso, count)`. Parse `start_iso` with `date.fromisoformat`. Return the ISO date string that is `count` business days later, skipping Saturdays and Sundays. A count of `0` returns the starting date. Assume `count` is non-negative.
- Define `days_between(start_iso, end_iso)`. Return the whole number of days from the start date to the end date. The result is negative when the end date is earlier.
- Use only the standard library. Import `math`, `statistics`, and the needed names from `datetime`.
- Do not use `date.today()`, `datetime.now()`, or `random` in your solution.
- Return every result. Do not print inside the functions.

## Starter State / Workspace
```python
import math
import statistics
from datetime import date, timedelta

scores = [88, 92, 79, 92, 85]

# Define compound_amount, summarize, add_weekdays, and days_between below.
```

## Evaluation Tests
```json
[
  { "type": "function-returns", "call": "compound_amount(1000, 0.05, 2)", "expected": 1102.5, "message": "A principal of 1000 at 5% for 2 years should be 1102.5", "weight": 2, "required": true },
  { "type": "function-returns", "call": "compound_amount(500, 0.03, 4)", "expected": 562.75, "message": "compound_amount should handle a different principal, rate, and term", "weight": 2, "required": true },
  { "type": "function-returns", "call": "compound_amount(1000, 0.0, 5)", "expected": 1000.0, "message": "A zero rate should leave the principal unchanged", "required": true },
  { "type": "function-returns", "call": "summarize(scores)", "expected": {"mean": 87.2, "median": 88, "stdev": 5.45}, "message": "The summary should contain the correct mean, median, and sample standard deviation", "weight": 3, "required": true },
  { "type": "function-returns", "call": "summarize([2, 4, 4, 6])", "expected": {"mean": 4.0, "median": 4.0, "stdev": 1.63}, "message": "summarize should work with another even-length list", "weight": 2, "required": true },
  { "type": "function-returns", "call": "add_weekdays(\"2026-11-04\", 0)", "expected": "2026-11-04", "message": "A count of zero should return the starting date", "required": true },
  { "type": "function-returns", "call": "add_weekdays(\"2026-11-04\", 3)", "expected": "2026-11-09", "message": "Three business days after Wednesday should skip the weekend", "weight": 2, "required": true },
  { "type": "function-returns", "call": "add_weekdays(\"2026-11-06\", 1)", "expected": "2026-11-09", "message": "One business day after Friday should be Monday", "required": true },
  { "type": "function-returns", "call": "add_weekdays(\"2026-12-30\", 5)", "expected": "2027-01-06", "message": "add_weekdays should cross a year boundary", "required": true },
  { "type": "function-returns", "call": "days_between(\"2026-11-04\", \"2026-11-14\")", "expected": 10, "message": "The difference should be 10 days", "weight": 2, "required": true },
  { "type": "function-returns", "call": "days_between(\"2026-11-14\", \"2026-11-04\")", "expected": -10, "message": "The difference should be negative when the end is earlier", "required": true },
  { "type": "function-returns", "call": "days_between(\"2026-11-04\", \"2026-11-04\")", "expected": 0, "message": "The same date should have a difference of zero", "required": true },
  { "type": "function-throws", "call": "add_weekdays(\"not-a-date\", 1)", "errorType": "ValueError", "message": "An invalid ISO date should raise ValueError", "required": true },
  { "type": "code-contains", "value": "math.pow", "message": "Use math.pow for compound growth", "required": true },
  { "type": "code-contains", "value": "statistics.mean", "message": "Use statistics.mean", "required": true },
  { "type": "code-contains", "value": "statistics.median", "message": "Use statistics.median", "required": true },
  { "type": "code-contains", "value": "statistics.stdev", "message": "Use statistics.stdev", "required": true },
  { "type": "code-contains", "value": "date.fromisoformat", "message": "Parse the date strings with date.fromisoformat", "required": true },
  { "type": "code-contains", "value": "timedelta", "message": "Use timedelta for date arithmetic", "required": true },
  { "type": "code-not-contains", "value": "date.today", "message": "Do not depend on the current date", "required": true },
  { "type": "code-not-contains", "value": "datetime.now", "message": "Do not depend on the current time", "required": true },
  { "type": "code-not-contains", "value": "import random", "message": "Do not use random in graded code", "required": true }
]
```

## Hints
> [!TIP]
> **Hint 1:** In `compound_amount`, the expression is `principal * math.pow(1 + annual_rate, years)`. Wrap it in `round(..., 2)`.

> [!TIP]
> **Hint 2:** In `summarize`, call each statistics function on `values`, round the result, and place it under the matching dictionary key. `statistics.stdev` is the sample standard deviation.

> [!TIP]
> **Hint 3:** In `add_weekdays`, start from `date.fromisoformat(start_iso)` and loop while the remaining count is greater than zero. Add one `timedelta(days=1)` per iteration and decrement the count only when `current.weekday() < 5`.

> [!TIP]
> **Hint 4:** In `days_between`, subtract the parsed start date from the parsed end date and return `.days`.

## Reference Solution
```python
import math
import statistics
from datetime import date, timedelta

scores = [88, 92, 79, 92, 85]


def compound_amount(principal, annual_rate, years):
    """Return the compound balance rounded to 2 decimals."""
    return round(principal * math.pow(1 + annual_rate, years), 2)


def summarize(values):
    """Return the mean, median, and sample standard deviation."""
    return {
        "mean": round(statistics.mean(values), 2),
        "median": round(statistics.median(values), 2),
        "stdev": round(statistics.stdev(values), 2),
    }


def add_weekdays(start_iso, count):
    """Return the ISO date that is count business days after start_iso."""
    current = date.fromisoformat(start_iso)
    remaining = count

    while remaining > 0:
        current += timedelta(days=1)
        if current.weekday() < 5:
            remaining -= 1

    return current.isoformat()


def days_between(start_iso, end_iso):
    """Return the signed number of days from start_iso to end_iso."""
    start = date.fromisoformat(start_iso)
    end = date.fromisoformat(end_iso)
    return (end - start).days
```
