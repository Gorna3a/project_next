---
id: "py-ws-project-config-builder"
type: "workshop"
title: "Project Config Builder"
moduleId: "py-mod-15-environments-and-packaging"
order: 6
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 40
tags: ["python", "requirements", "pyproject", "toml", "workshop"]
---

# Workshop Overview

You will write two project configuration files with Python code. The script writes `requirements.txt` with pinned dependencies, then writes `pyproject.toml` with project metadata and the same dependencies. Each step adds a check against one file.

The sandbox installs nothing. Your script creates the files at the top level so the tests can inspect them.

---

## Step 1: Write requirements.txt

### Instructions
Write `requirements.txt` with three pinned packages: `requests==2.32.3`, `pytest==8.3.4`, and `click==8.1.7`. Use a list of lines in your script and write them to the file with `open` and `write`. End the file with a newline.

### Hints
1. Put one package per line in a list of strings.
2. Join lines with a newline and append a final newline.
3. The file path is the string `"requirements.txt"`.

### Starter State / Code
```python
# Create requirements.txt below with pinned packages.
```

### Solution State / Code
```python
lines = [
    "requests==2.32.3",
    "pytest==8.3.4",
    "click==8.1.7",
]

with open("requirements.txt", "w") as handle:
    handle.write("\n".join(lines) + "\n")
```

### Evaluation Tests
```json
[
  { "type": "file-exists", "path": "requirements.txt", "message": "requirements.txt should exist", "weight": 1, "required": true },
  { "type": "file-contains", "path": "requirements.txt", "value": "requests==2.32.3", "message": "requests should be pinned", "weight": 2, "required": true },
  { "type": "file-contains", "path": "requirements.txt", "value": "pytest==8.3.4", "message": "pytest should be pinned", "weight": 2, "required": true },
  { "type": "file-contains", "path": "requirements.txt", "value": "click==8.1.7", "message": "click should be pinned", "weight": 2, "required": true }
]
```

---

## Step 2: Write pyproject.toml

### Instructions
Keep the `requirements.txt` code. Also write `pyproject.toml` with a `[project]` table. Include `name = "demo-app"`, `version = "0.1.0"`, `requires-python = ">=3.10"`, and a `dependencies` list with the same three pinned packages.

### Hints
1. A TOML array spans one line: `dependencies = ["requests==2.32.3", "pytest==8.3.4", "click==8.1.7"]`.
2. The table header is `[project]`.
3. Use a list of TOML lines joined by newlines.

### Starter State / Code
```python
lines = [
    "requests==2.32.3",
    "pytest==8.3.4",
    "click==8.1.7",
]

with open("requirements.txt", "w") as handle:
    handle.write("\n".join(lines) + "\n")

# Write pyproject.toml below.
```

### Solution State / Code
```python
lines = [
    "requests==2.32.3",
    "pytest==8.3.4",
    "click==8.1.7",
]

with open("requirements.txt", "w") as handle:
    handle.write("\n".join(lines) + "\n")

toml_lines = [
    "[project]",
    'name = "demo-app"',
    'version = "0.1.0"',
    'requires-python = ">=3.10"',
    'dependencies = ["requests==2.32.3", "pytest==8.3.4", "click==8.1.7"]',
]

with open("pyproject.toml", "w") as handle:
    handle.write("\n".join(toml_lines) + "\n")
```

### Evaluation Tests
```json
[
  { "type": "file-exists", "path": "pyproject.toml", "message": "pyproject.toml should exist", "weight": 1, "required": true },
  { "type": "file-contains", "path": "pyproject.toml", "value": "[project]", "message": "The project table should exist", "weight": 2, "required": true },
  { "type": "file-contains", "path": "pyproject.toml", "value": "name = \"demo-app\"", "message": "The project name should be demo-app", "weight": 2, "required": true },
  { "type": "file-contains", "path": "pyproject.toml", "value": "version = \"0.1.0\"", "message": "The version should be 0.1.0", "weight": 2, "required": true },
  { "type": "file-contains", "path": "pyproject.toml", "value": "requires-python = \">=3.10\"", "message": "requires-python should be >=3.10", "weight": 2, "required": true },
  { "type": "file-contains", "path": "pyproject.toml", "value": "requests==2.32.3", "message": "Dependencies should include requests", "weight": 2, "required": true },
  { "type": "file-contains", "path": "requirements.txt", "value": "click==8.1.7", "message": "requirements.txt should still be written", "required": true }
]
```

---

## Step 3: Verify both files

### Instructions
Keep the previous code. Read `requirements.txt` and `pyproject.toml` back and print their line counts. Each file should report 3 lines.

### Hints
1. Use `open` in read mode and call `read().splitlines()`.
2. Print `len(...)` for each file.
3. The expected output is `3` on each of two lines.

### Starter State / Code
```python
lines = [
    "requests==2.32.3",
    "pytest==8.3.4",
    "click==8.1.7",
]

with open("requirements.txt", "w") as handle:
    handle.write("\n".join(lines) + "\n")

toml_lines = [
    "[project]",
    'name = "demo-app"',
    'version = "0.1.0"',
    'requires-python = ">=3.10"',
    'dependencies = ["requests==2.32.3", "pytest==8.3.4", "click==8.1.7"]',
]

with open("pyproject.toml", "w") as handle:
    handle.write("\n".join(toml_lines) + "\n")

# Print the line count of each file below.
```

### Solution State / Code
```python
lines = [
    "requests==2.32.3",
    "pytest==8.3.4",
    "click==8.1.7",
]

with open("requirements.txt", "w") as handle:
    handle.write("\n".join(lines) + "\n")

toml_lines = [
    "[project]",
    'name = "demo-app"',
    'version = "0.1.0"',
    'requires-python = ">=3.10"',
    'dependencies = ["requests==2.32.3", "pytest==8.3.4", "click==8.1.7"]',
]

with open("pyproject.toml", "w") as handle:
    handle.write("\n".join(toml_lines) + "\n")

with open("requirements.txt") as handle:
    print(len(handle.read().splitlines()))

with open("pyproject.toml") as handle:
    print(len(handle.read().splitlines()))
```

### Evaluation Tests
```json
[
  { "type": "output-contains", "value": "3", "message": "Both files should report 3 lines", "weight": 1, "required": true },
  { "type": "file-exists", "path": "requirements.txt", "message": "requirements.txt should exist", "required": true },
  { "type": "file-exists", "path": "pyproject.toml", "message": "pyproject.toml should exist", "required": true },
  { "type": "code-contains", "value": "open", "message": "Read the files back with open", "required": true }
]
```
