---
id: "py-les-virtual-environments"
type: "theory"
title: "Virtual Environments"
moduleId: "py-mod-15-environments-and-packaging"
order: 2
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 18
tags: ["python", "venv", "virtual-env", "isolation", "pyenv"]
---

# Concept Overview

A virtual environment is a directory with its own Python interpreter copies and its own installed packages. Installing into a venv keeps each project's dependencies separate from the system interpreter and from other projects. The standard library includes `venv` for creating them.

## Key Principles & Frameworks

### Creating an environment

```bash
python -m venv .venv
```

This creates a `.venv` directory. You do not need a third-party tool for ordinary projects.

### Activating the environment

```bash
.venv\Scripts\activate
```

On Windows, activation runs `.venv\Scripts\activate`. On POSIX shells, run `source .venv/bin/activate`. Activation puts the venv's Python first on `PATH`.

Check which interpreter is active:

```bash
python -c "import sys; print(sys.executable)"
```

When the venv is active, that path points inside `.venv`. When it is not active, the path points at the system interpreter.

```python
import sys

print(sys.version_info[0])
print(sys.version_info[1])
```

Output:

```text
3
12
```

The output shows the major and minor Python versions. Use it to confirm the interpreter you are actually running.

```bash
which python
```

`which` shows the `python` command resolved from `PATH`. When a venv is active, the answer is inside `.venv`.

### Installing inside the environment

```bash
python -m pip install "requests==2.32.3"
python -m pip freeze > requirements.txt
```

With the venv active, `python -m pip` installs into it. Freeze from the same terminal so `requirements.txt` matches the venv contents.

### Deactivating

```bash
deactivate
```

Deactivation restores the earlier `PATH`. The `.venv` directory remains on disk.

### Python versions with pyenv

Python version managers switch between interpreters:

```bash
pyenv install 3.12.10
pyenv local 3.12.10
```

`pyenv` lets different projects use different Python versions. The project records the chosen version so others can match it.

### Excluding the venv from version control

Add `.venv/` to `.gitignore`. A venv is large, machine-specific, and rebuildable from `requirements.txt`. Commit configuration, never the environment itself.

## Common Pitfalls & Anti-Patterns
- **Committing the virtual environment**: `.venv` is machine-specific and huge. Add it to `.gitignore` and rebuild it from requirements.
- **Installing globally before creating a venv**: The package lands in the system interpreter. Create and activate the venv first.
- **Pip and Python mismatch**: A mismatched pair installs into the wrong interpreter. Always use `python -m pip` inside the active venv.
- **Mixing pip and conda**: Do not install with conda into an environment managed by pip. Choose one manager per environment.
- **Forgetting to activate**: Commands run against the system interpreter. Check `sys.executable` before installing.
- **Typosquatting**: Keep exact names from your requirements file. Do not type package names from memory.

## Quick Summary
- A venv isolates one project's interpreter and packages.
- `python -m venv .venv` creates the environment.
- Activation puts the venv Python first on `PATH`.
- `python -m pip` installs into the active environment.
- `pyenv` switches Python versions between projects.
- Ignore `.venv/` in version control.
- Check `sys.executable` before installing.
