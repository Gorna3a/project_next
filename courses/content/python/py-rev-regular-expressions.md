---
id: "py-rev-regular-expressions"
type: "review"
title: "Regular Expressions Quick Reference"
moduleId: "py-mod-12-regular-expressions"
order: 6
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
covers: ["py-les-regex-basics", "py-les-the-re-module", "py-les-groups-and-lookarounds", "py-ws-text-extractor", "py-lab-log-parser"]
tags: ["python", "regex", "re", "reference"]
---

# Quick Reference Summary

## Core Terminology / Formula Matrix
| Term / Command | Definition / Formula | Common Usage |
| :--- | :--- | :--- |
| Raw string | String with backslashes preserved | `r"\d+"` |
| Literal | Character that matches itself | `a`, `3` |
| `.` | Any character except newline | `a.c` |
| Character class | One character from a set | `[abc]`, `[a-z]` |
| Negated class | One character not in a set | `[^abc]` |
| `\d` / `\D` | Digit / non-digit | `\d{3}` |
| `\w` / `\W` | Word character / non-word | `\w+` |
| `\s` / `\S` | Whitespace / non-whitespace | `\s+` |
| `*` | Zero or more, greedy | `a*` |
| `+` | One or more, greedy | `a+` |
| `?` | Zero or one, or lazy modifier | `a?`, `a*?` |
| `{n}` | Exactly n | `\d{4}` |
| `{n,m}` | Between n and m | `\d{2,4}` |
| `^` | Start of string or line | `^Hello` |
| `$` | End of string or line | `world$` |
| `\b` | Word boundary | `\bcat\b` |
| `re.search` | First match anywhere | `re.search(r"\d+", text)` |
| `re.match` | Match at the start only | `re.match(r"\d+", text)` |
| `re.fullmatch` | Match the whole string | `re.fullmatch(r"\d{4}", text)` |
| `re.findall` | List of all matches | `re.findall(r"\d+", text)` |
| `re.finditer` | Iterator of match objects | `for m in re.finditer(...)` |
| `re.sub` | Replace matches | `re.sub(r"\d", "X", text)` |
| `re.split` | Split on a pattern | `re.split(r"[,; ]+", text)` |
| `re.compile` | Compile a reusable pattern | `re.compile(r"\d+")` |
| `re.IGNORECASE` | Case-insensitive matching | `re.I` |
| `re.MULTILINE` | `^` and `$` match line boundaries | `re.M` |
| `re.DOTALL` | `.` matches newlines | `re.S` |
| Capturing group | Parenthesized capture | `(\d{4})` |
| Named group | Capture with a name | `(?P<year>\d{4})` |
| Non-capturing group | Group without capture | `(?:https?://)` |
| Alternation | Match one of several | `cat\|dog` |
| Greedy | Match as much as possible | `.*` |
| Lazy | Match as little as possible | `.*?` |
| Lookahead | Assert following text | `(?= dollars)` |
| Lookbehind | Assert preceding text | `(?<=\$)` |
| Backreference | Repeat an earlier capture | `\1` |
| Match object | Result with text and groups | `match.group()` |
| `group(n)` | nth captured group | `match.group(1)` |
| `groups()` | Tuple of all captures | `match.groups()` |
| `groupdict()` | Dictionary of named captures | `match.groupdict()` |
| `start()` / `end()` | Match positions | `match.start()` |

## Key Concepts Comparison
- **`search` vs. `match` vs. `fullmatch`**: `search` finds a match anywhere. `match` checks only the start. `fullmatch` requires the whole string.
- **`findall` vs. `finditer`**: `findall` returns strings or tuples. `finditer` returns match objects with positions and groups.
- **Greedy vs. lazy**: Greedy quantifiers take as much as possible. Lazy quantifiers add `?` and take as little as possible.
- **Capturing vs. non-capturing group**: Capturing groups create numbered and named captures. Non-capturing groups only group.
- **Lookahead vs. consumption**: A lookahead asserts without consuming characters. A normal pattern consumes them.
- **Lookbehind vs. lookahead**: Lookbehind checks before the current position. Lookahead checks after it.
- **Raw string vs. normal string**: Raw strings preserve backslashes. Normal strings process escapes such as `\n`.
- **`sub` with a string vs. a function**: A string replacement uses backreferences. A function receives the match and returns text.
- **Compiled vs. uncompiled**: Compiled patterns avoid recompiling and are faster in loops.
- **`split` vs. `str.split`**: `re.split` uses a pattern and can include captures.
- **Regex vs. string methods**: Use string methods for simple literal searches; use regex for patterns.
- **Regex vs. parsers**: Regex cannot reliably parse nested structures such as HTML or JSON.

## Critical Syntax / Templates
```python
# Basic search and safe group access
import re

match = re.search(r"\d+", "Order 42 shipped")
if match is not None:
    print(match.group())
    print(match.start(), match.end())
```

```python
# match, fullmatch, and findall
import re

print(re.match(r"\d+", "42 shipped"))
print(re.fullmatch(r"\d{4}", "2024"))
print(re.findall(r"\d+", "ids: 12, 34, 56"))
```

```python
# finditer with positions
import re

for match in re.finditer(r"\d+", "ids: 12, 34, 56"):
    print(match.group(), match.start())
```

```python
# sub and split
import re

text = "Call 555-1234 today"
print(re.sub(r"\d", "X", text))
print(re.sub(r"\d+", "[number]", text, count=1))
print(re.split(r"[,; ]+", "apple,banana;cherry orange"))
```

```python
# Compiled pattern with flags
import re

pattern = re.compile(r"cat", re.IGNORECASE)
print(pattern.findall("Cat CAT cat"))
```

```python
# Capturing and named groups
import re

match = re.search(r"(?P<year>\d{4})-(?P<month>\d{2})-(?P<day>\d{2})", "2024-05-17")
print(match.group("year"))
print(match.groupdict())
print(match.groups())
```

```python
# Non-capturing group and alternation
import re

print(re.findall(r"gr(?:a|e)y", "gray grey"))
```

```python
# Greedy vs lazy
import re

text = "<b>bold</b> and <i>italic</i>"
print(re.findall(r"<.*>", text))
print(re.findall(r"<.*?>", text))
```

```python
# Lookahead and lookbehind
import re

print(re.search(r"\d+(?= dollars)", "price: 42 dollars").group())
print(re.search(r"(?<=\$)\d+", "total: $42").group())
```

```python
# Backreference
import re

print(re.findall(r"(\w+)\s+\1", "hello hello world world"))
```

```python
# Log parsing pattern
import re

LOG_PATTERN = re.compile(
    r"(?P<date>\d{4}-\d{2}-\d{2}) "
    r"(?P<time>\d{2}:\d{2}:\d{2}) "
    r"(?P<level>[A-Z]+) "
    r"(?P<message>.*)"
)

match = LOG_PATTERN.match("2024-03-15 10:30:00 INFO User alice logged in")
print(match.groupdict())
```
