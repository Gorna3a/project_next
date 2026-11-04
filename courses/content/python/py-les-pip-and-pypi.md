---
id: "py-les-pip-and-pypi"
type: "theory"
title: "Pip and PyPI"
moduleId: "py-mod-15-environments-and-packaging"
order: 1
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 18
tags: ["python", "pip", "pypi", "requirements", "versions"]
---

# Concept Overview

The Python Package Index (PyPI) hosts third-party packages and wheels. Pip is the launcher that installs, upgrades, and removes packages. In this module you will use `python -m pip` so the installed packages go into the same interpreter that runs your code.

A `requirements.txt` file lists the packages a project needs, ideally with version specifiers. Pinning exact versions makes installs reproducible on other machines.

## Key Principles & Frameworks

### Installing with pip

Use the module form so pip and Python agree on the interpreter:

```bash
python -m pip install requests
python -m pip install "requests==2.32.3"
python -m pip install "pytest>=8"
python -m pip uninstall requests
```

`python -m pip` runs pip through the current interpreter. Bare `pip` may point at a different interpreter. Prefer the module form.

### Inspecting what is installed

```bash
python -m pip list
python -m pip show requests
python -m pip freeze
```

`list` shows installed packages and versions. `show` prints metadata such as name, version, and location. `freeze` prints a requirements-style list of every installed package.

### Version specifiers

Specifier operators constrain the versions pip may install:

```bash
python -m pip install "requests==2.32.3"
python -m pip install "requests>=2.31,<3"
python -m pip install "requests~=2.32"
python -m pip install "requests!=2.29.0"
```

Use `==` for exact pins, `>=` and `<` for ranges, `~=` for compatible releases, and `!=` to exclude a version.

### requirements.txt

A requirements file makes setup one command:

```bash
pip install -r requirements.txt
```

A simple requirements file pins versions:

```text
requests==2.32.3
pytest==8.3.4
```

Each line names one package and its specifier. Blank lines and `#` comments are allowed.

```python
line = "requests==2.32.3"
name, version = line.split("==")
print(name)
print(version)
```

Output:

```text
requests
2.32.3
```

The code splits a pinned line into name and version. This is how a requirements line is read.

### Freezing the current environment

```bash
python -m pip freeze > requirements.txt
```

`freeze` captures the installed set into a file. Run it inside the project virtual environment so the file reflects your project, not the global interpreter.

## Common Pitfalls & Anti-Patterns
- **Installing globally**: `pip install` without an active virtual environment pollutes the system interpreter. Create a venv first.
- **Not pinning versions**: Unpinned entries drift over time as new releases appear. Pin exact versions for reproducibility.
- **Pip and Python mismatch**: Bare `pip` can install into a different interpreter than `python`. Use `python -m pip`.
- **Mixing pip and conda**: Pip and conda write to different environments. Pick one manager per environment.
- **Typosquatting**: Installing packages without checking the exact name risks typo-squat packages. Verify names on PyPI before installing.
- **Committing `requirements.txt` generated from the global environment**: Freeze only inside the project environment.

## Quick Summary
- PyPI hosts packages; pip installs them into an interpreter.
- `python -m pip install` keeps pip and Python aligned.
- `list`, `show`, and `freeze` inspect the installed environment.
- Version specifiers include `==`, `>=`, `<`, `~=`, and `!=`.
- `requirements.txt` lists dependencies with pins for reproducibility.
- Freeze inside the project virtual environment only.
- Verify package names before installing.
