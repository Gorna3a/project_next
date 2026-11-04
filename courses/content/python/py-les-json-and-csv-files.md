---
id: "py-les-json-and-csv-files"
type: "theory"
title: "JSON and CSV Files"
moduleId: "py-mod-08-exceptions-and-files"
order: 4
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 25
tags: ["python", "json", "csv", "files", "data"]
---

# Concept Overview

Programs often exchange structured data with other programs. JSON represents nested objects, arrays, strings, numbers, booleans, and null. CSV represents rows and columns as plain text. Both formats are readable by people and supported by Python's standard library.

JSON is the better fit for nested records such as a student with a list of scores. CSV is the better fit for tables where every row has the same columns. Python's `json` and `csv` modules handle the formatting details, including quoting and escaping, so you should not split or join these formats by hand.

## Key Principles & Frameworks

### JSON strings with dumps and loads

`json.dumps` converts a Python value to a JSON string:

```python
import json

student = {"name": "Ana", "scores": [92, 88], "active": True}

text = json.dumps(student, indent=2, sort_keys=True)
print(text)
```

Output:

```text
{
  "active": true,
  "name": "Ana",
  "scores": [
    92,
    88
  ]
}
```

`indent=2` makes the output readable, and `sort_keys=True` orders object keys. Without those arguments, the result is compact. Python's `True` becomes JSON's `true`, and `None` becomes `null`.

`json.loads` goes the other direction, parsing a JSON string into Python values:

```python
import json

text = '{"name": "Ana", "scores": [92, 88]}'
data = json.loads(text)

print(data["name"])
print(data["scores"][0])
print(type(data["scores"]))
```

Output:

```text
Ana
92
<class 'list'>
```

JSON arrays become Python lists, JSON objects become dictionaries, and JSON strings, numbers, booleans, and null become their Python equivalents. Use `json.loads`, never `eval`, to parse untrusted JSON.

### JSON files with dump and load

`json.dump` writes JSON directly to a file. `json.load` reads it back:

```python
import json

student = {"name": "Ana", "active": True}

with open("student.json", "w", encoding="utf-8") as file:
    json.dump(student, file, indent=2)

with open("student.json", "r", encoding="utf-8") as file:
    loaded = json.load(file)

print(loaded["name"])
print(loaded["active"])
```

Output:

```text
Ana
True
```

Remember the pairs: `dumps` returns a string, `dump` writes to a file; `loads` reads a string, `load` reads from a file. The extra `s` stands for "string."

### What JSON cannot represent

JSON supports objects, arrays, strings, numbers, booleans, and null. It does not support every Python value:

```python
import json

# json.dumps({1, 2, 3}) raises TypeError: Object of type set is not JSON serializable.
# json.dumps({"point": (3, 5)}) returns '{"point": [3, 5]}'.
# json.dumps({1: "one"}) returns '{"1": "one"}'.
```

Sets, `datetime` and `date` objects, and custom class instances are not JSON serializable. Tuples are written as arrays and come back as lists, so the tuple type is lost. Dictionary keys must become strings; integer keys are converted automatically. JSON also has no comments and does not allow trailing commas.

When data contains an unsupported type, convert it first. For example, turn a `set` into a sorted list, turn a `date` into an ISO string with `isoformat()`, or turn an object into a dictionary. Validate the result before writing it.

### CSV rows with writer

`csv.writer` writes rows to a file. Pass `newline=""` when opening a CSV file so the module controls line endings:

```python
import csv

rows = [
    ["name", "score"],
    ["Ana", 92],
    ["Ben", 78],
]

with open("scores.csv", "w", encoding="utf-8", newline="") as file:
    writer = csv.writer(file)
    writer.writerows(rows)

with open("scores.csv", "r", encoding="utf-8", newline="") as file:
    for line in file:
        print(line.strip())
```

Output:

```text
name,score
Ana,92
Ben,78
```

`writerow` writes one row and `writerows` writes several. The writer adds commas and quotes fields that contain commas, quotes, or newlines:

