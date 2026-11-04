---
id: "py-quiz-regular-expressions"
type: "quiz"
title: "Regular Expressions Knowledge Check"
moduleId: "py-mod-12-regular-expressions"
order: 7
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
passingScorePercent: 80
shuffleQuestions: true
shuffleOptions: true
tags: ["python", "regex", "re", "quiz"]
---

# Questions

## Question 1
<!-- meta: {"type":"single","points":1} -->
Which function checks that the entire string matches a pattern?

- [x] `re.fullmatch`
- [ ] `re.match`
- [ ] `re.search`
- [ ] `re.findall`

*Explanation*: `fullmatch` succeeds only when the whole string matches. `match` checks only the start, and `search` finds a match anywhere.

---

## Question 2
<!-- meta: {"type":"code-output","points":1} -->
What does this code print?

```python
import re

text = "Order 42 shipped"
match = re.search(r"\d+", text)
print(match.group())
print(match.start())
```

- [x] `42` then `6`
- [ ] `42` then `0`
- [ ] `Order` then `0`
- [ ] It raises `AttributeError`

*Explanation*: `search` finds `42` at index 6. `start()` returns that position.

---

## Question 3
<!-- meta: {"type":"true-false","points":1} -->
`re.match(r"\d+", "order 42")` returns a match object.

- [ ] True
- [x] False

*Explanation*: `match` only tries to match at the beginning of the string. Since `order 42` starts with a letter, it returns `None`.

---

## Question 4
<!-- meta: {"type":"multiple","points":2} -->
Which statements are correct? Select all that apply.

- [x] `re.findall` returns strings unless the pattern has groups
- [x] A raw string keeps backslashes intact
- [x] A greedy `.*` can match more than intended
- [ ] `re.sub` replaces only the first match by default
- [ ] `.` matches a newline by default

*Explanation*: `findall` returns group text when groups are present. Raw strings prevent escape processing. Greedy quantifiers take as much as possible. `sub` replaces all matches, and `.` does not match a newline unless `re.DOTALL` is used.

---

## Question 5
<!-- meta: {"type":"code-output","points":1} -->
What does this code print?

```python
import re

text = "<b>bold</b>"
print(re.findall(r"<.*>", text))
print(re.findall(r"<.*?>", text))
```

- [x] `['<b>bold</b>']` then `['<b>', '</b>']`
- [ ] `['<b>', '</b>']` then `['<b>bold</b>']`
- [ ] `['<b>bold</b>']` then `['<b>bold</b>']`
- [ ] It raises `re.error`

*Explanation*: The greedy `.*` consumes everything up to the last `>`. The lazy `.*?` stops at the first `>`.

---

## Question 6
<!-- meta: {"type":"single","points":1} -->
What does a non-capturing group `(?:...)` do?

- [x] Groups part of a pattern without creating a capture
- [ ] Captures the text but hides it from `findall`
- [ ] Makes the quantifier lazy
- [ ] Matches a literal question mark

*Explanation*: A non-capturing group groups subpatterns for quantifiers or alternation without adding a numbered or named capture.

---

## Question 7
<!-- meta: {"type":"code-output","points":1} -->
What does this code print?

```python
import re

match = re.search(r"(?P<year>\d{4})-(?P<month>\d{2})", "2024-05-17")
print(match.group("year"))
print(match.groupdict())
```

- [x] `2024` then `{'year': '2024', 'month': '05'}`
- [ ] `2024` then `('2024', '05')`
- [ ] `2024-05` then `{'year': '2024', 'month': '05'}`
- [ ] It raises `KeyError`

*Explanation*: Named groups are accessible by name and through `groupdict()`.

---

## Question 8
<!-- meta: {"type":"multiple","points":2} -->
When should you prefer `re.compile`? Select all that apply.

- [x] When the same pattern is used repeatedly
- [x] When the pattern is used inside a loop
- [ ] When the pattern contains a group
- [ ] When the text is very short

*Explanation*: Compiling once avoids repeated parsing of the pattern. It is especially helpful in loops. Groups and short text do not require compilation.
