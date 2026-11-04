---
id: "py-ws-student-records"
type: "workshop"
title: "Process Student Records"
moduleId: "py-mod-06-collections"
order: 7
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 50
tags: ["python", "collections", "lists", "dictionaries"]
---

# Workshop Overview

You will work with a list of student dictionaries and build four functions that read, filter, average, and summarize the data. Each function returns a value, so the tests call it directly.

The records stay fixed at the top of the script. Do not change them; the functions should work from the data they receive.

---

## Step 1: Collect the names

### Instructions
Define `get_names(students)` that returns a list of student names in the same order as the records.

Call `get_names(students)` and print the result.

### Hints
1. Start with an empty list and append one name per record.
2. Each record is a dictionary; access the name with `student["name"]`.
3. Return the completed list after the loop, not inside it.

### Starter State / Code
```python
students = [
    {"name": "Ana", "score": 92},
    {"name": "Ben", "score": 78},
    {"name": "Chen", "score": 85},
    {"name": "Dara", "score": 64},
    {"name": "Eli", "score": 49},
]

# Define get_names below.
```

### Solution State / Code
```python
students = [
    {"name": "Ana", "score": 92},
    {"name": "Ben", "score": 78},
    {"name": "Chen", "score": 85},
    {"name": "Dara", "score": 64},
    {"name": "Eli", "score": 49},
]


def get_names(students):
    """Return the names from a list of student dictionaries."""
    names = []
    for student in students:
        names.append(student["name"])
    return names


print(get_names(students))
```

### Evaluation Tests
```json
[
  { "type": "function-returns", "call": "get_names(students)", "expected": ["Ana", "Ben", "Chen", "Dara", "Eli"], "message": "get_names should return the names in order", "weight": 2, "required": true },
  { "type": "function-returns", "call": "get_names([{\"name\": \"Sam\", \"score\": 70}, {\"name\": \"Ada\", \"score\": 90}])", "expected": ["Sam", "Ada"], "message": "get_names should work with any list of records", "required": true },
  { "type": "code-contains", "value": "def get_names", "message": "Define the get_names function", "required": true },
  { "type": "code-contains", "value": "for student in students", "message": "Loop over the records", "required": true }
]
```

---

## Step 2: Filter passing students

### Instructions
Keep `get_names`. Add `passing_students(students, minimum=60)` that returns a list containing every student record whose score is at least `minimum`.

Call it with the default and print the number of passing students using `len()`.

### Hints
1. Start with an empty list for the passing records.
2. Compare with `>=` so a score exactly equal to `minimum` passes.
3. Append the whole dictionary, not just the name.

### Starter State / Code
```python
students = [
    {"name": "Ana", "score": 92},
    {"name": "Ben", "score": 78},
    {"name": "Chen", "score": 85},
    {"name": "Dara", "score": 64},
    {"name": "Eli", "score": 49},
]


def get_names(students):
    """Return the names from a list of student dictionaries."""
    names = []
    for student in students:
        names.append(student["name"])
    return names


print(get_names(students))

# Define passing_students below.
```

### Solution State / Code
```python
students = [
    {"name": "Ana", "score": 92},
    {"name": "Ben", "score": 78},
    {"name": "Chen", "score": 85},
    {"name": "Dara", "score": 64},
    {"name": "Eli", "score": 49},
]


def get_names(students):
    """Return the names from a list of student dictionaries."""
    names = []
    for student in students:
        names.append(student["name"])
    return names


def passing_students(students, minimum=60):
    """Return students whose score is at least minimum."""
    passing = []
    for student in students:
        if student["score"] >= minimum:
            passing.append(student)
    return passing


print(get_names(students))
print(len(passing_students(students)))
```

### Evaluation Tests
```json
[
  { "type": "function-returns", "call": "passing_students(students)", "expected": [{"name": "Ana", "score": 92}, {"name": "Ben", "score": 78}, {"name": "Chen", "score": 85}, {"name": "Dara", "score": 64}], "message": "The default minimum should keep the four passing records", "weight": 2, "required": true },
  { "type": "function-returns", "call": "passing_students(students, 85)", "expected": [{"name": "Ana", "score": 92}, {"name": "Chen", "score": 85}], "message": "A custom minimum should filter the records", "required": true },
  { "type": "function-returns", "call": "passing_students(students, 100)", "expected": [], "message": "An unreachable minimum should return an empty list", "required": true },
  { "type": "code-contains", "value": ">= minimum", "message": "Compare scores with the minimum", "required": true }
]
```

---

## Step 3: Average the scores

### Instructions
Keep the previous functions. Add `average_score(students)` that returns the mean of all scores.

Call it, round the result to two decimal places, and print it.

### Hints
1. Start a total at `0` and add each `student["score"]`.
2. After the loop, divide the total by `len(students)`.
3. The records are non-empty, so no special empty case is needed here.

