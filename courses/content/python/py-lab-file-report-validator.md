---
id: "py-lab-file-report-validator"
type: "lab"
title: "File Report Validator"
moduleId: "py-mod-08-exceptions-and-files"
order: 6
difficulty: "beginner"
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 50
passingScorePercent: 100
revealSolutionAfterAttempts: 3
tags: ["python", "exceptions", "files", "validation", "report"]
---

# Objective

Validate a list of score rows, collect the failures, and write a report file. The validator uses a custom `ValidationError` for bad data, a conversion helper that preserves the original exception, and a report writer built with `with open(...)`.

The tests check both your functions and the `report.txt` file. Because file tests run after your script executes, your script must call `write_report(rows)` at the top level.

## Requirements
- Keep the provided `rows` list unchanged.
- Define a custom exception with the previewed template: `class ValidationError(Exception): pass`.
- Define `parse_score(value)`. Convert `value` with `int`. If conversion raises `TypeError` or `ValueError`, raise `ValidationError("score must be an integer")` from the original error. If the integer is outside `0` through `100`, raise `ValidationError("score must be between 0 and 100")`. Return the integer.
- Define `validate_row(row)`. Read `row["name"]` as a string, strip surrounding whitespace, and raise `ValidationError("name is required")` when the result is empty. Call `parse_score(row.get("score"))` and return a clean dictionary with `"name"` and `"score"`.
- Define `build_report(rows)`. Return a dictionary with two keys:
  - `"valid"`: the clean dictionaries returned by `validate_row`, in input order
  - `"errors"`: dictionaries with `"name"` and `"message"` keys, in input order. Use the stripped name, or `"(missing)"` when the name is empty. Use `str(error)` for the message.
- Catch only `ValidationError` inside `build_report`; do not catch every exception.
- Define `write_report(rows, path="report.txt")`. Build the report, write it to `path` with `open` in `"w"` mode and `encoding="utf-8"`, and return the report dictionary.
- Write these lines exactly, with a final newline:
  - `SCORE REPORT`
  - `valid=<number of valid rows>`
  - `errors=<number of error rows>`
  - `VALID`
  - one `name,score` line per valid row
  - `ERRORS`
  - one `name,message` line per error
- Call `write_report(rows)` at the top level so `report.txt` is created when the script runs.
- Do not print inside the functions.

## Starter State / Workspace
```python
rows = [
    {"name": "Ana", "score": "92"},
    {"name": "Ben", "score": "78"},
    {"name": "Chen", "score": "120"},
    {"name": "Dara", "score": "abc"},
    {"name": "", "score": "88"},
]

# Define ValidationError, parse_score, validate_row, build_report, and write_report below.
# Call write_report(rows) at the top level so report.txt is created.
```

