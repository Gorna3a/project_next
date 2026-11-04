---
id: "py-les-choosing-and-trusting-packages"
type: "theory"
title: "Choosing and Trusting Packages"
moduleId: "py-mod-15-environments-and-packaging"
order: 5
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 18
tags: ["python", "security", "pypi", "supply-chain", "pinning"]
---

# Concept Overview

Installing a package is running someone else's code. A PyPI name alone does not guarantee the package is safe, maintained, or the one you meant. Evaluate a package before adding it, pin versions so installs repeat exactly, and treat typosquatting as a real supply-chain risk.

## Key Principles & Frameworks

### Reading a package page

Check releases, last activity, description, and license on the PyPI page. A recent release, a clear description, and a matching project link are positive signals. A package with no releases or a mismatched description is a warning.

### Pinning for reproducibility

```bash
python -m pip install "requests==2.32.3"
```

Exact pins repeat the same code on every machine. Prefer `==` pins for applications. Range specifiers are looser and install the newest allowed release.

```python
specifiers = ["==", ">=", "<", "~=", "!="]
print(", ".join(specifiers))
```

Output:

```text
==, >=, <, ~=
```

The output lists the operators from the version specifiers lesson. Pins use `==`; ranges use the others.

### Hash checking

```bash
python -m pip install --require-hashes -r requirements.txt
```

Hash checking verifies downloaded files against recorded hashes. A hashes file detects tampering in transit, but the hashes must come from a trusted source.

### Typosquatting

Attackers publish packages with names one letter off popular packages. `requests` and `reqeusts` look similar. Copy names from official documentation or PyPI links. Never type a package name from memory when money, credentials, or production data are at stake.

### Supply-chain risks

Dependencies can be abandoned, compromised, or yanked. Prefer fewer packages, standard library alternatives where reasonable, and packages with active maintainers. Audit what is installed:

```bash
python -m pip show requests
```

`show` prints the installed package location and metadata. Check the location points into your venv, not the global interpreter.

## Common Pitfalls & Anti-Patterns
- **Typosquatting**: Installing a misspelled name fetches an unrelated package. Copy names from trusted sources.
- **Installing globally**: Global installs cannot be audited per project. Install into the venv.
- **Committing the virtual environment**: A committed venv can hide where packages came from. Commit requirements, not environments.
- **Not pinning versions**: Floating versions fetch whatever is newest that day. Pin exact versions.
- **Mixing pip and conda**: Two managers in one environment break reproducibility. Use one.
- **Pip and Python mismatch**: Verify `sys.executable` so installs land in the intended venv.

## Quick Summary
- Package names alone do not prove trust.
- Check releases, activity, description, and license.
- Pin exact versions for reproducibility.
- Hash checking verifies downloads against recorded hashes.
- Typosquatting steals installs from misspelled names.
- Copy names from trusted documentation.
- Fewer, maintained packages reduce supply-chain risk.
