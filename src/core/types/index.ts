// ─── Theme ───────────────────────────────────────────────────────────────────

export type AppTheme =
  | "light"
  | "dark"
  | "midnight"
  | "sunset"
  | "nord"
  | "kids-ocean"
  | "kids-green"
  | "kids-sunset"
  | "custom"
  | "system";

// ─── User & Auth ──────────────────────────────────────────────────────────────

export type UserRole = "student" | "teacher" | "admin";

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  totalXP: number;
  level: number;
  streak: number;
  createdAt: Date;
  lastActive: Date;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme:
    | "light"
    | "dark"
    | "midnight"
    | "sunset"
    | "nord"
    | "kids-ocean"
    | "kids-green"
    | "kids-sunset"
    | "custom"
    | "system";
  language: string; // preferred programming language
  emailNotifs: boolean;
}

// ─── Kids ─────────────────────────────────────────────────────────────────────

export interface ChildProfile {
  id: string;
  name: string;
  avatar: string; // emoji or avatar id
  age?: number;
  totalXP: number;
  completedActivities: string[];
  createdAt: Date;
}

// ─── Courses & Lessons ────────────────────────────────────────────────────────

export type ProgrammingLanguage =
  | "python"
  | "java"
  | "c"
  | "cpp"
  | "javascript"
  | "typescript"
  | "go"
  | "rust"
  | "kotlin"
  | "swift";

export type DifficultyLevel = "beginner" | "intermediate" | "advanced";

export interface Course {
  id: string;
  title: string;
  description: string;
  language: ProgrammingLanguage;
  level: DifficultyLevel;
  thumbnail?: string;
  tags: string[];
  totalLessons: number;
  estimatedHours: number;
  publishedAt: Date;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  order: number;
  content: LessonBlock[];
  quizzes: Quiz[];
  estimatedMinutes: number;
}

export type LessonBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; level: 1 | 2 | 3; text: string }
  | { type: "code"; language: string; code: string }
  | { type: "callout"; variant: "info" | "warning" | "tip"; text: string }
  | { type: "image"; url: string; alt: string };

export interface Quiz {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

// ─── Progress ─────────────────────────────────────────────────────────────────

export interface CourseProgress {
  courseId: string;
  completedLessons: string[];
  quizScores: Record<string, number>;
  lastAccessed: Date;
  percentComplete: number;
}

// ─── Challenges ───────────────────────────────────────────────────────────────

export type ChallengeDifficulty = "easy" | "medium" | "hard" | "expert";

export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: ChallengeDifficulty;
  language: ProgrammingLanguage;
  xp: number;
  starterCode: string;
  testCases: TestCase[];
  hint?: string;
  tags: string[];
}

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

// ─── Classroom ────────────────────────────────────────────────────────────────

export interface Classroom {
  id: string;
  name: string;
  teacherId: string;
  joinCode: string;
  students: string[]; // uids
  createdAt: Date;
}

export interface Assignment {
  id: string;
  classroomId: string;
  title: string;
  description: string;
  courseId?: string;
  challengeId?: string;
  dueDate: Date;
  createdAt: Date;
}

// ─── Chat ─────────────────────────────────────────────────────────────────────

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}
