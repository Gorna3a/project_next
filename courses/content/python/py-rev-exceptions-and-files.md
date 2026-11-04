---
id: "py-rev-exceptions-and-files"
type: "review"
title: "Exceptions & Files Quick Reference"
moduleId: "py-mod-08-exceptions-and-files"
order: 7
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
covers: ["py-les-try-except-else-finally", "py-les-raising-and-custom-exceptions", "py-les-reading-and-writing-files", "py-les-json-and-csv-files", "py-ws-safe-number-parser", "py-lab-file-report-validator"]
tags: ["python", "exceptions", "files", "json", "reference"]
---

# Quick Reference Summary

## Core Terminology / Formula Matrix
| Term / Command | Definition / Formula | Common Usage |
| :--- | :--- | :--- |
| Exception | An object that reports an operation failed | Handling runtime errors |
| Traceback | The report of the call stack and exception | Debugging a crash |
| `try` | Block containing risky code | Narrowing error handling |
| `except` | Block that handles a matching exception | Recovering from failures |
| `else` | Runs when `try` raises no exception | Keeping the success path separate |
| `finally` | Always runs, whether an exception occurs or not | Cleanup |
| `ValueError` | Correct type, invalid value | `int("abc")` |
| `TypeError` | Wrong type for the operation | `len(5)` |
| `KeyError` | Missing dictionary key | Safe lookups |
| `IndexError` | Sequence index out of range | List access |
| `ZeroDivisionError` | Division or modulo by zero | Arithmetic guards |
| `FileNotFoundError` | A required file does not exist | File error handling |
| `raise` | Report an exception | Validating input |
| `raise ... from` | Raise a new exception with an explicit cause | Translating errors |
| Bare `raise` | Re-raise the active exception inside `except` | Logging without hiding |
| `assert` | Raise `AssertionError` when a condition is false | Internal invariants |
| Custom exception | `class ValidationError(Exception): pass` | Domain-specific failures |
| `str(error)` | The exception's message | Building error reports |
| `open` | Open a file and return a file object | Reading and writing |
| `"r"` | Read mode | Existing text files |
| `"w"` | Write mode; truncates an existing file | Replacing content |
| `"a"` | Append mode; writes at the end | Adding to logs |
| `"x"` | Exclusive create mode | Avoiding overwrites |
| `with open(...)` | Open and close a file automatically | Safe file handling |
| `encoding="utf-8"` | Explicit text encoding | Portable text files |
| `read` | Read the whole file as one string | Small files |
| `readline` | Read one line | Streaming input |
| `readlines` | Read all lines into a list | Line-based processing |
| `write` | Write a string; no newline added | Creating text |
| `pathlib.Path` | Object-oriented file path | Path manipulation |
| `read_text` / `write_text` | Path convenience methods | Small text files |
| `json.dumps` / `json.loads` | Convert to and from a JSON string | In-memory exchange |
| `json.dump` / `json.load` | Write and read JSON files | Persistence |
| `csv.writer` | Write CSV rows | Creating tables |
| `csv.reader` | Read CSV rows as lists of strings | Parsing tables |
| `newline=""` | Let the CSV module control line endings | CSV file opening |
| File test | Checks the workspace after the script runs | Lab report validation |

