---
id: "py-mod-15-environments-and-packaging"
type: "module"
title: "Module 15: Environments and Packaging"
courseId: "python-programming"
order: 15
difficulty: "intermediate"
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
tags: ["python", "pip", "packaging", "environments", "pyproject"]
prerequisites: ["py-mod-14-data-structures"]
description: "Install and pin packages with pip, isolate projects with virtual environments, and declare dependencies in requirements.txt and pyproject.toml."
---

# Module Overview

This module covers dependency management and packaging in Python. You will install packages from PyPI with pip, isolate project dependencies with virtual environments, compare modern project tools, and describe dependencies in `pyproject.toml` and `requirements.txt`. You will also learn to evaluate third-party packages before trusting them.

Nothing is installed in the sandbox. Commands for pip, venv, Poetry, and similar tools are shown in non-graded `bash` blocks. Graded work creates and repairs configuration files with plain Python code.

## What You Will Be Able To Do
- Install, upgrade, uninstall, and inspect packages with pip
- Write pinned, reproducible `requirements.txt` files
- Create and activate virtual environments with `venv`
- Describe project metadata and dependencies in `pyproject.toml`
- Compare Pipenv, Poetry, uv, and Conda for common tasks
- Evaluate and pin third-party packages safely
- Avoid global installs, committed virtual environments, and typosquatting
