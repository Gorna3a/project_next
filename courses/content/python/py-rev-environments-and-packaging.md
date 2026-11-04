---
id: "py-rev-environments-and-packaging"
type: "review"
title: "Environments and Packaging Cheat Sheet"
moduleId: "py-mod-15-environments-and-packaging"
order: 8
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
tags: ["python", "pip", "venv", "pyproject", "cheat-sheet"]
covers: ["py-les-pip-and-pypi", "py-les-virtual-environments", "py-les-modern-project-tools", "py-les-pyproject-toml", "py-les-choosing-and-trusting-packages", "py-ws-project-config-builder", "py-lab-requirements-doctor"]
---

# Quick Reference Summary

## Core Terminology / Formula Matrix
| Term / Command | Definition / Formula | Common Usage |
| :--- | :--- | :--- |
| **PyPI** | Python Package Index hosting packages | `pip install requests` fetches from PyPI |
| **`python -m pip install`** | Install into the current interpreter | `python -m pip install "requests==2.32.3"` |
| **`pip freeze`** | Print installed packages | `python -m pip freeze > requirements.txt` |
| **`requirements.txt`** | Pinned dependency list | `pip install -r requirements.txt` |
| **`python -m venv .venv`** | Create a virtual environment | `python -m venv .venv` then activate |
| **Activation** | Put venv Python first on PATH | `.venv\Scripts\activate` on Windows |
| **`pyproject.toml`** | Project metadata and dependencies | `[project]` table with `dependencies` |
| **Lock file** | Resolved exact dependency set | `poetry.lock`, `uv.lock`, `Pipfile.lock` |
| **Pinning** | Exact versions with `==` | `requests==2.32.3` |
| **Typosquatting** | Misspelled names fetching wrong packages | Copy names from PyPI pages |

## Key Concepts Comparison
- **Pip vs modern tools**: Pip installs packages but does not lock. Poetry, uv, and Pipenv resolve and lock exact dependency sets.
- **venv vs Conda**: `venv` isolates Python packages. Conda also manages Python versions and native libraries.
- **requirements.txt vs pyproject.toml**: `requirements.txt` is a flat pinned list. `pyproject.toml` holds metadata, dependencies, and tool config.
- **Global install vs venv install**: Global installs pollute the system interpreter. Venv installs stay inside one project.
- **Pip vs Python mismatch**: Bare `pip` may target a different interpreter. `python -m pip` targets the current one.

## Critical Syntax / Templates
```toml
[project]
name = "demo-app"
version = "0.1.0"
requires-python = ">=3.10"
dependencies = [
    "requests==2.32.3",
    "pytest==8.3.4",
    "click==8.1.7",
]
```

```text
requests==2.32.3
pytest==8.3.4
click==8.1.7
```

```bash
python -m venv .venv
python -m pip install "requests==2.32.3"
python -m pip freeze > requirements.txt
python -m pip install -r requirements.txt
```
