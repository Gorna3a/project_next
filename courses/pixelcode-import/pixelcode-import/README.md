# pixelcode-import

Validates PixelCode course Markdown files and imports them into Sanity **as drafts**.

```
AI writes .md files  ->  validate  ->  (fix)  ->  import as drafts  ->  review + publish in Studio
```

## Setup (once)

1. `npm install`
2. Copy the files in `schema/` into your Sanity Studio project, and register them:
   ```ts
   import { schemaTypes } from './schemaTypes'   // wherever you put schema/index.ts
   export default defineConfig({ /* ... */ schema: { types: schemaTypes } })
   ```
   If you already have your own `course` / `module` / `lesson` types, compare field names with the
   table below and adjust `lib/toSanity.mjs` instead.
3. Only for direct import: copy `.env.example` to `.env` and fill it in.

## Daily use

Put all generated files (any sub-folders) in one folder. Each file must be named `<id>.md`.

```bash
# 1. Check everything. No network. Exit code 1 if there are errors.
node cli.mjs validate ./content/javascript

# 2a. Safest import: write NDJSON, then let the Sanity CLI do the import
node cli.mjs ndjson ./content/javascript --out js.ndjson
npx sanity dataset import js.ndjson production --missing    # add new docs, never overwrite
# (use --replace instead to overwrite documents with the same _id)

# 2b. Or import directly with the script (dry run first, then --apply)
node cli.mjs import ./content/javascript
node cli.mjs import ./content/javascript --apply --only-new
```

Try it on the included sample: `node cli.mjs validate sample-course`

`validate --strict` treats warnings as errors.

## What validation checks

- Frontmatter: required fields per type, enums (`difficulty`, `status`, `language`, `type`), kebab-case IDs,
  `id` equals the file name, `YYYY-MM-DD` dates, 3-5 tags, numeric ranges.
- Leftovers: unfilled `[PLACEHOLDERS]`, `Instruction for AI/Author` comments, `# [REQUIRED]` comments.
- Structure: required headings per type; workshops have 3-5 numbered steps, each with Instructions, Hints,
  Starter, Solution and JSON tests; labs have requirements, tests, hints and a reference solution.
- Quizzes: exactly 8 questions, valid `<!-- meta -->` comments, correct-answer counts per question type,
  `True`/`False` options for true-false, a code block for code-output, explanations present.
- Tests: only test types from `_spec.md`, required fields per type, valid regexes, integer weights.
- Capstone: rubric weights and test weights both sum to 100, at least 2 required rows and 2 required tests.
- Cross-file: unique IDs, parents exist (`courseId`, `moduleId`, `targetId`), `order` unique and gap-free per
  parent, module content in order theory -> workshop -> lab -> review -> quiz, 3-6 theory lessons and exactly
  one workshop/lab/review/quiz per module, review `covers` lists every lesson/workshop/lab of its module.

Change the numbers (quiz length, lesson counts, ...) in `lib/constants.mjs` if you change the roadmap.

## What validation CANNOT check (keep the AI audit step)

- That every solution really passes its own tests. **Run them in a real JavaScript/Python environment.**
- That concepts are not used before they are taught.
- That hints and instructions do not give away the answer.
- Writing quality, accuracy, and tone.

## How Markdown maps to Sanity

| Markdown file | Sanity `_type` | `kind` | Notes |
| :--- | :--- | :--- | :--- |
| course | `course` | | `body` = Markdown, `learningObjectives` = list |
| module | `module` | | `course` reference, `order`, `outcomes` list |
| theory | `lesson` | `theory` | `module` reference, `order`, `body` = Markdown |
| workshop | `lesson` | `workshop` | `steps[]` with hints, starter, solution, tests |
| lab | `lesson` | `lab` | `starter`, `tests[]`, `hints[]`, `referenceSolution`, `body` |
| quiz | `lesson` | `quiz` | `questions[]` with options, points, hint, explanation |
| review | `lesson` | `review` | `covers[]` references, `body` |
| certification-project | `lesson` | `certification-project` | `scope`, `target` reference, `rubric[]`, `tests[]` |

- **Document IDs** are `drafts.<file id>`, so re-importing the same file updates the same document.
- **Prose stays Markdown** in `body` / `instructions` / `prompt` fields; render it with a Markdown renderer
  in your React app. Structured data (steps, tests, questions, rubric) is real fields you can query.
- **Test `expected` values** are stored as JSON strings (`JSON.parse` them in your runner).
- **References are weak** (`_weak` + `_strengthenOnPublish`) so documents import in any order while
  targets are still drafts. They become normal references when each document is published.
- Nothing is published by the script. Publish in Studio after review.

### Example query for your frontend

```groq
*[_type == "course" && slug.current == $slug][0]{
  title, description, difficulty, learningObjectives,
  "modules": *[_type == "module" && course._ref == ^._id] | order(order){
    title, description, order,
    "items": *[_type == "lesson" && module._ref == ^._id] | order(order){
      _id, kind, title, order, estimatedMinutes
    }
  }
}
```

## Re-import behaviour

- Default (`import --apply`): `createOrReplace` on the **draft**. Edits you made to that draft in Studio are
  overwritten. A published version, if any, is untouched (Studio shows the draft as an unpublished edit).
- `--only-new`: skips any document whose draft or published version already exists. Use this to add new
  modules without touching content you have already reviewed.
- `sanity dataset import --missing` behaves like `--only-new`.

## Safety notes

- Use a token with the minimum permission that can write documents, keep it in `.env`, never commit it.
- Do a first run against a throwaway dataset (`sanity dataset create test`) before touching production.
- The Studio schema in `schema/` type-checks against `@sanity/types`, but was not run inside your Studio.
  Check it once in your own project.