```python
import csv

with open("people.csv", "w", encoding="utf-8", newline="") as file:
    writer = csv.writer(file)
    writer.writerow(["Ana, the Great", 92])

with open("people.csv", "r", encoding="utf-8", newline="") as file:
    print(file.read().strip())
```

Output:

```text
"Ana, the Great",92
```

Do not build CSV lines with `",".join(...)`; manual joining breaks as soon as a field contains a comma or quote. Let the `csv` module handle quoting.

### CSV rows with reader

`csv.reader` returns an iterator of rows. Each row is a list of strings:

```python
import csv

with open("scores.csv", "w", encoding="utf-8", newline="") as file:
    writer = csv.writer(file)
    writer.writerows([["name", "score"], ["Ana", "92"], ["Ben", "78"]])

with open("scores.csv", "r", encoding="utf-8", newline="") as file:
    rows = list(csv.reader(file))

header = rows[0]
print(header)
for row in rows[1:]:
    print(row)
```

Output:

```text
['name', 'score']
['Ana', '92']
['Ben', '78']
```

The header is an ordinary row. Wrap the reader in `list()` when you need to index the rows, then treat index `0` as the header and slice from index `1`. The remaining rows can be unpacked:

```python
import csv

with open("scores.csv", "w", encoding="utf-8", newline="") as file:
    writer = csv.writer(file)
    writer.writerows([["Ana", "92"], ["Ben", "78"]])

with open("scores.csv", "r", encoding="utf-8", newline="") as file:
    for name, score_text in csv.reader(file):
        print(f"{name}: {int(score_text) + 1}")
```

Output:

```text
Ana: 93
Ben: 79
```

Every CSV field arrives as a string, even when it looks like a number. Convert values with `int` or `float` when you need arithmetic, and handle conversion errors with `try` and `except`.

### Choosing JSON or CSV

| Need | Better format |
| :--- | :--- |
| Nested records, lists inside records | JSON |
| A table with the same columns in every row | CSV |
| Preserve booleans, null, and nested structure | JSON |
| Open the data in a spreadsheet | CSV |
| Send data between programs with a standard format | JSON |

CSV is simpler for flat tables, but it has no built-in way to represent nesting or types. JSON preserves structure and types, but it is more verbose and does not preserve tuples or Python-specific objects.

## Common Pitfalls & Anti-Patterns
- **Treating CSV values as numbers**: `csv.reader` returns strings. Convert them explicitly.
- **Omitting `newline=""` when opening CSV files**: This can produce extra blank lines on Windows.
- **Splitting CSV lines with `split(",")`**: Quoted fields can contain commas. Use the `csv` module.
- **Forgetting the header row**: Read it as the first row and skip it when processing data.
- **Passing a set, date, or custom object to `json.dumps`**: Convert it to a supported type first.
- **Assuming tuples survive JSON**: They become arrays and return as lists.
- **Expecting non-string dictionary keys in JSON**: JSON object keys are strings.
- **Confusing `dump`/`dumps` or `load`/`loads`**: The versions ending in `s` work with strings.
- **Parsing JSON with `eval`**: Use `json.loads`; `eval` executes arbitrary code.
- **Overwriting a CSV file with `"w"` when appending is needed**: Choose the mode deliberately.
- **Relying on JSON object key order**: JSON does not define object order, even though Python preserves insertion order when parsing.

## Quick Summary
- `json.dumps` returns a JSON string; `json.loads` parses one.
- `json.dump` writes to a file; `json.load` reads from one.
- JSON supports objects, arrays, strings, numbers, booleans, and null.
- Sets, dates, and custom objects need conversion before JSON serialization.
- Tuples become JSON arrays and return as lists.
- `csv.writer` writes rows; `csv.reader` returns rows as lists of strings.
- Use `newline=""` and `encoding="utf-8"` when opening CSV files.
- Treat the first row as the header when the file has one, and convert numeric fields yourself.
- Let the `csv` module handle commas, quotes, and newlines.
- Use JSON for nested data and CSV for flat tables.
