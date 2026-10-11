import {
  TYPES, DIFFICULTIES, STATUSES, LANGUAGES, KEBAB, ISO_DATE, PLACEHOLDER, QUESTION_TYPES, TEST_TYPES,
  RULES, COMMON_FIELDS, REQUIRED_FIELDS, REQUIRED_HEADINGS, STEP_SECTIONS, MODULE_SEQUENCE,
} from './constants.mjs';

const isInt = (v) => Number.isInteger(v);
const isPosInt = (v) => Number.isInteger(v) && v > 0;
const isStr = (v) => typeof v === 'string' && v.trim().length > 0;

/** Validate a test array. `push(level, msg)` collects problems. */
function validateTests(tests, where, push, { expectWeightSum } = {}) {
  if (!Array.isArray(tests) || tests.length === 0) {
    push('error', `${where}: needs at least one test`);
    return;
  }
  let sum = 0;
  let requiredCount = 0;
  tests.forEach((t, i) => {
    const at = `${where} test #${i + 1}`;
    if (!t || typeof t !== 'object') return push('error', `${at}: must be an object`);
    const def = TEST_TYPES[t.type];
    if (!def) return push('error', `${at}: unknown test type "${t.type}" (allowed: ${Object.keys(TEST_TYPES).join(', ')})`);
    if (!isStr(t.message)) push('error', `${at}: "message" is required`);
    for (const f of def.fields) {
      if (f === 'expected') {
        if (!('expected' in t)) push('error', `${at} (${t.type}): missing "expected"`);
      } else if (!isStr(t[f])) {
        push('error', `${at} (${t.type}): "${f}" must be a non-empty string`);
      }
    }
    if (t.type === 'output-matches' && isStr(t.pattern)) {
      try { new RegExp(t.pattern, t.flags || ''); } catch (e) { push('error', `${at}: invalid regex (${e.message})`); }
    }
    if ('weight' in t && !isPosInt(t.weight)) push('error', `${at}: "weight" must be a positive integer`);
    if ('required' in t && typeof t.required !== 'boolean') push('error', `${at}: "required" must be true or false`);
    if (t.type === 'dom-selector' && 'count' in t && !isInt(t.count)) push('error', `${at}: "count" must be an integer`);
    sum += isPosInt(t.weight) ? t.weight : 1;
    if (t.required === true) requiredCount++;
  });
  if (expectWeightSum !== undefined && sum !== expectWeightSum) push('error', `${where}: test weights sum to ${sum}, expected ${expectWeightSum}`);
  return { sum, requiredCount };
}

