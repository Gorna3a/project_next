// ─── Sanity CMS Client & Queries (v2 content model) ────────────────────────────
// Content model: course → module → lesson (kind: theory | workshop | lab |
// review | quiz | certification-project). Prose fields are Markdown strings —
// render them with the Markdown component, not PortableText.
// Firestore only stores user progress — never content.
//
// Setup: create a free project at sanity.io, then fill .env with your project ID.

import { createClient } from "@sanity/client";
import {
  getStarterCourse,
  getStarterCourses,
  getStarterLesson,
  getStarterLessonsForCourse,
  getStarterCourseById,
  type LegacySanityCourse,
  type LegacySanityLesson,
} from "./starterCourses";

// ─── Client ───────────────────────────────────────────────────────────────────

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "placeholder",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01",
  useCdn: true, // cached reads — fast for production
});

// ─── TypeScript interfaces matching the v2 Sanity schema ─────────────────────

export type LessonKind =
  | "theory"
  | "workshop"
  | "lab"
  | "review"
  | "quiz"
  | "certification-project";

export type Difficulty = "beginner" | "intermediate" | "advanced";
export type ContentStatus = "draft" | "review" | "published" | "archived";
export type ContentLocale = "en" | "fr" | "ar";

export interface CodeBlockObj {
  language?: string;
  code?: string;
}

export interface TestCaseObj {
  _key: string;
  type:
    | "output-equals"
    | "output-contains"
    | "output-matches"
    | "function-returns"
    | "function-throws"
    | "code-contains"
    | "code-not-contains"
    | "file-exists"
    | "file-contains"
    | "dom-selector";
  message: string;
  weight?: number;
  required?: boolean;
  value?: string;
  pattern?: string;
  flags?: string;
  input?: string;
  call?: string;
  /** JSON-encoded expected value — JSON.parse it in the runner */
  expected?: string;
  errorType?: string;
  path?: string;
  selector?: string;
  count?: number;
  text?: string;
}

export interface WorkshopStep {
  _key: string;
  number?: number;
  title?: string;
  instructions?: string;
  hints?: string[];
  starter?: CodeBlockObj;
  solution?: CodeBlockObj;
  tests?: TestCaseObj[];
}

export interface QuizOption {
  _key: string;
  text?: string;
  correct?: boolean;
}

export type QuizQuestionType = "single" | "multiple" | "true-false" | "code-output";

export interface QuizQuestion {
  _key: string;
  questionType?: QuizQuestionType;
  points?: number;
  prompt?: string;
  options?: QuizOption[];
  hint?: string;
  explanation?: string;
}

export interface RubricItem {
  _key: string;
  number?: number;
  requirement?: string;
  weight?: number;
  required?: boolean;
}

export interface SanityCourse {
  _id: string;
  contentId?: string;
  title: string;
  slug: string;
  domain?: string;
  /** Code language taught (python, javascript, …). `language` is the UI locale. */
  programmingLanguage?: string;
  difficulty?: Difficulty;
  status?: ContentStatus;
  /** UI locale: en | fr | ar */
  language?: string;
  estimatedHours?: number;
  version?: string;
  lastUpdated?: string;
  tags: string[];
  description?: string;
  prerequisites: { _id: string; title: string; slug: string }[];
  learningObjectives: string[];
  /** Markdown */
  body?: string;
  moduleCount: number;
  lessonCount: number;
}

export interface SanityLessonLite {
  _id: string;
  contentId?: string;
  kind?: LessonKind;
  title: string;
  order?: number;
  estimatedMinutes?: number;
  difficulty?: Difficulty;
}

export interface SanityModule {
  _id: string;
  contentId?: string;
  title: string;
  order?: number;
  programmingLanguage?: string;
  difficulty?: Difficulty;
  status?: ContentStatus;
  language?: string;
  lastUpdated?: string;
  tags: string[];
  description?: string;
  outcomes: string[];
  /** Markdown */
  body?: string;
  course: { _id: string; contentId?: string; title: string; slug: string };
  lessonCount: number;
  items: SanityLessonLite[];
}

export interface SanityLesson extends SanityLessonLite {
  status?: ContentStatus;
  language?: string;
  lastUpdated?: string;
  tags: string[];
  /** Markdown */
  body?: string;
  estimatedHours?: number;
  passingScorePercent?: number;
  passingGradePercent?: number;
  shuffleQuestions?: boolean;
  shuffleOptions?: boolean;
  covers: { _id: string; contentId?: string; kind?: LessonKind; title: string; order?: number }[];
  steps: WorkshopStep[];
  starter?: CodeBlockObj;
  tests: TestCaseObj[];
  hints: string[];
  referenceSolution?: CodeBlockObj;
  revealSolutionAfterAttempts?: number;
  questions: QuizQuestion[];
  scope?: "course" | "module";
  target?: { _id: string; contentId?: string; title: string } | null;
  rubric: RubricItem[];
  module: {
    _id: string;
    contentId?: string;
    title: string;
    order?: number;
    lessonCount: number;
    course: { _id: string; contentId?: string; title: string; slug: string };
  };
}

