---
id: "py-lab-requirements-doctor"
type: "lab"
title: "Requirements Doctor"
moduleId: "py-mod-15-environments-and-packaging"
order: 7
difficulty: "intermediate"
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 40
passingScorePercent: 100
revealSolutionAfterAttempts: 3
tags: ["python", "requirements", "pyproject", "debugging", "config"]
---

# Objective

Repair a broken project configuration. The workspace has `requirements.txt` with an unpinned entry, a typo in a package name, and a missing newline, plus a `pyproject.toml` with a wrong version and an incomplete dependency list. Your script writes corrected versions of both files at the top level so the tests can inspect them.

Nothing is installed in the sandbox. Do not run pip. Write the fixed files with plain Python code.

## Requirements
- Write `requirements.txt` with exactly these three pinned lines in this order: `requests==2.32.3`, `pytest==8.3.4`, `click==8.1.7`.
- End `requirements.txt` with a newline.
- Write `pyproject.toml` with a `[project]` table.
- Include `name = "demo-app"` and `version = "0.2.0"`.
- Include `requires-python = ">=3.10"`.
- Include a `dependencies` list containing `requests==2.32.3`, `pytest==8.3.4`, and `click==8.1.7`.
- Do not install anything with pip.

## Starter State / Workspace
```python
# Broken requirements.txt contents:
# requests
# pytest>=8
# clkick==8.1.7

# Broken pyproject.toml contents:
# [project]
# name = "demo-app"
# version = "0.1.0"
# dependencies = ["requests"]

# Overwrite both files with corrected contents below.
```

## Evaluation Tests
```json
[
  { "type": "file-exists", "path": "requirements.txt", "message": "requirements.txt should exist", "weight": 1, "required": true },
  { "type": "file-exists", "path": "pyproject.toml", "message": "pyproject.toml should exist", "weight": 1, "required": true },
  { "type": "file-contains", "path": "requirements.txt", "value": "requests==2.32.3", "message": "requests should be pinned exactly", "weight": 2, "required": true },
  { "type": "file-contains", "path": "requirements.txt", "value": "pytest==8.3.4", "message": "pytest should be pinned exactly", "weight": 2, "required": true },
  { "type": "file-contains", "path": "requirements.txt", "value": "click==8.1.7", "message": "The click typo should be fixed", "weight": 2, "required": true },
  { "type": "file-contains", "path": "pyproject.toml", "value": "version = \"0.2.0\"", "message": "The version should be 0.2.0", "weight": 2, "required": true },
  { "type": "file-contains", "path": "pyproject.toml", "value": "requires-python = \">=3.10\"", "message": "requires-python should be >=3.10", "weight": 2, "required": true },
  { "type": "file-contains", "path": "pyproject.toml", "value": "requests==2.32.3", "message": "pyproject.toml should list requests", "weight": 2, "required": true },
  { "type": "file-contains", "path": "pyproject.toml", "value": "click==8.1.7", "message": "pyproject.toml should list click", "weight": 2, "required": true },
  { "type": "code-not-contains", "value": "clkick", "message": "Remove the typo-squat name", "required": true }
]
```

## Hints
> [!TIP]
> **Hint 1:** A pinned line uses `==` between the name and an exact version.

> [!TIP]
> **Hint 2:** The correct package name is `click`, not `clkick`. Compare each name with the workspace `pyproject.toml` dependency list.

> [!TIP]
> **Hint 3:** Write a list of three lines, join with a newline, and append one final newline.

> [!TIP]
> **Hint 4:** The `pyproject.toml` file needs the table header `[project]` plus `name`, `version`, `requires-python`, and a one-line `dependencies` array.

## Reference Solution
```python
requirements_lines = [
    "requests==2.32.3",
    "pytest==8.3.4",
    "click==8.1.7",
]

with open("requirements.txt", "w") as handle:
    handle.write("\n".join(requirements_lines) + "\n")

toml_lines = [
    "[project]",
    'name = "demo-app"',
    'version = "0.2.0"',
    'requires-python = ">=3.10"',
    'dependencies = ["requests==2.32.3", "pytest==8.3.4", "click==8.1.7"]',
]

with open("pyproject.toml", "w") as handle:
    handle.write("\n".join(toml_lines) + "\n")
```
