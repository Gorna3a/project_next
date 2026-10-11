---
# [REQUIRED] Unique identifier. Example: "ws-seo-audit"
id: "[WORKSHOP_ID]"

# [REQUIRED] Set strictly to "workshop"
type: "workshop"

# [REQUIRED] Title. Example: "Build a Competitor Analysis Matrix"
title: "[WORKSHOP_TITLE]"

# [REQUIRED] ID of the parent module.
moduleId: "[PARENT_MODULE_ID]"

# [REQUIRED] Position within the module (integer, unique per module).
order: 2

# [REQUIRED] draft | review | published | archived
status: "draft"

# [REQUIRED] en | fr | ar
language: "en"

# [REQUIRED] YYYY-MM-DD
lastUpdated: "YYYY-MM-DD"

# [REQUIRED] Estimated time to complete all steps, in minutes.
estimatedMinutes: 30

# [REQUIRED] 3-5 tags.
tags: ["tag_1", "tag_2", "tag_3"]

# NOTE: the step count is derived from the number of "## Step N" headings. Do not store it here.
---

# Workshop Overview
<!-- Instruction for AI/Author: Describe the final deliverable the student will build by following these steps. -->
[DESCRIBE_FINAL_PROJECT_DELIVERABLE]

---

## Step 1: [STEP_1_TITLE]

### Instructions
<!-- Instruction for AI/Author: 1-2 precise, actionable sentences telling the student what to write, calculate, or configure. -->
[WRITE_STEP_1_INSTRUCTIONS]

### Hints
<!-- Instruction for AI/Author: 1-3 progressive hints, from conceptual to specific. Never the full answer. -->
1. [HINT_1_CONCEPTUAL]
2. [HINT_2_MORE_SPECIFIC]

### Starter State / Code
```[LANGUAGE_OR_FORMAT]
[STARTER_STATE_HERE]
```

### Solution State / Code
```[LANGUAGE_OR_FORMAT]
[SOLUTION_STATE_HERE]
```

### Evaluation Tests
<!-- Test types and fields are defined in _spec.md -->
```json
[
  {
    "type": "output-contains",
    "value": "[EXPECTED_VALUE]",
    "message": "[ERROR_MESSAGE_IF_TEST_FAILS]"
  }
]
```

---

## Step 2: [STEP_2_TITLE]

### Instructions
[WRITE_STEP_2_INSTRUCTIONS]

### Hints
1. [HINT_1_CONCEPTUAL]
2. [HINT_2_MORE_SPECIFIC]

### Starter State / Code
```[LANGUAGE_OR_FORMAT]
[STARTER_STATE_STEP_2]
```

### Solution State / Code
```[LANGUAGE_OR_FORMAT]
[SOLUTION_STATE_STEP_2]
```

### Evaluation Tests
```json
[
  {
    "type": "code-contains",
    "value": "[EXPECTED_SNIPPET]",
    "message": "[ERROR_MESSAGE_IF_TEST_FAILS]"
  }
]
```