// ─── Legacy (starter) → v2 adapters ──────────────────────────────────────────
// Hardcoded starter courses use the old schema. They are only a fallback for
// when Sanity is unreachable — adapt them to the v2 shape at the boundary.

const blocksToMarkdown = (
  blocks: { _type: string; style?: string; children?: { text?: string }[]; code?: string; language?: string; text?: string }[],
): string =>
  (blocks ?? [])
    .map((b) => {
      if (b._type === "code") return `\`\`\`${b.language ?? ""}\n${(b.code ?? "").trim()}\n\`\`\``;
      if (b._type === "callout") return `> ${(b.text ?? "").trim()}`;
      if (b._type !== "block") return "";
      const text = (b.children ?? []).map((c) => c.text ?? "").join("");
      switch (b.style) {
        case "h1": return `# ${text}`;
        case "h2": return `## ${text}`;
        case "h3": return `### ${text}`;
        case "blockquote": return `> ${text}`;
        default: return text;
      }
    })
    .filter((s) => s.trim().length > 0)
    .join("\n\n");

const toV2Course = (c: LegacySanityCourse): SanityCourse => ({
  _id: c._id,
  contentId: c.slug,
  title: c.title,
  slug: c.slug,
  domain: undefined,
  programmingLanguage: c.language,
  difficulty: c.level,
  status: c.status === "draft" || c.status === "published" || c.status === "archived" ? c.status : "draft",
  language: "en",
  estimatedHours: c.estimatedHours,
  version: c.courseVersion,
  lastUpdated: c.publishedAt,
  tags: c.tags ?? [],
  description: c.description ?? c.shortDescription,
  prerequisites: [],
  learningObjectives: c.learningObjectives ?? [],
  body: c.description ?? "",
  moduleCount: 1,
  lessonCount: c.totalLessons ?? 0,
});

const toV2Lesson = (l: LegacySanityLesson): SanityLesson => {
  const moduleId = `module-${l.course._id}`;
  const difficultyMap = { easy: "beginner", medium: "intermediate", hard: "advanced" } as const;
  return {
    _id: l._id,
    contentId: l.slug,
    kind: l.lessonType === "lab" ? "lab" : "theory",
    title: l.title,
    order: l.order,
    estimatedMinutes: l.estimatedMinutes,
    difficulty: l.difficulty ? difficultyMap[l.difficulty] : undefined,
    status: "published",
    language: "en",
    tags: [],
    body: blocksToMarkdown(l.body as never[]),
    covers: [],
    steps: [],
    tests: [],
    hints: [],
    questions: (l.quizzes ?? []).map((q) => ({
      _key: q._key,
      questionType: "single" as const,
      points: q.xp ?? 1,
      prompt: q.question,
      options: (q.options ?? []).map((text, i) => ({
        _key: `${q._key}o${i + 1}`,
        text,
        correct: i === q.correctIndex,
      })),
      hint: undefined,
      explanation: q.explanation,
    })),
    rubric: [],
    module: {
      _id: moduleId,
      contentId: moduleId,
      title: l.course.title,
      order: 1,
      lessonCount: l.course.totalLessons ?? 0,
      course: {
        _id: l.course._id,
        contentId: l.course._id,
        title: l.course.title,
        slug: l.course.slug,
      },
    },
  };
};

const toV2Module = (courseId: string): SanityModule[] => {
  const legacyCourse = getStarterCourseById(courseId);
  if (!legacyCourse) return [];
  const lessons = getStarterLessonsForCourse(courseId);
  const v2 = toV2Course(legacyCourse);
  return [
    {
      _id: `module-${legacyCourse._id}`,
      contentId: `module-${legacyCourse.slug}`,
      title: legacyCourse.title,
      order: 1,
      programmingLanguage: legacyCourse.language,
      difficulty: legacyCourse.level,
      status: "published",
      language: "en",
      tags: legacyCourse.tags ?? [],
      description: legacyCourse.description,
      outcomes: legacyCourse.learningObjectives ?? [],
      body: "",
      course: { _id: v2._id, contentId: v2.contentId, title: v2.title, slug: v2.slug },
      lessonCount: lessons.length,
      items: lessons.map((l) => {
        const full = toV2Lesson(l);
        return {
          _id: full._id,
          contentId: full.contentId,
          kind: full.kind,
          title: full.title,
          order: full.order,
          estimatedMinutes: full.estimatedMinutes,
          difficulty: full.difficulty,
        };
      }),
    },
  ];
};