function validateFrontmatter(doc, push) {
  const d = doc.data;
  if (!doc.type || !TYPES.includes(doc.type)) {
    push('error', `"type" must be one of: ${TYPES.join(', ')} (got ${JSON.stringify(doc.type)})`);
    return false;
  }
  for (const f of [...COMMON_FIELDS, ...(REQUIRED_FIELDS[doc.type] || [])]) {
    if (!(f in d) || d[f] === null || d[f] === '' || (Array.isArray(d[f]) && f !== 'prerequisites' && f !== 'covers' && d[f].length === 0 && f === 'tags')) {
      push('error', `missing required frontmatter field "${f}"`);
    }
  }
  if (doc.id !== undefined) {
    if (!KEBAB.test(String(doc.id))) push('error', `id "${doc.id}" must be kebab-case`);
    if (doc.id !== doc.stem) push('error', `id "${doc.id}" must match the filename "${doc.stem}.md"`);
  }
  if (d.status !== undefined && !STATUSES.includes(d.status)) push('error', `status must be one of ${STATUSES.join(' | ')}`);
  if (d.language !== undefined && !LANGUAGES.includes(d.language)) push('error', `language must be one of ${LANGUAGES.join(' | ')}`);
  if (d.difficulty !== undefined && !DIFFICULTIES.includes(d.difficulty)) push('error', `difficulty must be one of ${DIFFICULTIES.join(' | ')}`);
  if (d.lastUpdated !== undefined && !ISO_DATE.test(String(d.lastUpdated))) push('error', `lastUpdated must be YYYY-MM-DD`);
  if (d.tags !== undefined) {
    if (!Array.isArray(d.tags) || d.tags.some((t) => !isStr(t))) push('error', 'tags must be an array of non-empty strings');
    else if (d.tags.length < RULES.tagsMin || d.tags.length > RULES.tagsMax) push('error', `tags must contain ${RULES.tagsMin}-${RULES.tagsMax} items (has ${d.tags.length})`);
  }
  for (const f of ['order']) if (f in d && !isPosInt(d[f])) push('error', `${f} must be a positive integer`);
  for (const f of ['estimatedMinutes']) if (f in d && !isPosInt(d[f])) push('error', `${f} must be a positive integer`);
  for (const f of ['estimatedHours']) if (f in d && !(typeof d[f] === 'number' && d[f] > 0)) push('error', `${f} must be a positive number`);
  for (const f of ['passingScorePercent', 'passingGradePercent']) {
    if (f in d && !(typeof d[f] === 'number' && d[f] >= 0 && d[f] <= 100)) push('error', `${f} must be a number from 0 to 100`);
  }
  if ('revealSolutionAfterAttempts' in d && !(isInt(d.revealSolutionAfterAttempts) && d.revealSolutionAfterAttempts >= 0)) push('error', 'revealSolutionAfterAttempts must be an integer >= 0');
  for (const f of ['shuffleQuestions', 'shuffleOptions']) if (f in d && typeof d[f] !== 'boolean') push('error', `${f} must be true or false`);
  for (const f of ['prerequisites', 'covers']) {
    if (f in d && (!Array.isArray(d[f]) || d[f].some((x) => !isStr(x)))) push('error', `${f} must be an array of ids`);
  }
  if (doc.type === 'course') {
    if (d.slug !== undefined && !KEBAB.test(String(d.slug))) push('error', 'slug must be kebab-case');
    if (d.version !== undefined && !/^\d+\.\d+\.\d+$/.test(String(d.version))) push('error', 'version must look like 1.0.0');
  }
  if (doc.type === 'certification-project' && d.scope !== undefined && !['course', 'module'].includes(d.scope)) push('error', 'scope must be "course" or "module"');
  return true;
}

