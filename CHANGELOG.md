# Changelog

All notable changes to the PixelCode product are documented here.

## [Unreleased]

### Added
- AI solution grading (`gradeSolution` in `src/core/services/ai.ts`): same
  Gemini model as the chatbot judges challenge attempts, returning a strict
  JSON verdict (correct/feedback/solution) at temperature 0.2; unparseable
  replies degrade to incorrect-with-raw-text, never XP.
- `/app/training` top-level route — challenges catalog moved from the Arena
  (`TrainingPage`, reused from `Arena/TrainingGrounds`).
- Root `CHANGELOG.md` created.
- 8 curated quiz challenges: JS Type Coercion, Python Tuple Mutability, SQL
  Filtering Groups, Java Array Sizing, C++ Pointers 101, Go Defer Order,
  Rust Borrow Checker, TS any vs unknown.
- 4 typed challenges: `missing-word` (Loop Keyword, Missing Token),
  `fix-code` (Infinite Loop), `optimal-solution` (Fastest Way to Sum).
- 2 interactive challenges: `write-solution` (Greet by Name) + `run-code`
  (Print the Total).
- 20 hint-less interactive challenges: 10 `write-solution`
  (JS/Python/TS/HTML) + 10 `run-code` (Python/JS/Java/Go/Rust/C), all with
  `allowHints: false` so the Hint button is hidden — figure it out.
- 10 more typed challenges: 4 `optimal-solution` (Set lookup, string join,
  sargable SQL, linear max), 4 `fix-code` (off-by-one, leaky counter,
  append-None, shared default), 2 `missing-word` (const, file mode),
  all hint-less. Catalog now at 69 challenges, 0 duplicate groups.
- `missing-word` challenges now take a typed answer (input + Check button,
  unlimited tries, solution only revealed after solving) instead of options.
- Training list: solved rows get green tint + "Solved" badge and live only in
  a dedicated ✅ Completed section; new "Show completed" checkbox under the
  filters toggles it. Filters consolidated to one row (search + compact
  language dropdown + sort dropdown); difficulty chips removed, sort options
  are now Difficulty / Quiz type / XP high→low / XP low→high / Title A–Z.
- Judge0 execution proxy (`app/api/judge0/[...path]`): browser calls now go
  same-origin and forward server-side to `JUDGE0_UPSTREAM` (defaults to the
  public server); fixes CORS + the dead `/judge0` URL. `NEXT_PUBLIC_JUDGE0_URL`
  corrected to `/api/judge0` (the old `NEXT_JUDGE0_URL` key was never read).
  Verified live: `/api/judge0/languages` returns 200 with the full list.
- Daily quest now marks itself done: today's hero flips to a green
  "✓ Daily Done" state (CTA becomes "Review Daily") once its backing
  challenge has a solve record; solved past dailies show ✅ Done in the
  archive instead of 🔒 Expired.

### Changed
- `run-code` challenges are now AI-graded (chatbot's Gemini model) instead of
  Judge0 stdout compare: bigger 380px themed editor, "Submit for review",
  wrong attempts show AI feedback (why it's wrong) + the canonical solution;
  correct attempts award XP as before. No compiler involved.
- `write-solution` also AI-graded now (exact text compare removed): bigger
  textarea (8 rows, 180px min), same wrong-answer feedback + right-answer
  panel, retry freely until correct.
- Anti-farming for AI-graded challenges: wrong attempts show feedback only —
  the canonical solution stays locked, the grader prompt is instructed never
  to leak it, and after 3 failed attempts a "Reveal solution" button appears
  (revealed solves complete for 0 XP, recorded with `revealed: true`).
  Per-challenge attempt state resets on navigation.
- Challenge detail card enlarged (`p-8`, title `text-2xl`, body `text-base`);
  descriptions now render through the shared Markdown component so fenced
  code blocks show as highlighted snippets. "Fix the Infinite Loop"
  retrofitted with a fenced `js` snippet.
- `TrainingGrounds` renamed to `TrainingPage`
  (`src/platform/pages/Training/TrainingPage.tsx`).
- Sidebar: new `Target` nav item "Training" (en) / "التدريب" (ar) linking
  `/app/training`.
- Arena nav: Training tab removed from `ArenaLayout` (Duels/Rankings stay).
- `ArenaHub` Training CTA points to `/app/training`.
- Dashboard quick-grid Arena card now goes to `/app/arena`; the challenge
  promo row goes to `/app/training`.
- ChallengeView back/CTA links point to `/app/training`.
- Removed `Arena/TrainingGrounds.tsx` (now `Training/TrainingPage.tsx`).
- Challenge detail relocated to `/app/training/[id]`; `/app/arena/training/[id]`
  is a client redirect to the new URL.
- `ArenaHub` CTA / dashboard promo now deep-link to `/app/training` and
  `/app/training/[id]`; `ROUTES.TRAINING`/`TRAINING_DETAIL`/`CHALLENGES`
  updated to `/app/training*`.
- Fixed the second arena nav (`app/app/arena/layout.tsx`) that still listed
  the removed Training tab.
- TrainingPage redesigned as a SQLQuest/LeetCode-style quest list:
  progress header (solved count, XP earned, XP bar), difficulty-group
  sections (🌱 Easy / 🔥 Medium / 💀 Hard / 👑 Expert), per-row solve state
  (✓ vs index), tags, XP chip, Start/Review CTA → `/app/training/[id]`.
  Solve state reads `users/{uid}/completedChallenges`.
- TrainingPage sort-by-type now includes the new types; row/type chips and
  `ChallengeView` header show ✍️/▶ badges.

### Deprecated
- `/app/arena/training` now shows an empty "Training moved" state; use
  `/app/training` instead. The old detail URL redirects automatically.

### Fixed
- Removed 8 duplicate documents from the Firestore `challenges` collection
  (33 → 25), keyed by title+difficulty+language, keeping the earliest copy
  per pair. Firestore rules temporarily opened for the sweep were reverted
  and redeployed.
- Reworked the broken "Variable Scope Mystery" challenge (real snippet now)
  and filled missing hints + normalized XP for Go Goroutines / C++ / Java /
  React / Python / JS-this / SQL-join-types entries.
- Fixed `ReferenceError: setMissingInput before initialization` (missing-word
  hooks moved above the reset effect/early return).

### Notes
- Scope from previous work: Sanity v2 studio schema, course queries rewrite,
  Monaco editor theming, Firestore rules published, PublicProfile auth-ready fix.
