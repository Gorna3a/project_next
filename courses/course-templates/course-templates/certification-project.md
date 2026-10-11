---
# [REQUIRED] Unique identifier. Example: "cert-full-seo-strategy"
id: "[PROJECT_ID]"

# [REQUIRED] Set strictly to "certification-project"
type: "certification-project"

# [REQUIRED] Title. Example: "Comprehensive Site Audit & Strategy"
title: "[PROJECT_TITLE]"

# [REQUIRED] "course" or "module": what this project certifies.
scope: "course"

# [REQUIRED] ID of the course or module named in `scope`.
targetId: "[COURSE_OR_MODULE_ID]"

# [REQUIRED] beginner | intermediate | advanced
difficulty: "intermediate"

# [REQUIRED] draft | review | published | archived
status: "draft"

# [REQUIRED] en | fr | ar
language: "en"

# [REQUIRED] YYYY-MM-DD
lastUpdated: "YYYY-MM-DD"

# [REQUIRED] Estimated completion time in hours.
estimatedHours: 4

# [REQUIRED] Percentage of total weighted score needed to pass (0-100). Recommended 80-90.
passingGradePercent: 80

# [REQUIRED] 3-5 tags.
tags: ["tag_1", "tag_2", "tag_3"]
---

# Capstone Objective
<!-- Instruction for AI/Author: Describe the real-world scenario, output requirements, and the final goal. -->
[WRITE_DETAILED_CAPSTONE_DESCRIPTION]

## Functional Deliverables
<!-- Instruction for AI/Author: Specific artifacts the student must produce or submit. -->
1. [DELIVERABLE_1_E_G_AUDIT_REPORT]
2. [DELIVERABLE_2_E_G_IMPLEMENTATION_CODE]
3. [DELIVERABLE_3_E_G_METRICS_DASHBOARD]

## Requirements & Rubric
<!-- Instruction for AI/Author: Human-readable criteria. Each should map to a test below. Mark which are required. -->
| # | Requirement | Weight | Required |
| :-- | :--- | :--- | :--- |
| 1 | [DETAILED_EVALUATION_CRITERION] | 40 | Yes |
| 2 | [DETAILED_EVALUATION_CRITERION] | 30 | Yes |
| 3 | [DETAILED_EVALUATION_CRITERION] | 20 | No |
| 4 | [DETAILED_EVALUATION_CRITERION] | 10 | No |

## Starter Workspace
```[LANGUAGE_OR_FORMAT]
[STARTER_WORKSPACE_OR_TEMPLATE_STRUCTURE]
```

## Automated Validation Criteria
<!-- Test types and fields are defined in _spec.md. Weights should match the rubric table above. -->
```json
[
  {
    "type": "file-exists",
    "path": "[REQUIRED_FILE_PATH]",
    "message": "[FAILURE_EXPLANATION_1]",
    "weight": 40,
    "required": true
  },
  {
    "type": "function-returns",
    "call": "[FUNCTION_CALL]",
    "expected": "[EXPECTED_VALUE]",
    "message": "[FAILURE_EXPLANATION_2]",
    "weight": 30,
    "required": true
  }
]
```