function validateLeftovers(doc, push) {
  const raw = doc.raw;
  if (/Instruction for AI\/Author/.test(raw)) push('error', 'leftover "Instruction for AI/Author" comment (remove all author comments)');
  if (/#\s*\[(REQUIRED|OPTIONAL)\]/.test(raw)) push('error', 'leftover "# [REQUIRED]" / "# [OPTIONAL]" template comment in frontmatter');
  const hits = new Set();
  for (const m of (doc.cleaned + '\n' + JSON.stringify(doc.data)).matchAll(PLACEHOLDER)) hits.add(m[0]);
  if (hits.size) push('error', `unfilled placeholders: ${[...hits].slice(0, 6).join(', ')}${hits.size > 6 ? ` (+${hits.size - 6} more)` : ''}`);
}

function validateHeadings(doc, push) {
  const titles = new Set(doc.headingList.map((h) => h.title));
  for (const h of REQUIRED_HEADINGS[doc.type] || []) if (!titles.has(h)) push('error', `missing required heading "${h}"`);
}

function validateBody(doc, push) {
  const P = doc.parsed;
  switch (doc.type) {
    case 'theory':
      if (P.body.length < 400) push('warn', `lesson body is very short (${P.body.length} characters)`);
      break;
    case 'course':
      if (P.learningObjectives.length < 3 || P.learningObjectives.length > 6) push('error', `needs 3-6 learning objectives (has ${P.learningObjectives.length})`);
      break;
    case 'module':
      if (P.outcomes.length < 2) push('error', 'needs at least 2 items under "What You Will Be Able To Do"');
      break;
    case 'review':
      if (!P.matrix || P.matrix.rows.length < 1) push('error', 'Core Terminology / Formula Matrix needs a Markdown table with at least one row');
      else if (P.matrix.header.length !== 3) push('warn', 'matrix table should have 3 columns (Term, Definition, Usage)');
      break;
    case 'workshop': {
      if (P.steps.length < RULES.workshopStepsMin || P.steps.length > RULES.workshopStepsMax) {
        push('error', `workshop needs ${RULES.workshopStepsMin}-${RULES.workshopStepsMax} steps (has ${P.steps.length}). Steps must be headed "## Step N: Title"`);
      }
      P.steps.forEach((s, i) => {
        const at = `Step ${s.number}`;
        if (s.number !== i + 1) push('error', `${at}: steps must be numbered consecutively from 1 (expected ${i + 1})`);
        if (!s.title) push('error', `${at}: needs a title ("## Step ${s.number}: Title")`);
        for (const n of STEP_SECTIONS) if (!s.present.includes(n)) push('error', `${at}: missing "### ${n}"`);
        if (!s.instructions) push('error', `${at}: empty Instructions`);
        if (s.hints.length < 1) push('error', `${at}: needs at least one hint (numbered list under "### Hints")`);
        if (!s.starter) push('error', `${at}: missing code block in "Starter State / Code"`);
        if (!s.solution || !s.solution.code.trim()) push('error', `${at}: missing code block in "Solution State / Code"`);
        if (s.starter && s.solution && s.starter.code.trim() === s.solution.code.trim()) push('warn', `${at}: starter and solution are identical`);
        if (s.tests) validateTests(s.tests, `${at} Evaluation Tests`, push);
      });
      break;
    }
    case 'lab': {
      if (!P.objective) push('error', 'empty Objective');
      if (P.requirements.length < 2) push('error', `needs at least 2 requirements (has ${P.requirements.length})`);
      if (!P.starter) push('error', 'missing code block in "Starter State / Workspace"');
      if (!P.referenceSolution || !P.referenceSolution.code.trim()) push('error', 'missing code block in "Reference Solution"');
      if (P.hints.length < 1) push('error', 'needs at least one hint (format: "> **Hint 1:** text")');
      if (P.tests) validateTests(P.tests, 'Evaluation Tests', push);
      break;
    }
    case 'quiz': {
      if (P.questions.length !== RULES.quizQuestions) push('error', `quiz needs exactly ${RULES.quizQuestions} questions (has ${P.questions.length})`);
      const kinds = new Set();
      P.questions.forEach((q, i) => {
        const at = `Question ${q.number}`;
        if (q.number !== i + 1) push('error', `${at}: questions must be numbered consecutively (expected ${i + 1})`);
        if (!q.hasMeta) return push('error', `${at}: missing <!-- meta: {"type": "...", "points": 1} --> comment`);
        if (q.metaError) return push('error', `${at}: meta comment is not valid JSON (${q.metaError})`);
        const t = q.meta.type;
        if (!QUESTION_TYPES.includes(t)) return push('error', `${at}: meta.type must be one of ${QUESTION_TYPES.join(' | ')}`);
        kinds.add(t);
        if ('points' in q.meta && !isPosInt(q.meta.points)) push('error', `${at}: meta.points must be a positive integer`);
        if (!q.prompt) push('error', `${at}: empty question text`);
        if (!q.explanation) push('error', `${at}: missing "*Explanation*:" text`);
        const correct = q.options.filter((o) => o.correct).length;
        const texts = q.options.map((o) => o.text.trim().toLowerCase());
        if (new Set(texts).size !== texts.length) push('error', `${at}: duplicate option text`);
        if (t === 'true-false') {
          if (q.options.length !== 2 || !(texts.includes('true') && texts.includes('false'))) push('error', `${at}: true-false needs exactly the options True and False`);
          if (correct !== 1) push('error', `${at}: true-false needs exactly one correct option (has ${correct})`);
        } else {
          if (q.options.length < 3 || q.options.length > 6) push('error', `${at}: needs 3-6 options (has ${q.options.length})`);
          if (t === 'multiple') {
            if (correct < 1) push('error', `${at}: needs at least one correct option`);
            else if (correct === 1) push('warn', `${at}: type "multiple" has only one correct option; use "single"`);
            if (correct === q.options.length) push('error', `${at}: every option is marked correct`);
          } else if (correct !== 1) {
            push('error', `${at}: type "${t}" needs exactly one correct option (has ${correct})`);
          }
        }
        if (t === 'code-output' && !/```|~~~/.test(q.prompt)) push('error', `${at}: code-output question needs a fenced code block in the question text`);
        if (q.options.some((o) => /all of the above|none of the above/i.test(o.text))) push('warn', `${at}: avoid "all/none of the above" options`);
      });
      if (P.questions.length >= 4 && kinds.size < 3) push('warn', `quiz uses only ${kinds.size} question type(s); the roadmap asks for a mix`);
      break;
    }
    case 'certification-project': {
      if (!P.objective) push('error', 'empty Capstone Objective');
      if (P.deliverables.length < 1) push('error', 'needs at least one deliverable (numbered list)');
      if (!P.starter) push('error', 'missing code block in "Starter Workspace"');
      if (!P.rubric || P.rubric.length < 3) {
        push('error', 'rubric table needs at least 3 rows: | # | Requirement | Weight | Required |');
      } else {
        P.rubric.forEach((r, i) => {
          if (!isPosInt(r.weight) || !isStr(r.requirement)) push('error', `rubric row ${i + 1}: needs a requirement and an integer weight`);
        });
        const sum = P.rubric.reduce((a, r) => a + (Number.isFinite(r.weight) ? r.weight : 0), 0);
        if (sum !== 100) push('error', `rubric weights sum to ${sum}, expected 100`);
        if (P.rubric.filter((r) => r.required).length < 2) push('error', 'at least 2 rubric rows must be Required = Yes');
      }
      if (P.tests) {
        const res = validateTests(P.tests, 'Automated Validation Criteria', push, { expectWeightSum: 100 });
        if (res && res.requiredCount < 2) push('error', 'Automated Validation Criteria: at least 2 tests must have "required": true');
      }
      break;
    }
    default:
      break;
  }
}

/** Run all validation. Returns { problems: [{level, file, msg}] }. */
export function validateAll(parsed, parseProblemsByFile = new Map()) {
  const problems = [];
  const docs = parsed.filter(Boolean);
  const byId = new Map();

  for (const doc of docs) {
    const push = (level, msg) => problems.push({ level, file: doc.file, msg });
    for (const m of parseProblemsByFile.get(doc.file) || []) push('error', m);
    const ok = validateFrontmatter(doc, push);
    validateLeftovers(doc, push);
    if (ok) {
      validateHeadings(doc, push);
      validateBody(doc, push);
    }
    if (doc.id) {
      if (byId.has(doc.id)) push('error', `duplicate id "${doc.id}" (also in ${byId.get(doc.id).file})`);
      else byId.set(doc.id, doc);
    }
  }

  const courses = docs.filter((d) => d.type === 'course');
  const modules = docs.filter((d) => d.type === 'module');
  const items = docs.filter((d) => ['theory', 'workshop', 'lab', 'review', 'quiz'].includes(d.type));
  const caps = docs.filter((d) => d.type === 'certification-project');
  const pushFor = (doc) => (level, msg) => problems.push({ level, file: doc.file, msg });

  // course/module relations
  for (const m of modules) {
    const push = pushFor(m);
    const c = byId.get(m.data.courseId);
    if (!c || c.type !== 'course') push('error', `courseId "${m.data.courseId}" does not match any course file`);
    for (const p of m.data.prerequisites || []) {
      const t = byId.get(p);
      if (!t || t.type !== 'module') push('error', `prerequisite "${p}" is not a module in this content set`);
      else if (t.data.courseId !== m.data.courseId) push('warn', `prerequisite "${p}" belongs to a different course`);
    }
  }
  for (const c of courses) {
    for (const p of c.data.prerequisites || []) {
      if (!byId.has(p)) pushFor(c)('warn', `course prerequisite "${p}" is not in this content set (fine if it is imported separately)`);
    }
  }

  // order checks: modules per course
  const contiguous = (list, label, owner) => {
    const orders = list.map((x) => x.data.order).filter(isPosInt).sort((a, b) => a - b);
    const seen = new Set();
    for (const o of orders) {
      if (seen.has(o)) pushFor(owner)('error', `${label}: duplicate order ${o}`);
      seen.add(o);
    }
    for (let i = 0; i < orders.length; i++) {
      if (orders[i] !== i + 1 && !seen.has(i + 1)) {
        pushFor(owner)('error', `${label}: order values must run 1..${orders.length} without gaps (found ${orders.join(', ')})`);
        break;
      }
    }
  };
  for (const c of courses) {
    const mods = modules.filter((m) => m.data.courseId === c.id).sort((a, b) => a.data.order - b.data.order);
    contiguous(mods, `modules of ${c.id}`, c);
    mods.forEach((m, i) => {
      const expected = i === 0 ? [] : [mods[i - 1].id];
      const got = m.data.prerequisites || [];
      if (JSON.stringify(got) !== JSON.stringify(expected)) pushFor(m)('warn', `prerequisites are ${JSON.stringify(got)}; roadmap convention is ${JSON.stringify(expected)}`);
    });
    if (mods.length === 0) pushFor(c)('warn', 'course has no modules');
  }

  // module contents
  for (const m of modules) {
    const kids = items.filter((i) => i.data.moduleId === m.id);
    contiguous(kids, `content of ${m.id}`, m);
    const sorted = [...kids].sort((a, b) => a.data.order - b.data.order);
    let last = -1;
    for (const k of sorted) {
      const idx = MODULE_SEQUENCE.indexOf(k.type);
      if (idx < last) pushFor(k)('error', `out of sequence in ${m.id}: expected theory -> workshop -> lab -> review -> quiz (by order)`);
      last = Math.max(last, idx);
    }
    const count = (t) => kids.filter((k) => k.type === t).length;
    const th = count('theory');
    if (th < RULES.theoryMin || th > RULES.theoryMax) pushFor(m)('error', `module needs ${RULES.theoryMin}-${RULES.theoryMax} theory lessons (has ${th})`);
    for (const t of ['workshop', 'lab', 'review', 'quiz']) if (count(t) !== 1) pushFor(m)('error', `module needs exactly 1 ${t} (has ${count(t)})`);
    const rev = kids.find((k) => k.type === 'review');
    if (rev) {
      const covers = rev.data.covers || [];
      const need = kids.filter((k) => ['theory', 'workshop', 'lab'].includes(k.type)).map((k) => k.id);
      for (const id of covers) {
        const t = byId.get(id);
        if (!t) pushFor(rev)('error', `covers: "${id}" does not exist`);
        else if (t.data.moduleId !== m.id) pushFor(rev)('error', `covers: "${id}" belongs to a different module`);
      }
      for (const id of need) if (!covers.includes(id)) pushFor(rev)('error', `covers is missing "${id}" (review must cover every lesson, workshop and lab of the module)`);
    }
  }

  // items whose parent is missing
  for (const k of items) {
    const p = byId.get(k.data.moduleId);
    if (!p || p.type !== 'module') pushFor(k)('error', `moduleId "${k.data.moduleId}" does not match any module file`);
  }

  // capstones
  for (const c of caps) {
    const t = byId.get(c.data.targetId);
    if (!t) pushFor(c)('error', `targetId "${c.data.targetId}" does not exist`);
    else if (t.type !== c.data.scope) pushFor(c)('error', `scope is "${c.data.scope}" but targetId "${c.data.targetId}" is a ${t.type}`);
  }
  if (courses.length && caps.length === 0) problems.push({ level: 'warn', file: courses[0].file, msg: 'no certification-project found in this content set' });

  return { problems, byId };
}
