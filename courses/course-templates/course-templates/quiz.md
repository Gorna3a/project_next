---
# [REQUIRED] Unique identifier. Example: "quiz-seo-basics"
id: "[QUIZ_ID]"

# [REQUIRED] Set strictly to "quiz"
type: "quiz"

# [REQUIRED] Title. Example: "SEO Fundamentals Knowledge Check"
title: "[QUIZ_TITLE]"

# [REQUIRED] ID of the parent module.
moduleId: "[PARENT_MODULE_ID]"

# [REQUIRED] Position within the module (integer, unique per module).
order: 5

# [REQUIRED] draft | review | published | archived
status: "draft"

# [REQUIRED] en | fr | ar
language: "en"

# [REQUIRED] YYYY-MM-DD
lastUpdated: "YYYY-MM-DD"

# [REQUIRED] Minimum passing score percentage (0-100). Default 80.
passingScorePercent: 80

# [REQUIRED] Randomize question order and option order per attempt.
shuffleQuestions: true
shuffleOptions: true

# [REQUIRED] 3-5 tags.
tags: ["tag_1", "tag_2", "tag_3"]
---

# Questions

<!--
Question types (declare in the meta comment under each heading):
  single       exactly one "- [x]"
  multiple     one or more "- [x]" (all correct options must be selected)
  true-false   exactly two options: True / False
  code-output  question includes a code block; options are possible outputs
Points default to 1.
-->

## Question 1
<!-- meta: {"type": "single", "points": 1} -->
[WRITE_QUESTION_TEXT_HERE]

<!-- Use '- [ ]' for incorrect choices and '- [x]' for correct choices. -->
- [ ] [INCORRECT_OPTION_A]
- [x] [CORRECT_OPTION_B]
- [ ] [INCORRECT_OPTION_C]
- [ ] [INCORRECT_OPTION_D]

> **Hint:** [OPTIONAL_HINT_THAT_DOES_NOT_GIVE_THE_ANSWER]

*Explanation*: [WHY_OPTION_B_IS_CORRECT]

---

## Question 2
<!-- meta: {"type": "multiple", "points": 2} -->
[WRITE_QUESTION_TEXT_HERE]

- [x] [CORRECT_OPTION_A]
- [ ] [INCORRECT_OPTION_B]
- [x] [CORRECT_OPTION_C]
- [ ] [INCORRECT_OPTION_D]

*Explanation*: [WHY_A_AND_C_ARE_CORRECT]

---

## Question 3
<!-- meta: {"type": "true-false", "points": 1} -->
[WRITE_STATEMENT_HERE]

- [x] True
- [ ] False

*Explanation*: [WHY_THE_STATEMENT_IS_TRUE_OR_FALSE]

---

## Question 4
<!-- meta: {"type": "code-output", "points": 1} -->
What does this code print?

```[LANGUAGE]
[CODE_SNIPPET]
```

- [ ] [INCORRECT_OUTPUT_A]
- [ ] [INCORRECT_OUTPUT_B]
- [x] [CORRECT_OUTPUT_C]
- [ ] [INCORRECT_OUTPUT_D]

*Explanation*: [WALK_THROUGH_THE_EXECUTION]
