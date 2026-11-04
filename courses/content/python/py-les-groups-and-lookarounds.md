---
id: "py-les-groups-and-lookarounds"
type: "theory"
title: "Groups and Lookarounds"
moduleId: "py-mod-12-regular-expressions"
order: 3
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 20
tags: ["python", "regex", "groups", "lookarounds", "greedy"]
---

# Concept Overview

Groups let you extract parts of a match. A capturing group is a parenthesized section whose text is available through `group(1)`, `group(2)`, and so on. Named groups give those sections readable names. Non-capturing groups group without capturing.

This lesson also covers alternation, greedy and lazy quantifiers, and brief lookahead and lookbehind assertions. These tools make patterns more precise without consuming extra characters.

## Key Principles & Frameworks

### Capturing groups

Parentheses create a capturing group:

```python
import re

match = re.search(r"(\d{4})-(\d{2})-(\d{2})", "Date: 2024-05-17")
print(match.group(0))
print(match.group(1))
print(match.group(2))
print(match.group(3))
print(match.groups())
```

Output:

```text
2024-05-17
2024
05
17
('2024', '05', '17')
```

`group(0)` is the whole match. `groups()` returns a tuple of all captured groups. Group numbering starts at 1.

### Named groups

Use `(?P<name>...)` to capture a group by name:

```python
import re

match = re.search(r"(?P<year>\d{4})-(?P<month>\d{2})-(?P<day>\d{2})", "2024-05-17")
print(match.group("year"))
print(match.group("month"))
print(match.groupdict())
```

Output:

```text
2024
05
{'year': '2024', 'month': '05', 'day': '17'}
```

Named groups make patterns self-documenting and let you use `groupdict()` instead of remembering positions.

### Non-capturing groups

Use `(?:...)` when you need grouping but do not want a capture:

```python
import re

match = re.search(r"(?:https?://)?example\.com", "https://example.com")
print(match.group())
print(match.groups())
```

Output:

```text
https://example.com
()
```

The group matches the optional scheme, but `groups()` is empty. Non-capturing groups keep group numbers clean.

### Alternation

The `|` operator matches one of several alternatives:

```python
import re

print(re.findall(r"cat|dog", "cat dog bird"))
print(re.findall(r"gr(a|e)y", "gray grey"))
```

Output:

```text
['cat', 'dog']
['a', 'e']
```

In the second pattern, the group captures the differing letter. Use a non-capturing group when you do not need that capture: `gr(?:a|e)y`.

### Greedy vs lazy quantifiers

A greedy quantifier matches as much as possible. Adding `?` makes it lazy, matching as little as possible:

```python
import re

text = "<b>bold</b> and <i>italic</i>"
print(re.findall(r"<.*>", text))
print(re.findall(r"<.*?>", text))
```

Output:

```text
['<b>bold</b> and <i>italic</i>']
['<b>', '</b>', '<i>', '</i>']
```

The greedy `.*` consumes everything up to the last `>`. The lazy `.*?` stops at the first `>`. Use lazy quantifiers when a shorter match is correct.

### Lookahead

A lookahead asserts that a pattern follows, without consuming it:

```python
import re

text = "price: 42 dollars"
match = re.search(r"\d+(?= dollars)", text)
print(match.group())
```

Output:

```text
42
```

`(?= dollars)` checks that ` dollars` comes next. The match contains only `42`. A negative lookahead `(?!...)` asserts that the pattern does not follow.

### Lookbehind

A lookbehind asserts that a pattern precedes, without consuming it:

```python
import re

text = "total: $42"
match = re.search(r"(?<=\$)\d+", text)
print(match.group())
```

Output:

```text
42
```

`(?<=\$)` checks for a dollar sign before the digits. The match contains only `42`. Python's standard lookbehind must have a fixed width. A negative lookbehind `(?<!...)` asserts that the pattern does not precede.

### Backreferences

A backreference matches the same text as an earlier group:

```python
import re

print(re.findall(r"(\w+)\s+\1", "hello hello world world"))
```

Output:

```text
['hello', 'world']
```

`\1` refers to the first capturing group. This is useful for matching repeated words or paired delimiters.

### Combining groups and lookarounds

Groups and assertions can be combined for precise extraction:

```python
import re

text = "user=ana score=92; user=ben score=78"
pattern = r"user=(?P<name>\w+)\s+score=(?P<score>\d+)"
for match in re.finditer(pattern, text):
    print(match.groupdict())
```

Output:

```text
{'name': 'ana', 'score': '92'}
{'name': 'ben', 'score': '78'}
```

Named groups plus `finditer` give structured records without manual slicing.

## Common Pitfalls & Anti-Patterns
- **Forgetting that groups change `findall` output**: With one group, `findall` returns the group text, not the whole match.
- **Using capturing groups unnecessarily**: Use `(?:...)` when you do not need the captured text.
- **Greedy matching too much**: `.*` can span across delimiters. Use `.*?` or a more specific class.
- **Variable-width lookbehind**: Python does not support lookbehind of variable length. Use a fixed-width pattern.
- **Confusing lookahead with consumption**: A lookahead does not consume characters, so it does not advance the match position.
- **Overusing backreferences**: They can make patterns hard to read and slow.
- **Assuming groups are numbered after alternation**: Group numbers follow the order of opening parentheses, not the matched branch.
- **Nested groups with the same name**: Named groups must have unique names in a pattern.
- **Lookarounds with side effects**: Lookarounds should be pure assertions; do not rely on captures inside them.
- **Parsing HTML with regex**: Lookarounds and groups cannot handle nested tags reliably.

## Quick Summary
- Parentheses create capturing groups.
- `group(n)` returns the nth capture; `groups()` returns all captures.
- Named groups use `(?P<name>...)` and `groupdict()`.
- Non-capturing groups use `(?:...)`.
- Alternation uses `|`.
- Greedy quantifiers match as much as possible; lazy ones add `?`.
- Lookahead `(?=...)` and lookbehind `(?<=...)` assert without consuming.
- Backreferences such as `\1` repeat an earlier capture.
- Groups change the output of `findall`.
- Use non-capturing groups to keep numbering clean.
- Python lookbehind must have a fixed width.
- Combine groups with `finditer` for structured extraction.
- Avoid regex for nested formats.
- Test patterns with both greedy and lazy expectations.
