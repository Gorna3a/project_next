---
id: "py-ws-text-extractor"
type: "workshop"
title: "Text Extractor"
moduleId: "py-mod-12-regular-expressions"
order: 4
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 45
tags: ["python", "regex", "extraction", "workshop"]
---

# Workshop Overview

You will extract emails, phone numbers, and dates from a fixed block of text. Each step adds one pattern and returns a list of matches.

The text stays fixed. Every function returns a list, so the tests call them directly.

---

## Step 1: Extract emails

### Instructions
Define `find_emails(text)` that returns all email addresses in `text` using `re.findall`.

Use the pattern `r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}"`.

Print the result for `text`.

### Hints
1. Import `re`.
2. Pass the pattern and `text` to `re.findall`.
3. Return the list directly.

### Starter State / Code
```python
import re

text = """Contact us at support@example.com or sales@example.org.
Call 555-123-4567 or 555.987.6543.
Important dates: 2024-03-15 and 03/22/2024.
"""

# Define find_emails below.
```

### Solution State / Code
```python
import re

text = """Contact us at support@example.com or sales@example.org.
Call 555-123-4567 or 555.987.6543.
Important dates: 2024-03-15 and 03/22/2024.
"""


def find_emails(text):
    return re.findall(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}", text)


print(find_emails(text))
```

### Evaluation Tests
```json
[
  { "type": "function-returns", "call": "find_emails(text)", "expected": ["support@example.com", "sales@example.org"], "message": "Both email addresses should be found", "weight": 2, "required": true },
  { "type": "function-returns", "call": "find_emails(\"no email here\")", "expected": [], "message": "Text without emails should return an empty list", "required": true },
  { "type": "code-contains", "value": "re.findall", "message": "Use re.findall", "required": true },
  { "type": "code-contains", "value": "r\"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}\"", "message": "Use the email pattern", "required": true }
]
```

---

## Step 2: Extract phone numbers

### Instructions
Keep `find_emails`. Define `find_phones(text)` that returns all phone numbers. A phone number has three digits, a separator (`-` or `.`), three digits, a separator, and four digits.

Print the result for `text`.

### Hints
1. Use the pattern `r"\\d{3}[-.]\\d{3}[-.]\\d{4}"`.
2. Pass it to `re.findall`.
3. The two phone numbers use different separators.

### Starter State / Code
```python
import re

text = """Contact us at support@example.com or sales@example.org.
Call 555-123-4567 or 555.987.6543.
Important dates: 2024-03-15 and 03/22/2024.
"""


def find_emails(text):
    return re.findall(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}", text)


# Define find_phones below.
```

### Solution State / Code
```python
import re

text = """Contact us at support@example.com or sales@example.org.
Call 555-123-4567 or 555.987.6543.
Important dates: 2024-03-15 and 03/22/2024.
"""


def find_emails(text):
    return re.findall(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}", text)


def find_phones(text):
    return re.findall(r"\d{3}[-.]\d{3}[-.]\d{4}", text)


print(find_emails(text))
print(find_phones(text))
```

### Evaluation Tests
```json
[
  { "type": "function-returns", "call": "find_phones(text)", "expected": ["555-123-4567", "555.987.6543"], "message": "Both phone numbers should be found", "weight": 2, "required": true },
  { "type": "function-returns", "call": "find_phones(\"no phone\")", "expected": [], "message": "Text without phones should return an empty list", "required": true },
  { "type": "code-contains", "value": "r\"\\d{3}[-.]\\d{3}[-.]\\d{4}\"", "message": "Use the phone pattern", "required": true }
]
```

---

## Step 3: Extract dates

### Instructions
Keep the previous functions. Define `find_dates(text)` that returns all dates. A date is either `YYYY-MM-DD` or `MM/DD/YYYY`.

Print the result for `text`.

### Hints
1. Use alternation to match either format.
2. The pattern is `r"\\d{4}-\\d{2}-\\d{2}|\\d{2}/\\d{2}/\\d{4}"`.
3. `re.findall` returns the full match for a pattern without groups.

### Starter State / Code
```python
import re

text = """Contact us at support@example.com or sales@example.org.
Call 555-123-4567 or 555.987.6543.
Important dates: 2024-03-15 and 03/22/2024.
"""


def find_emails(text):
    return re.findall(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}", text)


def find_phones(text):
    return re.findall(r"\d{3}[-.]\d{3}[-.]\d{4}", text)


# Define find_dates below.
```

### Solution State / Code
```python
import re

text = """Contact us at support@example.com or sales@example.org.
Call 555-123-4567 or 555.987.6543.
Important dates: 2024-03-15 and 03/22/2024.
"""


def find_emails(text):
    return re.findall(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}", text)


def find_phones(text):
    return re.findall(r"\d{3}[-.]\d{3}[-.]\d{4}", text)


def find_dates(text):
    return re.findall(r"\d{4}-\d{2}-\d{2}|\d{2}/\d{2}/\d{4}", text)


print(find_emails(text))
print(find_phones(text))
print(find_dates(text))
```

### Evaluation Tests
```json
[
  { "type": "function-returns", "call": "find_dates(text)", "expected": ["2024-03-15", "03/22/2024"], "message": "Both date formats should be found", "weight": 2, "required": true },
  { "type": "function-returns", "call": "find_dates(\"no dates\")", "expected": [], "message": "Text without dates should return an empty list", "required": true },
  { "type": "code-contains", "value": "r\"\\d{4}-\\d{2}-\\d{2}|\\d{2}/\\d{2}/\\d{4}\"", "message": "Use the date pattern", "required": true }
]
```