// ─── GROQ Queries (v2) ───────────────────────────────────────────────────────

const COURSE_PROJECTION = `
  _id,
  contentId,
  title,
  "slug": slug.current,
  domain,
  programmingLanguage,
  difficulty,
  status,
  language,
  estimatedHours,
  version,
  lastUpdated,
  tags,
  description,
  "prerequisites": prerequisites[]-> { _id, contentId, title, "slug": slug.current },
  learningObjectives,
  body,
  "moduleCount": count(*[_type == "module" && course._ref == ^._id]),
  "lessonCount": count(*[_type == "lesson" && module->course._ref == ^._id])
`;

/** All courses, ordered by title */
export const getAllCourses = async (): Promise<SanityCourse[]> => {
  const query = `*[_type == "course"] | order(title asc) { ${COURSE_PROJECTION} }`;
  try {
    const courses = await sanityClient.fetch<SanityCourse[]>(query);
    return courses.length > 0 ? courses : getStarterCourses().map(toV2Course);
  } catch (error) {
    console.warn("Using starter courses because Sanity courses could not be loaded.", error);
    return getStarterCourses().map(toV2Course);
  }
};

/** Single course by slug */
export const getCourse = async (slug: string): Promise<SanityCourse | null> => {
  const query = `*[_type == "course" && slug.current == $slug][0] { ${COURSE_PROJECTION} }`;
  try {
    const course = await sanityClient.fetch<SanityCourse | null>(query, { slug });
    return course ?? (getStarterCourse(slug) ? toV2Course(getStarterCourse(slug)!) : null);
  } catch (error) {
    console.warn("Using starter course because Sanity course could not be loaded.", error);
    const fallback = getStarterCourse(slug);
    return fallback ? toV2Course(fallback) : null;
  }
};

/** All modules of a course, each with its ordered lesson items */
export const getModulesForCourse = async (courseId: string): Promise<SanityModule[]> => {
  const query = `
    *[_type == "module" && course._ref == $courseId] | order(order asc) {
      _id,
      contentId,
      title,
      order,
      programmingLanguage,
      difficulty,
      status,
      language,
      lastUpdated,
      tags,
      description,
      outcomes,
      body,
      "course": course-> { _id, contentId, title, "slug": slug.current },
      "lessonCount": count(*[_type == "lesson" && module._ref == ^._id]),
      "items": *[_type == "lesson" && module._ref == ^._id] | order(order asc) {
        _id, contentId, kind, title, order, estimatedMinutes, difficulty
      }
    }
  `;
  try {
    const modules = await sanityClient.fetch<SanityModule[]>(query, { courseId });
    return modules.length > 0 ? modules : toV2Module(courseId);
  } catch (error) {
    console.warn("Using starter modules because Sanity modules could not be loaded.", error);
    return toV2Module(courseId);
  }
};

const TEST_PROJECTION = `
  _key, type, message, weight, required, value, pattern, flags, input, call,
  expected, errorType, path, selector, count, text
`;

/** Single lesson by contentId (or _id) with full kind-specific content */
export const getLesson = async (id: string): Promise<SanityLesson | null> => {
  const query = `
    *[_type == "lesson" && (contentId == $id || _id == $id)][0] {
      _id, contentId, kind, title, order, status, language, lastUpdated, tags,
      difficulty, estimatedMinutes, estimatedHours, body,
      passingScorePercent, passingGradePercent, shuffleQuestions, shuffleOptions,
      "covers": covers[]-> { _id, contentId, kind, title, order },
      steps[] {
        _key, number, title, instructions, hints, starter, solution,
        tests[] { ${TEST_PROJECTION} }
      },
      starter,
      tests[] { ${TEST_PROJECTION} },
      hints,
      referenceSolution,
      revealSolutionAfterAttempts,
      questions[] {
        _key, questionType, points, prompt,
        options[] { _key, text, correct },
        hint, explanation
      },
      scope,
      "target": target-> { _id, contentId, title },
      rubric[] { _key, number, requirement, weight, required },
      "module": module-> {
        _id, contentId, title, order,
        "lessonCount": count(*[_type == "lesson" && module._ref == ^._id]),
        "course": course-> { _id, contentId, title, "slug": slug.current }
      }
    }
  `;
  try {
    const lesson = await sanityClient.fetch<SanityLesson | null>(query, { id });
    return lesson ?? (getStarterLesson(id) ? toV2Lesson(getStarterLesson(id)!) : null);
  } catch (error) {
    console.warn("Using starter lesson because Sanity lesson could not be loaded.", error);
    const fallback = getStarterLesson(id);
    return fallback ? toV2Lesson(fallback) : null;
  }
};
