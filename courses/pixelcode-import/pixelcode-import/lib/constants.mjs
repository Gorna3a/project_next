// Single source of truth. Keep in sync with _spec.md.

export const TYPES = ['course', 'module', 'theory', 'workshop', 'lab', 'quiz', 'review', 'certification-project'];
export const DIFFICULTIES = ['beginner', 'intermediate', 'advanced'];
export const STATUSES = ['draft', 'review', 'published', 'archived'];
export const LANGUAGES = ['en', 'fr', 'ar'];

export const KEBAB = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

// A leftover template placeholder such as [MODULE_ID] or [HINT_1_CONCEPTUAL].
// The lookbehind avoids false positives on array indexing in code, e.g. items[MAX_SIZE].
export const PLACEHOLDER = /(?<![\w\])])\[[A-Z][A-Z0-9]*(?:_[A-Z0-9]+)+\]/g;

export const QUESTION_TYPES = ['single', 'multiple', 'true-false', 'code-output'];

// Test DSL (see _spec.md). `fields` are required besides type + message.
export const TEST_TYPES = {
  'output-equals': { fields: ['value'] },
  'output-contains': { fields: ['value'] },
  'output-matches': { fields: ['pattern'] },
  'function-returns': { fields: ['call', 'expected'] },
  'function-throws': { fields: ['call'] },
  'code-contains': { fields: ['value'] },
  'code-not-contains': { fields: ['value'] },
  'file-exists': { fields: ['path'] },
  'file-contains': { fields: ['path', 'value'] },
  'dom-selector': { fields: ['selector'] },
};

// Content rules from roadmapJS.md (Global Rule 13). Change here if you change the roadmap.
export const RULES = {
  quizQuestions: 8,
  theoryMin: 3,
  theoryMax: 6,
  workshopStepsMin: 3,
  workshopStepsMax: 5,
  tagsMin: 3,
  tagsMax: 5,
};

// Fields every file must have, by type.
export const COMMON_FIELDS = ['id', 'type', 'title', 'status', 'language', 'lastUpdated', 'tags'];

export const REQUIRED_FIELDS = {
  course: ['slug', 'domain', 'difficulty', 'estimatedHours', 'version', 'description', 'prerequisites'],
  module: ['courseId', 'order', 'difficulty', 'description', 'prerequisites'],
  theory: ['moduleId', 'order', 'estimatedMinutes'],
  workshop: ['moduleId', 'order', 'estimatedMinutes'],
  lab: ['moduleId', 'order', 'difficulty', 'estimatedMinutes', 'passingScorePercent', 'revealSolutionAfterAttempts'],
  quiz: ['moduleId', 'order', 'passingScorePercent', 'shuffleQuestions', 'shuffleOptions'],
  review: ['moduleId', 'order', 'covers'],
  'certification-project': ['scope', 'targetId', 'difficulty', 'estimatedHours', 'passingGradePercent'],
};

// Required headings (level shown in the file) per type.
export const REQUIRED_HEADINGS = {
  course: ['Course Overview', 'Learning Objectives', 'Prerequisite Knowledge'],
  module: ['Module Overview', 'What You Will Be Able To Do'],
  theory: ['Concept Overview', 'Key Principles & Frameworks', 'Common Pitfalls & Anti-Patterns', 'Quick Summary'],
  workshop: ['Workshop Overview'],
  lab: ['Objective', 'Requirements', 'Starter State / Workspace', 'Evaluation Tests', 'Hints', 'Reference Solution'],
  quiz: ['Questions'],
  review: ['Quick Reference Summary', 'Core Terminology / Formula Matrix', 'Key Concepts Comparison', 'Critical Syntax / Templates'],
  'certification-project': ['Capstone Objective', 'Functional Deliverables', 'Requirements & Rubric', 'Starter Workspace', 'Automated Validation Criteria'],
};

export const STEP_SECTIONS = ['Instructions', 'Hints', 'Starter State / Code', 'Solution State / Code', 'Evaluation Tests'];

// Order inside a module: theory -> workshop -> lab -> review -> quiz
export const MODULE_SEQUENCE = ['theory', 'workshop', 'lab', 'review', 'quiz'];
