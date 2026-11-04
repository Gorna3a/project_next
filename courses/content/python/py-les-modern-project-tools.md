---
id: "py-les-modern-project-tools"
type: "theory"
title: "Modern Project Tools"
moduleId: "py-mod-15-environments-and-packaging"
order: 3
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 18
tags: ["python", "poetry", "uv", "packaging", "dependencies"]
---

# Concept Overview

Modern project tools combine environment creation, dependency resolution, and locking into one workflow. Pipenv, Poetry, uv, and Conda differ in how they resolve versions and store the result. A lock file records the exact resolved versions so the whole team installs identical dependency sets.

## Key Principles & Frameworks

### Why lock files matter

Resolving dependencies twice can produce different versions. A lock file stores the resolved set. Tools install from the lock file instead of solving again. Pip lists requirements but does not resolve into a lock file by default.

### Poetry

```bash
poetry init
poetry add requests
poetry install
```

Poetry creates a project, stores dependencies in `pyproject.toml`, and writes `poetry.lock`. It manages a virtual environment for you.

### Pipenv

```bash
pipenv install requests
pipenv install --dev pytest
pipenv shell
```

Pipenv stores runtime and development dependencies in `Pipfile` and locks them in `Pipfile.lock`. The `shell` command activates its environment.

### uv

```bash
uv init
uv add requests
uv run python main.py
```

Uv manages venvs, resolves dependencies, and installs them quickly. It stores dependencies in `pyproject.toml` and locks them in `uv.lock`.

### Conda

```bash
conda create --name demo python=3.12
conda install requests
conda activate demo
```

Conda manages Python versions, native libraries, and non-Python dependencies in one environment. It is common for scientific stacks.

### Choosing a tool

- Use pip and venv for simple projects and full control.
- Use Poetry or uv for application projects that need locking.
- Use Pipenv where its workflow already fits the project.
- Use Conda for native or scientific dependencies.

```python
tools = ["pip + venv", "Pipenv", "Poetry", "uv", "Conda"]
print(len(tools))
print(tools[0])
```

Output:

```text
5
pip + venv
```

The list names the workflows in this lesson. The first entry is the default for simple projects.

## Common Pitfalls & Anti-Patterns
- **Mixing pip and conda**: Running both installers against one environment produces conflicts. Choose one manager per environment.
- **Pip and Python mismatch**: A tool may use a different Python than your `python` command. Check `sys.executable` before installing.
- **Installing globally**: Tools create their own environments. Let them manage the venv instead of installing globally.
- **Committing generated environments**: Tool environments are rebuildable from lock files. Commit the lock file, not the environment.
- **Not pinning versions**: Tools pin versions in lock files automatically. Hand-written requirements need manual pins.
- **Typosquatting**: Tools resolve names from declarations. Verify the name in the declaration before adding it.

## Quick Summary
- Modern tools add locking to plain pip installs.
- Pipenv uses `Pipfile` and `Pipfile.lock`.
- Poetry uses `pyproject.toml` and `poetry.lock`.
- Uv uses `pyproject.toml` and `uv.lock`.
- Conda handles native and scientific dependencies.
- Use plain pip and venv for simple projects.
- Pick one manager per environment.
