---
id: "py-ws-first-script"
type: "workshop"
title: "Your First Script"
moduleId: "py-mod-01-getting-started"
order: 5
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 30
tags: ["python", "print", "sep", "end", "comments"]
---

# Workshop Overview

You will build a small script that prints a banner, a labeled line, and a joined status line. Along the way you will use `print()`, comments, the `sep` argument, and the `end` argument.

---

## Step 1: Print the banner

### Instructions
Write two `print()` calls. The first prints `Python Practice`, and the second prints `Learning step by step`. Each message must appear on its own line.

### Hints
1. One `print()` call writes one line.
2. Put the exact text inside quotes and pass it to `print()`.

### Starter State / Code
```python
# Print the two banner lines below.
```

### Solution State / Code
```python
print("Python Practice")
print("Learning step by step")
```

### Evaluation Tests
```json
[
  { "type": "output-equals", "value": "Python Practice\nLearning step by step", "message": "The script should print the two banner lines in order", "weight": 2, "required": true },
  { "type": "output-contains", "value": "Python Practice", "message": "Print the first banner line", "required": true },
  { "type": "output-contains", "value": "Learning step by step", "message": "Print the second banner line" }
]
```

---

## Step 2: Add a labeled line with sep

### Instructions
Keep the two banner lines. Add a third `print()` call with four values: `"Name"`, `"Sam"`, `"Level"`, and `"Beginner"`. Use `sep=" | "` so the line reads `Name | Sam | Level | Beginner`.

### Hints
1. `print()` accepts several values when you separate them with commas.
2. The `sep` argument controls the text placed between those values.

### Starter State / Code
```python
print("Python Practice")
print("Learning step by step")

# Add the labeled line below.
```

### Solution State / Code
```python
print("Python Practice")
print("Learning step by step")
print("Name", "Sam", "Level", "Beginner", sep=" | ")
```

### Evaluation Tests
```json
[
  { "type": "output-equals", "value": "Python Practice\nLearning step by step\nName | Sam | Level | Beginner", "message": "The script should print both banner lines and the labeled line", "weight": 2, "required": true },
  { "type": "output-contains", "value": "Name | Sam | Level | Beginner", "message": "Separate the values with the requested separator", "required": true },
  { "type": "code-contains", "value": "sep=", "message": "Use the sep argument to set the separator" }
]
```

---

## Step 3: Join a line with end

### Instructions
Keep the previous output. Add a comment that explains the status line. Then print `"Status: "` with `end=""`, followed by a second `print()` call that prints `"ready"`. The two calls must produce one line: `Status: ready`.

### Hints
1. The default value of `end` is a newline. Replace it with an empty string for the first piece.
2. The second `print()` supplies the rest of the line and the final newline.

### Starter State / Code
```python
print("Python Practice")
print("Learning step by step")
print("Name", "Sam", "Level", "Beginner", sep=" | ")

# Add the status line below.
```

### Solution State / Code
```python
print("Python Practice")
print("Learning step by step")
print("Name", "Sam", "Level", "Beginner", sep=" | ")

# Join the status label and value on one line.
print("Status: ", end="")
print("ready")
```

### Evaluation Tests
```json
[
  { "type": "output-equals", "value": "Python Practice\nLearning step by step\nName | Sam | Level | Beginner\nStatus: ready", "message": "The final script should print all four lines exactly", "weight": 2, "required": true },
  { "type": "output-contains", "value": "Status: ready", "message": "Join the status label and value on one line", "required": true },
  { "type": "code-contains", "value": "end=", "message": "Use the end argument to suppress the first newline", "required": true },
  { "type": "code-contains", "value": "#", "message": "Add a comment for the status line", "required": true }
]
```
