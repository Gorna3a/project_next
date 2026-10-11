---
# [REQUIRED] Unique identifier. Example: "lab-keyword-extraction"
id: "[LAB_ID]"

# [REQUIRED] Set strictly to "lab"
type: "lab"

# [REQUIRED] Title. Example: "Extract Top Search Keywords from Raw Text"
title: "[LAB_TITLE]"

# [REQUIRED] ID of the parent module.
moduleId: "[PARENT_MODULE_ID]"

# [REQUIRED] Position within the module (integer, unique per module).
order: 3

# [REQUIRED] beginner | intermediate | advanced
difficulty: "beginner"

# [REQUIRED] draft | review | published | archived
status: "draft"

# [REQUIRED] en | fr | ar
language: "en"

# [REQUIRED] YYYY-MM-DD
lastUpdated: "YYYY-MM-DD"

# [REQUIRED] Estimated completion time in minutes.
estimatedMinutes: 20

# [REQUIRED] Percentage of total test weight needed to pass (0-100).
passingScorePercent: 100

# [REQUIRED] Number of failed attempts before the "Reveal solution" button appears. Use 0 to never reveal.
revealSolutionAfterAttempts: 3

# [REQUIRED] 3-5 tags.
tags: ["tag_1", "tag_2", "tag_3"]
---

# Objective
<!-- Instruction for AI/Author: Define the problem and expected result WITHOUT step-by-step guidance. -->
[WRITE_PROBLEM_STATEMENT_HERE]

## Requirements
<!-- Instruction for AI/Author: Strict technical or domain constraints the solution must satisfy. -->
- [REQUIREMENT_1]
- [REQUIREMENT_2]
- [REQUIREMENT_3]

## Starter State / Workspace
<!-- Instruction for AI/Author: Initial input data, skeleton file, or baseline environment. -->
```[LANGUAGE_OR_FORMAT]
[INITIAL_WORKSPACE_STATE]
```

## Evaluation Tests
<!-- Test types and fields are defined in _spec.md -->
```json
[
  {
    "type": "function-returns",
    "call": "[FUNCTION_CALL]",
    "expected": "[EXPECTED_VALUE]",
    "message": "[FAILURE_MESSAGE_1]",
    "weight": 2,
    "required": true
  },
  {
    "type": "code-not-contains",
    "value": "[FORBIDDEN_SNIPPET]",
    "message": "[FAILURE_MESSAGE_2]",
    "weight": 1
  }
]
```

## Hints
<!-- Instruction for AI/Author: Progressive hints, revealed one at a time. Never the full answer. -->
> [!TIP]
> **Hint 1:** [CONCEPTUAL_HINT]

> [!TIP]
> **Hint 2:** [MORE_SPECIFIC_HINT]

## Reference Solution
<!-- Shown only after revealSolutionAfterAttempts failed attempts. -->
```[LANGUAGE_OR_FORMAT]
[REFERENCE_SOLUTION]
```
