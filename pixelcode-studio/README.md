# PixelCode Sanity Studio (v2 content model)

This studio manages PixelCode course content: courses → modules → lessons
(`kind`: theory | workshop | lab | review | quiz | certification-project).

> Schema-only migration: the Next.js app (`src/core/services/sanity.ts`, course/lesson pages)
> still queries the old model and will fall back to starter content until the query rewrite follow-up.

## Local setup

1. Log in to Sanity:

```bash
npx sanity login
```

2. Confirm `.env` has the same project and dataset used by the app:

```bash
SANITY_STUDIO_PROJECT_ID=vfejjthj
SANITY_STUDIO_DATASET=production
```

3. Add local CORS origins after logging in:

```bash
npm run cors:add:app
npm run cors:add:studio
```

4. Start the studio:

```bash
npm run dev
```

The studio runs at `http://localhost:3333`.

## App env

The Next.js app at the repo root should use (see root `.env.example`):

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=vfejjthj
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
```

## Content flow

Ordering is query-driven — never hand-maintained lists:
`course` ← `module.course + module.order` ← `lesson.module + lesson.order`.
`review.covers[]` must list every theory/workshop/lab of its module.

Field notes:
- `course.language` = UI locale (`en/fr/ar`). Code language = `course.programmingLanguage`
  (`python/javascript/...`, optional on `module` as override; blank = inherit).
- `lesson.body` / `instructions` / `prompt` stay Markdown — render with a Markdown renderer in the app.
- Test `expected` values are JSON strings (`JSON.parse` them in the runner).
- Imported docs get `_id = drafts.<file-id>` with weak refs; publish in Studio after review.

## Markdown import (courses/pixelcode-import)

```bash
# from courses/pixelcode-import/pixelcode-import (needs its own npm install)
node cli.mjs validate ./sample-course
node cli.mjs ndjson ./content/javascript --out js.ndjson
npx sanity dataset import js.ndjson production --missing
```

Old `challenge` type was removed — labs/workshops/certification-projects cover it via the test DSL.
