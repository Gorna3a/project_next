---
id: "py-les-the-re-module"
type: "theory"
title: "The re Module"
moduleId: "py-mod-12-regular-expressions"
order: 2
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 20
tags: ["python", "re", "search", "match", "findall"]
---

# Concept Overview

The `re` module applies regular expression patterns to strings. It provides functions for searching, matching, splitting, and replacing text. A match object contains the matched text and any captured groups.

This lesson covers the functions you will use most often: `search`, `match`, `fullmatch`, `findall`, `finditer`, `sub`, `split`, and `compile`. It also covers common flags such as `re.IGNORECASE` and `re.MULTILINE`.

## Key Principles & Frameworks

### search finds a match anywhere

`re.search(pattern, text)` scans the string and returns the first match, or `None`:

```python
import re

text = "Order 42 shipped"
match = re.search(r"\d+", text)

print(match.group())
print(match.start())
print(match.end())
```

Output:

```text
42
6
8
```

`group()` returns the matched text. `start()` and `end()` give its position. Always check for `None` before calling `group()`.

### match anchors at the start

`re.match(pattern, text)` tries to match only at the beginning of the string:

```python
import re

print(re.match(r"\d+", "42 shipped"))
print(re.match(r"\d+", "order 42"))
```

Output:

```text
<re.Match object; span=(0, 2), match='42'>
None
```

Use `match` when the pattern must start at the beginning. Use `search` when the match can appear anywhere.

### fullmatch requires the whole string

`re.fullmatch(pattern, text)` succeeds only when the entire string matches:

```python
import re

print(re.fullmatch(r"\d{4}", "2024"))
print(re.fullmatch(r"\d{4}", "2024-05"))
```

Output:

```text
<re.Match object; span=(0, 4), match='2024'>
None
```

`fullmatch` is useful for validation, where the whole input must fit the pattern.

### findall returns all matches

`re.findall(pattern, text)` returns a list of all non-overlapping matches:

```python
import re

text = "ids: 12, 34, 56"
print(re.findall(r"\d+", text))
```

Output:

```text
['12', '34', '56']
```

If the pattern contains one group, `findall` returns the group's text. If it contains multiple groups, it returns a list of tuples.

### finditer yields match objects

`re.finditer(pattern, text)` returns an iterator of match objects:

```python
import re

text = "ids: 12, 34, 56"
for match in re.finditer(r"\d+", text):
    print(match.group(), match.start())
```

Output:

```text
12 5
34 9
56 13
```

Use `finditer` when you need positions or groups. Use `findall` when you only need the strings.

### sub replaces matches

`re.sub(pattern, replacement, text)` replaces every match:

```python
import re

text = "Call 555-1234 today"
print(re.sub(r"\d", "X", text))
print(re.sub(r"\d+", "[number]", text))
```

Output:

```text
Call XXX-XXXX today
Call [number]-[number] today
```

The replacement can be a function that receives the match object:

```python
import re

text = "a1 b2 c3"
print(re.sub(r"\d", lambda match: str(int(match.group()) * 2), text))
```

Output:

```text
a2 b4 c6
```

### split divides on a pattern

`re.split(pattern, text)` splits a string wherever the pattern matches:

```python
import re

text = "apple,banana;cherry orange"
print(re.split(r"[,; ]+", text))
```

Output:

```text
['apple', 'banana', 'cherry', 'orange']
```

If the pattern contains a capturing group, the captured text is included in the result.

### compile for reuse

`re.compile(pattern)` creates a pattern object. Reusing it avoids recompiling the same pattern:

```python
import re

pattern = re.compile(r"\d+")
text = "a1 b22 c333"

print(pattern.findall(text))
print(pattern.sub("#", text))
```

Output:

```text
['1', '22', '333']
a# b# c#
```

Compiled patterns support the same methods: `search`, `match`, `findall`, `sub`, and others. Use compilation when the same pattern is used many times.

### Flags

Flags change how a pattern is interpreted:

```python
import re

print(re.findall(r"cat", "Cat CAT cat", re.IGNORECASE))
print(re.findall(r"^\w+", "first line\nsecond line", re.MULTILINE))
```

Output:

```text
['Cat', 'CAT', 'cat']
['first', 'second']
```

`re.IGNORECASE` makes matching case-insensitive. `re.MULTILINE` makes `^` and `$` match at line boundaries. `re.DOTALL` makes `.` match newlines. Flags can be combined with `|`.

### A safe search pattern

Always handle `None` from `search` and `match`:

```python
import re

match = re.search(r"\d+", "no digits here")
if match is None:
    print("No match")
else:
    print(match.group())
```

Output:

```text
No match
```

Calling `group()` on `None` raises `AttributeError`. Check first.

## Common Pitfalls & Anti-Patterns
- **Calling `group()` on `None`**: `search` and `match` return `None` when there is no match. Check first.
- **Confusing `match` and `search`**: `match` only checks the start. `search` checks anywhere.
- **Confusing `match` and `fullmatch`**: `match` allows trailing text. `fullmatch` requires the whole string.
- **Forgetting that `findall` returns strings**: It returns the whole match unless groups are present.
- **Assuming `sub` replaces once**: `sub` replaces all matches. Use `count=1` for one replacement.
- **Splitting on a pattern that matches at the edges**: This can produce empty strings at the start or end.
- **Recompiling in a loop**: Compile the pattern once outside the loop.
- **Ignoring flags**: Case sensitivity and multiline behavior are common sources of bugs.
- **Using `.` without `re.DOTALL`**: A dot does not match a newline by default.
- **Building patterns with string concatenation**: Use raw strings and keep patterns readable.

## Quick Summary
- `re.search` finds the first match anywhere.
- `re.match` matches only at the start.
- `re.fullmatch` requires the whole string to match.
- `re.findall` returns all matches as strings or tuples.
- `re.finditer` yields match objects with positions and groups.
- `re.sub` replaces matches; the replacement can be a function.
- `re.split` divides a string on a pattern.
- `re.compile` creates a reusable pattern object.
- Flags: `IGNORECASE`, `MULTILINE`, `DOTALL`.
- Always check for `None` before calling `group()`.
- Use `count` with `sub` to limit replacements.
- Compile patterns used in loops.
- Prefer `fullmatch` for validation.
- Keep patterns readable with raw strings.
- Test patterns against both matching and non-matching input.