## Evaluation Tests
```json
[
  { "type": "function-returns", "call": "parse_score(\"92\")", "expected": 92, "message": "A valid score string should return an integer", "weight": 2, "required": true },
  { "type": "function-returns", "call": "parse_score(\"0\")", "expected": 0, "message": "Zero is within the valid range", "required": true },
  { "type": "function-returns", "call": "parse_score(\"100\")", "expected": 100, "message": "One hundred is within the valid range", "required": true },
  { "type": "function-throws", "call": "parse_score(\"abc\")", "errorType": "ValidationError", "message": "A non-numeric score should raise ValidationError", "weight": 2, "required": true },
  { "type": "function-throws", "call": "parse_score(\"101\")", "errorType": "ValidationError", "message": "A score above 100 should raise ValidationError", "required": true },
  { "type": "function-throws", "call": "parse_score(None)", "errorType": "ValidationError", "message": "A missing score should raise ValidationError", "required": true },
  { "type": "function-returns", "call": "validate_row({\"name\": \" Ana \", \"score\": \"92\"})", "expected": {"name": "Ana", "score": 92}, "message": "validate_row should strip the name and convert the score", "weight": 2, "required": true },
  { "type": "function-throws", "call": "validate_row({\"name\": \" \", \"score\": \"92\"})", "errorType": "ValidationError", "message": "An empty name should raise ValidationError", "required": true },
  { "type": "function-returns", "call": "build_report(rows)", "expected": {"valid": [{"name": "Ana", "score": 92}, {"name": "Ben", "score": 78}], "errors": [{"name": "Chen", "message": "score must be between 0 and 100"}, {"name": "Dara", "message": "score must be an integer"}, {"name": "(missing)", "message": "name is required"}]}, "message": "The report should separate valid rows from errors in input order", "weight": 3, "required": true },
  { "type": "function-returns", "call": "build_report([])", "expected": {"valid": [], "errors": []}, "message": "An empty input should produce an empty report", "required": true },
  { "type": "function-returns", "call": "build_report([{\"name\": \" \", \"score\": \"92\"}])", "expected": {"valid": [], "errors": [{"name": "(missing)", "message": "name is required"}]}, "message": "A whitespace-only name should be reported as missing", "required": true },
  { "type": "function-returns", "call": "len(write_report(rows)[\"valid\"])", "expected": 2, "message": "write_report should return the report dictionary", "weight": 2, "required": true },
  { "type": "file-exists", "path": "report.txt", "message": "The script should create report.txt at the top level", "weight": 2, "required": true },
  { "type": "file-contains", "path": "report.txt", "value": "SCORE REPORT", "message": "The report should start with SCORE REPORT", "required": true },
  { "type": "file-contains", "path": "report.txt", "value": "valid=2", "message": "The report should record two valid rows", "weight": 2, "required": true },
  { "type": "file-contains", "path": "report.txt", "value": "errors=3", "message": "The report should record three error rows", "required": true },
  { "type": "file-contains", "path": "report.txt", "value": "Ana,92", "message": "The report should contain Ana's row", "required": true },
  { "type": "file-contains", "path": "report.txt", "value": "Ben,78", "message": "The report should contain Ben's row", "required": true },
  { "type": "file-contains", "path": "report.txt", "value": "Chen,score must be between 0 and 100", "message": "The report should explain Chen's range error", "weight": 2, "required": true },
  { "type": "file-contains", "path": "report.txt", "value": "Dara,score must be an integer", "message": "The report should explain Dara's conversion error", "required": true },
  { "type": "file-contains", "path": "report.txt", "value": "(missing),name is required", "message": "The report should explain the missing name", "required": true },
  { "type": "code-contains", "value": "class ValidationError(Exception)", "message": "Define the custom exception with the template", "required": true },
  { "type": "code-contains", "value": "raise ValidationError", "message": "Raise ValidationError for invalid rows", "required": true },
  { "type": "code-contains", "value": "from error", "message": "Chain the conversion error with raise ... from", "required": true },
  { "type": "code-contains", "value": "str(error)", "message": "Use str(error) for the report message", "required": true },
  { "type": "code-contains", "value": "encoding=\"utf-8\"", "message": "Write the report with an explicit UTF-8 encoding", "required": true },
  { "type": "code-contains", "value": "write_report(rows)", "message": "Call write_report(rows) at the top level", "required": true },
  { "type": "code-not-contains", "value": "except:", "message": "Do not use a bare except", "required": true },
  { "type": "code-not-contains", "value": "except Exception", "message": "Catch ValidationError, not every exception", "required": true }
]
```

## Hints
> [!TIP]
> **Hint 1:** In `parse_score`, put `int(value)` inside `try`. Catch `(TypeError, ValueError) as error` and `raise ValidationError("score must be an integer") from error`. Check the range after the conversion succeeds.

> [!TIP]
> **Hint 2:** In `validate_row`, strip the name before checking it. `row.get("score")` returns `None` when the key is missing, which `parse_score` should reject.

> [!TIP]
> **Hint 3:** In `build_report`, loop over the rows and wrap only `validate_row(row)` in `try`. Catch `ValidationError as error`, then append `{"name": ..., "message": str(error)}` to the error list.

> [!TIP]
> **Hint 4:** In `write_report`, build a list of lines, append the valid and error entries, and write `"\n".join(lines) + "\n"`. Open the path with `"w"` and `encoding="utf-8"`, then return the report. Call `write_report(rows)` after the function definitions.

## Reference Solution
```python
rows = [
    {"name": "Ana", "score": "92"},
    {"name": "Ben", "score": "78"},
    {"name": "Chen", "score": "120"},
    {"name": "Dara", "score": "abc"},
    {"name": "", "score": "88"},
]


class ValidationError(Exception):
    pass


def parse_score(value):
    try:
        score = int(value)
    except (TypeError, ValueError) as error:
        raise ValidationError("score must be an integer") from error

    if not 0 <= score <= 100:
        raise ValidationError("score must be between 0 and 100")

    return score


def validate_row(row):
    name = row["name"].strip()

    if not name:
        raise ValidationError("name is required")

    return {"name": name, "score": parse_score(row.get("score"))}


def build_report(rows):
    valid = []
    errors = []

    for row in rows:
        try:
            valid.append(validate_row(row))
        except ValidationError as error:
            name = (row.get("name") or "").strip() or "(missing)"
            errors.append({"name": name, "message": str(error)})

    return {"valid": valid, "errors": errors}


def write_report(rows, path="report.txt"):
    report = build_report(rows)

    lines = [
        "SCORE REPORT",
        f"valid={len(report['valid'])}",
        f"errors={len(report['errors'])}",
        "VALID",
    ]

    for student in report["valid"]:
        lines.append(f"{student['name']},{student['score']}")

    lines.append("ERRORS")

    for error in report["errors"]:
        lines.append(f"{error['name']},{error['message']}")

    with open(path, "w", encoding="utf-8") as file:
        file.write("\n".join(lines) + "\n")

    return report


write_report(rows)
```
