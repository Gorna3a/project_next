---
id: "py-les-pyproject-toml"
type: "theory"
title: "pyproject.toml"
moduleId: "py-mod-15-environments-and-packaging"
order: 4
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 20
tags: ["python", "toml", "pyproject", "metadata", "dependencies"]
---

# Concept Overview

`pyproject.toml` is the standard configuration file for Python projects. It records project metadata, dependencies, build requirements, and tool settings in one place. Build backends read it to package and install the project.

## Key Principles & Frameworks

### The project table

```toml
[project]
name = "demo-app"
version = "0.1.0"
description = "A small demo application"
requires-python = ">=3.10"
dependencies = [
    "requests==2.32.3",
    "pytest==8.3.4",
]
```

`name` and `version` identify the project. `requires-python` states the supported versions. `dependencies` lists runtime dependencies with specifiers.

```python
import tomllib

text = "[project]\nname = \"demo-app\"\nversion = \"0.1.0\"\n"
data = tomllib.loads(text)
print(data["project"]["name"])
print(data["project"]["version"])
```

Output:

```text
demo-app
0.1.0
```

The standard library `tomllib` reads TOML text into dictionaries. The code prints the project name and version.

### Optional dependencies

```toml
[project.optional-dependencies]
dev = [
    "pytest==8.3.4",
]
```

Optional groups hold dependencies needed only for development, tests, or documentation.

### The build-system table

```toml
[build-system]
requires = ["setuptools>=68"]
build-backend = "setuptools.build_meta"
```

`requires` lists the tools needed to build the project. `build-backend` names the module that performs the build.

### Tool configuration

```toml
[tool.ruff]
line-length = 100

[tool.pytest.ini_options]
testpaths = ["tests"]
```

Projects keep formatter, linter, and test settings in `[tool.*]` tables so tools share one file.

### Installing from pyproject.toml

```bash
python -m pip install .
```

Pip reads `pyproject.toml`, builds the project, and installs it with its declared dependencies.

## Common Pitfalls & Anti-Patterns
- **Installing globally**: Installing the project globally repeats the global-install problem. Install inside the venv.
- **Committing the virtual environment**: `pyproject.toml` replaces the need to commit the venv. Commit the file, ignore `.venv/`.
- **Not pinning versions**: Dependency entries need specifiers. Pin exact versions for application projects.
- **Mixing pip and conda**: Declare dependencies once in `pyproject.toml`. Do not split them between managers.
- **Pip and Python mismatch**: Build with the active venv interpreter. Use `python -m pip install .` inside the venv.
- **Typosquatting**: A typo in a dependency name fails resolution or fetches the wrong package. Check names against PyPI.

## Quick Summary
- `pyproject.toml` stores metadata, dependencies, and tool settings.
- `[project]` holds name, version, and dependencies.
- `[build-system]` declares the build backend.
- `[tool.*]` tables configure formatter, linter, and test tools.
- `pip install .` installs the project into the active venv.
- Pin dependency versions and verify names.