### Starter State / Code
```python
students = [
    {"name": "Ana", "score": 92},
    {"name": "Ben", "score": 78},
    {"name": "Chen", "score": 85},
    {"name": "Dara", "score": 64},
    {"name": "Eli", "score": 49},
]


def get_names(students):
    """Return the names from a list of student dictionaries."""
    names = []
    for student in students:
        names.append(student["name"])
    return names


def passing_students(students, minimum=60):
    """Return students whose score is at least minimum."""
    passing = []
    for student in students:
        if student["score"] >= minimum:
            passing.append(student)
    return passing


print(get_names(students))
print(len(passing_students(students)))

# Define average_score below.
```

### Solution State / Code
```python
students = [
    {"name": "Ana", "score": 92},
    {"name": "Ben", "score": 78},
    {"name": "Chen", "score": 85},
    {"name": "Dara", "score": 64},
    {"name": "Eli", "score": 49},
]


def get_names(students):
    """Return the names from a list of student dictionaries."""
    names = []
    for student in students:
        names.append(student["name"])
    return names


def passing_students(students, minimum=60):
    """Return students whose score is at least minimum."""
    passing = []
    for student in students:
        if student["score"] >= minimum:
            passing.append(student)
    return passing


def average_score(students):
    """Return the average score across all students."""
    total = 0
    for student in students:
        total += student["score"]
    return total / len(students)


print(get_names(students))
print(len(passing_students(students)))
print(round(average_score(students), 2))
```

### Evaluation Tests
```json
[
  { "type": "function-returns", "call": "round(average_score(students), 2)", "expected": 73.6, "message": "The average of the five scores should be 73.6", "weight": 2, "required": true },
  { "type": "function-returns", "call": "round(average_score([{\"name\": \"A\", \"score\": 90}, {\"name\": \"B\", \"score\": 80}]), 2)", "expected": 85.0, "message": "average_score should work with any non-empty list", "required": true },
  { "type": "code-contains", "value": "total += student[\"score\"]", "message": "Accumulate each score", "required": true },
  { "type": "code-contains", "value": "len(students)", "message": "Divide by the number of students", "required": true }
]
```

---

## Step 4: Build a summary dictionary

### Instructions
Keep the previous functions. Add `build_summary(students)` that returns a dictionary with four keys:

- `"count"`: the number of students
- `"average"`: the average score rounded to two decimal places
- `"passing"`: the number of students with a score of at least `60`
- `"names"`: the list returned by `get_names`

Reuse the earlier functions instead of repeating their loops. Print the summary.

### Hints
1. A dictionary literal can contain the four keys in any order.
2. `len(passing_students(students))` gives the passing count.
3. `round(average_score(students), 2)` gives the rounded average.

### Starter State / Code
```python
students = [
    {"name": "Ana", "score": 92},
    {"name": "Ben", "score": 78},
    {"name": "Chen", "score": 85},
    {"name": "Dara", "score": 64},
    {"name": "Eli", "score": 49},
]


def get_names(students):
    """Return the names from a list of student dictionaries."""
    names = []
    for student in students:
        names.append(student["name"])
    return names


def passing_students(students, minimum=60):
    """Return students whose score is at least minimum."""
    passing = []
    for student in students:
        if student["score"] >= minimum:
            passing.append(student)
    return passing


def average_score(students):
    """Return the average score across all students."""
    total = 0
    for student in students:
        total += student["score"]
    return total / len(students)


print(get_names(students))
print(len(passing_students(students)))
print(round(average_score(students), 2))

# Define build_summary below.
```

### Solution State / Code
```python
students = [
    {"name": "Ana", "score": 92},
    {"name": "Ben", "score": 78},
    {"name": "Chen", "score": 85},
    {"name": "Dara", "score": 64},
    {"name": "Eli", "score": 49},
]


def get_names(students):
    """Return the names from a list of student dictionaries."""
    names = []
    for student in students:
        names.append(student["name"])
    return names


def passing_students(students, minimum=60):
    """Return students whose score is at least minimum."""
    passing = []
    for student in students:
        if student["score"] >= minimum:
            passing.append(student)
    return passing


def average_score(students):
    """Return the average score across all students."""
    total = 0
    for student in students:
        total += student["score"]
    return total / len(students)


def build_summary(students):
    """Return a summary of the student list."""
    return {
        "count": len(students),
        "average": round(average_score(students), 2),
        "passing": len(passing_students(students)),
        "names": get_names(students),
    }


print(get_names(students))
print(len(passing_students(students)))
print(round(average_score(students), 2))
print(build_summary(students))
```

### Evaluation Tests
```json
[
  { "type": "function-returns", "call": "build_summary(students)", "expected": {"count": 5, "average": 73.6, "passing": 4, "names": ["Ana", "Ben", "Chen", "Dara", "Eli"]}, "message": "The summary should contain the correct count, average, passing count, and names", "weight": 3, "required": true },
  { "type": "function-returns", "call": "build_summary([{\"name\": \"A\", \"score\": 90}])", "expected": {"count": 1, "average": 90.0, "passing": 1, "names": ["A"]}, "message": "build_summary should work with a single record", "weight": 2, "required": true },
  { "type": "code-contains", "value": "def build_summary", "message": "Define the build_summary function", "required": true },
  { "type": "code-contains", "value": "\"names\": get_names(students)", "message": "Reuse get_names for the names list", "required": true }
]
```
