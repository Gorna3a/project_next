---
id: "py-lab-log-parser"
type: "lab"
title: "Log Parser"
moduleId: "py-mod-12-regular-expressions"
order: 5
difficulty: "beginner"
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 50
passingScorePercent: 100
revealSolutionAfterAttempts: 3
tags: ["python", "regex", "parsing", "logs"]
---

# Objective

Parse fixed-format log lines into structured dictionaries. Each line has a timestamp, a level, and a message. You will use a regular expression with named groups and return a list of dictionaries.

The tests call your functions directly. Keep the implementation free of prompts and printed output.

## Requirements
- Import `re`.
- Define `LOG_PATTERN` as a compiled regular expression with named groups `date`, `time`, `level`, and `message`.
- The pattern should match lines like `2024-03-15 10:30:00 INFO User alice logged in`.
- Define `parse_log_line(line)` that returns a dictionary with the four keys, or `None` when the line does not match.
- Define `parse_logs(lines)` that returns a list of dictionaries for every matching line, in input order.
- Define `count_levels(lines)` that returns a dictionary mapping each level to its count.
- Do not print inside the functions.

## Starter State / Workspace
```python
import re

# Define LOG_PATTERN, parse_log_line, parse_logs, and count_levels below.
```

## Evaluation Tests
```json
[
  { "type": "function-returns", "call": "parse_log_line(\"2024-03-15 10:30:00 INFO User alice logged in\")", "expected": {"date": "2024-03-15", "time": "10:30:00", "level": "INFO", "message": "User alice logged in"}, "message": "A valid line should produce a dictionary", "weight": 2, "required": true },
  { "type": "function-returns", "call": "parse_log_line(\"not a log line\")", "expected": null, "message": "An invalid line should return None", "required": true },
  { "type": "function-returns", "call": "parse_logs([\"2024-03-15 10:30:00 INFO User alice logged in\", \"2024-03-15 10:31:00 ERROR Database connection failed\"])", "expected": [{"date": "2024-03-15", "time": "10:30:00", "level": "INFO", "message": "User alice logged in"}, {"date": "2024-03-15", "time": "10:31:00", "level": "ERROR", "message": "Database connection failed"}], "message": "parse_logs should return one dictionary per matching line", "weight": 2, "required": true },
  { "type": "function-returns", "call": "parse_logs([\"bad line\", \"2024-03-15 10:32:00 WARNING Disk usage high\"])", "expected": [{"date": "2024-03-15", "time": "10:32:00", "level": "WARNING", "message": "Disk usage high"}], "message": "Non-matching lines should be skipped", "required": true },
  { "type": "function-returns", "call": "parse_logs([])", "expected": [], "message": "An empty input should return an empty list", "required": true },
  { "type": "function-returns", "call": "count_levels([\"2024-03-15 10:30:00 INFO User alice logged in\", \"2024-03-15 10:31:00 ERROR Database connection failed\", \"2024-03-15 10:32:00 WARNING Disk usage high\", \"2024-03-15 10:33:00 INFO User bob logged out\"])", "expected": {"INFO": 2, "ERROR": 1, "WARNING": 1}, "message": "count_levels should count each level", "weight": 2, "required": true },
  { "type": "function-returns", "call": "count_levels([])", "expected": {}, "message": "An empty input should return an empty dictionary", "required": true },
  { "type": "code-contains", "value": "re.compile", "message": "Compile the pattern", "required": true },
  { "type": "code-contains", "value": "groupdict", "message": "Use the named groups", "required": true },
  { "type": "code-contains", "value": "def parse_log_line(line)", "message": "Define parse_log_line", "required": true },
  { "type": "code-contains", "value": "def parse_logs(lines)", "message": "Define parse_logs", "required": true },
  { "type": "code-contains", "value": "def count_levels(lines)", "message": "Define count_levels", "required": true }
]
```

## Hints
> [!TIP]
> **Hint 1:** Use named groups such as `(?P<date>\d{4}-\d{2}-\d{2})` and `(?P<message>.*)`.

> [!TIP]
> **Hint 2:** `LOG_PATTERN.match(line)` returns a match object or `None`. Call `.groupdict()` on a match.

> [!TIP]
> **Hint 3:** `parse_logs` can loop over the lines and append the result of `parse_log_line` when it is not `None`.

> [!TIP]
> **Hint 4:** `count_levels` can call `parse_log_line` for each line and increment `counts[level]`.

## Reference Solution
```python
import re

LOG_PATTERN = re.compile(
    r"(?P<date>\d{4}-\d{2}-\d{2}) "
    r"(?P<time>\d{2}:\d{2}:\d{2}) "
    r"(?P<level>[A-Z]+) "
    r"(?P<message>.*)"
)


def parse_log_line(line):
    match = LOG_PATTERN.match(line)
    if match is None:
        return None
    return match.groupdict()


def parse_logs(lines):
    result = []
    for line in lines:
        parsed = parse_log_line(line)
        if parsed is not None:
            result.append(parsed)
    return result


def count_levels(lines):
    counts = {}
    for line in lines:
        parsed = parse_log_line(line)
        if parsed is None:
            continue
        level = parsed["level"]
        counts[level] = counts.get(level, 0) + 1
    return counts
```
