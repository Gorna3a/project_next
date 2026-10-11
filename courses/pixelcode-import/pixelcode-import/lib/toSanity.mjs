// Convert validated, parsed docs into Sanity documents (as drafts).
//
// Design choices (see README):
// - One Sanity document per Markdown file, _id = "drafts.<file id>".
// - Prose stays Markdown in a `body` text field. Structured data (steps, tests, questions, rubric)
//   becomes real fields so the platform can query and grade it.
// - References are weak (_weak + _strengthenOnPublish) so documents can be imported in any order
//   while their targets are still drafts.

const draftId = (id) => `drafts.${id}`;

const ref = (id, type) => ({
  _type: 'reference',
  _ref: id,
  _weak: true,
  _strengthenOnPublish: { type },
});

const code = (fence) => (fence ? { _type: 'codeBlock', language: fence.language || 'text', code: fence.code } : undefined);

const compact = (obj) => Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined));

function convertTests(tests, prefix) {
  return (tests || []).map((t, i) =>
    compact({
      _key: `${prefix}t${i + 1}`,
      _type: 'testCase',
      type: t.type,
      message: t.message,
      weight: t.weight ?? 1,
      required: t.required === true,
      value: t.value !== undefined ? String(t.value) : undefined,
      pattern: t.pattern,
      flags: t.flags,
      input: t.input !== undefined ? String(t.input) : undefined,
      call: t.call,
      // `expected` can be any JSON value, so it is stored as a JSON string.
      expected: 'expected' in t ? JSON.stringify(t.expected) : undefined,
      errorType: t.errorType,
      path: t.path,
      selector: t.selector,
      count: t.count,
      text: t.text,
    })
  );
}

const shared = (doc) => ({
  _id: draftId(doc.id),
  contentId: doc.id,
  title: doc.data.title,
  status: doc.data.status,
  language: doc.data.language,
  lastUpdated: doc.data.lastUpdated,
  tags: doc.data.tags,
});

export function toSanityDoc(doc, byId) {
  const d = doc.data;
  const P = doc.parsed;
  switch (doc.type) {
    case 'course':
      return compact({
        ...shared(doc),
        _type: 'course',
        slug: { _type: 'slug', current: d.slug },
        domain: d.domain,
        difficulty: d.difficulty,
        estimatedHours: d.estimatedHours,
        version: String(d.version),
        description: d.description,
        prerequisites: (d.prerequisites || []).map((p, i) => ({ _key: `p${i + 1}`, ...ref(p, 'course') })),
        learningObjectives: P.learningObjectives,
        body: P.body,
      });
    case 'module':
      return compact({
        ...shared(doc),
        _type: 'module',
        course: ref(d.courseId, 'course'),
        order: d.order,
        difficulty: d.difficulty,
        description: d.description,
        prerequisites: (d.prerequisites || []).map((p, i) => ({ _key: `p${i + 1}`, ...ref(p, 'module') })),
        outcomes: P.outcomes,
        body: P.body,
      });
    case 'theory':
      return compact({
        ...shared(doc),
        _type: 'lesson',
        kind: 'theory',
        module: ref(d.moduleId, 'module'),
        order: d.order,
        estimatedMinutes: d.estimatedMinutes,
        body: P.body,
      });
    case 'review':
      return compact({
        ...shared(doc),
        _type: 'lesson',
        kind: 'review',
        module: ref(d.moduleId, 'module'),
        order: d.order,
        covers: d.covers.map((c, i) => ({ _key: `c${i + 1}`, ...ref(c, 'lesson') })),
        body: P.body,
      });
    case 'workshop':
      return compact({
        ...shared(doc),
        _type: 'lesson',
        kind: 'workshop',
        module: ref(d.moduleId, 'module'),
        order: d.order,
        estimatedMinutes: d.estimatedMinutes,
        body: P.body,
        steps: P.steps.map((s) => ({
          _key: `s${s.number}`,
          _type: 'workshopStep',
          number: s.number,
          title: s.title,
          instructions: s.instructions,
          hints: s.hints,
          starter: code(s.starter),
          solution: code(s.solution),
          tests: convertTests(s.tests, `s${s.number}`),
        })),
      });
    case 'lab':
      return compact({
        ...shared(doc),
        _type: 'lesson',
        kind: 'lab',
        module: ref(d.moduleId, 'module'),
        order: d.order,
        difficulty: d.difficulty,
        estimatedMinutes: d.estimatedMinutes,
        passingScorePercent: d.passingScorePercent,
        revealSolutionAfterAttempts: d.revealSolutionAfterAttempts,
        body: P.body,
        starter: code(P.starter),
        tests: convertTests(P.tests, 'l'),
        hints: P.hints,
        referenceSolution: code(P.referenceSolution),
      });
    case 'quiz':
      return compact({
        ...shared(doc),
        _type: 'lesson',
        kind: 'quiz',
        module: ref(d.moduleId, 'module'),
        order: d.order,
        passingScorePercent: d.passingScorePercent,
        shuffleQuestions: d.shuffleQuestions,
        shuffleOptions: d.shuffleOptions,
        questions: P.questions.map((q) => ({
          _key: `q${q.number}`,
          _type: 'quizQuestion',
          questionType: q.meta.type,
          points: q.meta.points ?? 1,
          prompt: q.prompt,
          options: q.options.map((o, i) => ({ _key: `q${q.number}o${i + 1}`, _type: 'quizOption', text: o.text, correct: o.correct })),
          hint: q.hint,
          explanation: q.explanation,
        })),
      });
    case 'certification-project': {
      const target = byId.get(d.targetId);
      return compact({
        ...shared(doc),
        _type: 'lesson',
        kind: 'certification-project',
        scope: d.scope,
        target: ref(d.targetId, target ? target.type : d.scope),
        difficulty: d.difficulty,
        estimatedHours: d.estimatedHours,
        passingGradePercent: d.passingGradePercent,
        body: P.body,
        starter: code(P.starter),
        rubric: P.rubric.map((r, i) => ({ _key: `r${i + 1}`, _type: 'rubricItem', number: r.number, requirement: r.requirement, weight: r.weight, required: r.required })),
        tests: convertTests(P.tests, 'c'),
      });
    }
    default:
      throw new Error(`Unsupported type ${doc.type}`);
  }
}

export function toSanityDocs(docs) {
  const byId = new Map(docs.map((d) => [d.id, d]));
  return docs.map((d) => toSanityDoc(d, byId));
}