## Key Concepts Comparison
- **`try` vs. `except` vs. `else` vs. `finally`**: `try` holds risky code, `except` handles a match, `else` runs after success, and `finally` always runs.
- **`ValueError` vs. `TypeError`**: `ValueError` means the type was acceptable but the value was not; `TypeError` means the type itself was wrong.
- **Specific `except` vs. bare `except:`**: A specific clause handles one expected failure. A bare clause catches everything and hides bugs.
- **`except Exception` vs. a specific type**: `Exception` is useful only at a broad program boundary. Elsewhere it makes unexpected failures look routine.
- **`raise` vs. `assert`**: Raise for validation and expected failures. Use `assert` for invariants that indicate programmer error.
- **`raise ... from error` vs. raising without a cause**: `from` preserves the original exception for debugging. Without it, the link is less explicit.
- **`"w"` vs. `"a"` vs. `"x"`**: `"w"` truncates, `"a"` appends, and `"x"` fails when the file exists.
- **`read()` vs. `readline()` vs. `readlines()`**: One string, one line, or a list of lines.
- **`with open(...)` vs. manual `close()`**: `with` closes the file even if an exception occurs.
- **Text mode vs. binary mode**: Text mode returns and accepts `str`; binary mode returns and accepts `bytes`.
- **`json.dumps` vs. `json.dump`**: `dumps` returns a string; `dump` writes to a file.
- **`json.loads` vs. `json.load`**: `loads` reads a string; `load` reads from a file.
- **JSON vs. CSV**: JSON handles nested structures and types. CSV handles flat tables and stores every field as text.
- **Tuple vs. JSON array**: A tuple is serialized as an array and comes back as a list.
- **Set, date, or object vs. JSON**: These need conversion before serialization.
- **`csv.reader` values vs. Python numbers**: CSV fields are strings until you convert them.
- **File tests vs. function tests**: File tests check the workspace after the script runs, so the file must be created at the top level.

## Critical Syntax / Templates
```python
# try, except, else, and finally
try:
    number = int("42")
except ValueError:
    print("Invalid integer")
else:
    print(f"Parsed {number}")
finally:
    print("Done")
```

```python
# Catch several types and provide a fallback
try:
    number = int(None)
except (TypeError, ValueError):
    number = 0

print(number)
```

```python
# Raise a built-in exception
def validate_age(age):
    if age < 0:
        raise ValueError("age cannot be negative")
    return age


try:
    validate_age(-1)
except ValueError as error:
    print(str(error))
```

```python
# Custom exception and chaining
class ValidationError(Exception):
    pass


def parse_age(text):
    try:
        age = int(text)
    except ValueError as error:
        raise ValidationError("age must be an integer") from error
    return age


try:
    parse_age("abc")
except ValidationError as error:
    print(str(error))
    print(type(error.__cause__).__name__)
```

```python
# Assertions for internal invariants
def average(values):
    assert len(values) > 0, "values cannot be empty"
    return sum(values) / len(values)


print(average([2, 4, 6]))
```

```python
# Write and read text
with open("notes.txt", "w", encoding="utf-8") as file:
    file.write("first\nsecond\n")

with open("notes.txt", "r", encoding="utf-8") as file:
    print(file.read())
```

```python
# Read line by line
with open("notes.txt", "w", encoding="utf-8") as file:
    file.write("first\nsecond\n")

with open("notes.txt", "r", encoding="utf-8") as file:
    for line in file:
        print(line.strip())
```

```python
# pathlib basics
from pathlib import Path

path = Path("notes.txt")
path.write_text("hello\n", encoding="utf-8")

print(path.exists())
print(path.name)
print(path.suffix)
print(path.read_text(encoding="utf-8").strip())
```

```python
# JSON string and file operations
import json

data = {"name": "Ana", "scores": [92, 88], "active": True}
text = json.dumps(data, indent=2, sort_keys=True)
loaded = json.loads(text)
print(loaded["name"])

with open("student.json", "w", encoding="utf-8") as file:
    json.dump(data, file, indent=2)

with open("student.json", "r", encoding="utf-8") as file:
    from_file = json.load(file)

print(from_file["active"])
```

```python
# CSV writing and reading
import csv

with open("scores.csv", "w", encoding="utf-8", newline="") as file:
    writer = csv.writer(file)
    writer.writerow(["name", "score"])
    writer.writerow(["Ana", 92])

with open("scores.csv", "r", encoding="utf-8", newline="") as file:
    for row in csv.reader(file):
        print(row)
```

```text
# Report file pattern for the lab
SCORE REPORT
valid=2
errors=3
VALID
Ana,92
Ben,78
ERRORS
Chen,score must be between 0 and 100
Dara,score must be an integer
(missing),name is required
```
