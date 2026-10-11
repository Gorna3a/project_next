# Content Spec (shared rules for all templates)

## Shared enums (single source of truth)

| Field        | Allowed values                                              |
| :----------- | :---------------------------------------------------------- |
| `difficulty` | `beginner`, `intermediate`, `advanced` (used by ALL types)  |
| `status`     | `draft`, `review`, `published`, `archived`                  |
| `language`   | BCP-47 code: `en`, `fr`, `ar`                               |
| `type`       | `course`, `module`, `theory`, `workshop`, `lab`, `quiz`, `review`, `certification-project` |

## Shared frontmatter (every file)

```yaml
id:          # kebab-case, unique across the platform
title:
type:        # one of the types above
status:      # draft | review | published | archived
language:    # en | fr | ar
lastUpdated: # YYYY-MM-DD
tags: []     # 3-5 tags
```

Child files (module, lesson, workshop, lab, quiz, review) also carry:

```yaml
moduleId:    # parent module id (module files use courseId instead)
order:       # integer, unique within the parent. THIS is the only source of ordering.
```

## Ordering rule
Sequences are NEVER hand-maintained in the body. Build module and lesson lists
by querying `courseId` / `moduleId` and sorting by `order`.

## Test DSL (used by workshops, labs, and capstones)

Every test is an object: `{ "type": ..., "message": "...", "weight": 1, "required": false }`.
`weight` defaults to 1. `required: true` means the submission cannot pass if this test fails.
Tests are declarative data. They must NEVER be evaluated as raw code strings. The runner
executes student code in a sandbox and checks the declared type.

| `type`              | Extra fields                          | Passes when                                        |
| :------------------ | :------------------------------------ | :------------------------------------------------- |
| `output-equals`     | `value`, `input?`                     | stdout (trimmed) equals `value`                    |
| `output-contains`   | `value`, `input?`                     | stdout contains `value`                            |
| `output-matches`    | `pattern`, `flags?`                   | stdout matches the regex                           |
| `function-returns`  | `call`, `expected`                    | calling `call` returns a value deep-equal to `expected` |
| `function-throws`   | `call`, `errorType?`                  | calling `call` throws                              |
| `code-contains`     | `value`                               | source code contains `value`                       |
| `code-not-contains` | `value`                               | source code does not contain `value`               |
| `file-exists`       | `path`                                | the file exists in the workspace                   |
| `file-contains`     | `path`, `value`                       | the file contains `value`                          |
| `dom-selector`      | `selector`, `count?`, `text?`         | the selector matches (optionally count / text)    |

Example:

```json
[
  { "type": "function-returns", "call": "add(2, 3)", "expected": 5, "message": "add(2, 3) should return 5", "weight": 2, "required": true },
  { "type": "code-not-contains", "value": "eval(", "message": "Do not use eval()" }
]
```

## Parser contract (the import script reads files mechanically)

Do not rename, reorder, or add alternative forms of anything below.

- **File name** is `<id>.md` (e.g. `les-what-is-javascript.md`). `_`-prefixed files and `README.md` are ignored.
- **Frontmatter** keys exactly as in the templates. No YAML comments in final files.
- **Headings** exactly as in the templates (text and level). Required headings are checked per type.
- **Workshop:** each step is `## Step N: Title`, numbered from 1, containing exactly these `###` sections:
  Instructions, Hints (numbered list), Starter State / Code, Solution State / Code, Evaluation Tests
  (a fenced `json` block holding an array of tests).
- **Lab:** sections Objective (H1), then Requirements (bullets), Starter State / Workspace (fenced code),
  Evaluation Tests (fenced `json`), Hints (`> **Hint 1:** text` lines), Reference Solution (fenced code).
- **Quiz:** `## Question N`, then `<!-- meta: {"type": "...", "points": 1} -->`, the question text,
  options as `- [ ]` / `- [x]` lines, an optional `> **Hint:** text`, then `*Explanation*: text`.
  Exactly 8 questions; true-false options are exactly `True` and `False`.
- **Review:** `covers` lists every theory lesson, workshop and lab of the module; the matrix is a Markdown
  table with 3 columns.
- **Certification project:** rubric is a table `| # | Requirement | Weight | Required |` with weights summing
  to 100; test weights in the JSON also sum to 100; at least two rows and two tests are required.
- **Code blocks** use fenced blocks with a language tag. HTML comments are removed from prose before import
  but kept inside code blocks.
