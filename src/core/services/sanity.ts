// ─── Sanity CMS Client & Queries ──────────────────────────────────────────────
// Sanity is used to manage all course content (lessons, quizzes, code blocks).
// Firestore only stores user progress — never content.
//
// Setup: create a free project at sanity.io, then fill .env with your project ID.

import { createClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";
import { getStarterCourse, getStarterCourses, getStarterLesson, getStarterLessonsForCourse } from "./starterCourses";

// ─── Client ───────────────────────────────────────────────────────────────────

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "placeholder",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01",
  useCdn: true, // cached reads — fast for production
});



const builder = createImageUrlBuilder(sanityClient);
export const urlFor = (source: SanityImageSource) => builder.image(source);

// ─── TypeScript interfaces matching Sanity schema ─────────────────────────────

export interface SanityCourse {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  language: string;
  courseVersion: string;
  level: "beginner" | "intermediate" | "advanced";
  thumbnail?: SanityImageSource;
  thumbnailPrompt?: string;
  tags: string[];
  learningObjectives: string[];
  prerequisites: string[];
  totalLessons: number;
  estimatedHours: number;
  order: number;
  status: "draft" | "published" | "archived";
  publishedAt: string;
}

export interface SanityLesson {
  _id: string;
  title: string;
  slug: string;
  order: number;
  summary: string;
  objectives: string[];
  difficulty: "easy" | "medium" | "hard";
  estimatedMinutes: number;
  xp: number;
  lessonType?: "standard" | "lab";
  notebookUrl?: string;
  exercise?: {
    title: string;
    instructions: string;
    starterCode: string;
    solution: string;
    expectedOutput: string;
  };
  body: SanityBlock[];
  quizzes: SanityQuiz[];
  course: {
    _id: string;
    title: string;
    slug: string;
    language: string;
    totalLessons: number;
  };
}

export interface SanityBlock {
  _type: string;
  [key: string]: unknown;
}

export interface SanityQuiz {
  _key: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  xp: number;
}

// ─── Sanity Challenge type (matches Sanity schema) ────────────────────────────

export interface SanityChallenge {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  language: string;
  difficulty: "easy" | "medium" | "hard" | "expert";
  xp: number;
  challengeType: "code" | "quiz";
  starterCode?: string;
  hint?: string;
  tags?: string[];
  // Quiz-specific fields
  quizOptions?: { key: string; value: string }[];
  correctAnswer?: string;
  explanations?: { key: string; text: string }[];
}

// ─── GROQ Queries ─────────────────────────────────────────────────────────────

/** All published courses, ordered by language then display order */
export const getAllCourses = async (): Promise<SanityCourse[]> => {
  const query = `
    *[_type == "course" && defined(publishedAt)] | order(language asc, order asc) {
      _id,
      title,
      "slug": slug.current,
      shortDescription,
      description,
      language,
      courseVersion,
      level,
      thumbnail,
      thumbnailPrompt,
      tags,
      learningObjectives,
      prerequisites,
      totalLessons,
      estimatedHours,
      order,
      status,
      publishedAt
    }
  `;
  try {
    const courses = await sanityClient.fetch<SanityCourse[]>(query);
    return courses.length > 0 ? courses : getStarterCourses();
  } catch (error) {
    console.warn("Using starter courses because Sanity courses could not be loaded.", error);
    return getStarterCourses();
  }
};

/** Courses filtered by language */
export const getCoursesByLanguage = async (
  language: string,
): Promise<SanityCourse[]> => {
  const query = `
    *[_type == "course" && language == $language && defined(publishedAt)] | order(order asc) {
      _id,
      title,
      "slug": slug.current,
      shortDescription,
      description,
      language,
      courseVersion,
      level,
      thumbnail,
      thumbnailPrompt,
      tags,
      learningObjectives,
      prerequisites,
      totalLessons,
      estimatedHours,
      order,
      status,
      publishedAt
    }
  `;
  try {
    const courses = await sanityClient.fetch<SanityCourse[]>(query, { language });
    return courses.length > 0
      ? courses
      : getStarterCourses().filter(course => course.language === language);
  } catch (error) {
    console.warn("Using starter courses because Sanity courses could not be loaded.", error);
    return getStarterCourses().filter(course => course.language === language);
  }
};

/** All challenges from Sanity */
export const getAllChallenges = async (): Promise<SanityChallenge[]> => {
  const query = `
    *[_type == "challenge"] | order(difficulty asc, xp desc) {
      _id,
      title,
      "slug": slug.current,
      "description": pt::text(description),
      language,
      difficulty,
      xp,
      challengeType,
      starterCode,
      hint,
      tags,
      quizOptions,
      correctAnswer,
      explanations
    }
  `;
  try {
    return await sanityClient.fetch<SanityChallenge[]>(query);
  } catch (error) {
    console.warn("Failed to load challenges from Sanity.", error);
    return [];
  }
};

/** Single challenge by slug */
export const getChallengeBySlug = async (slug: string): Promise<SanityChallenge | null> => {
  const query = `
    *[_type == "challenge" && slug.current == $slug][0] {
      _id,
      title,
      "slug": slug.current,
      "description": pt::text(description),
      language,
      difficulty,
      xp,
      challengeType,
      starterCode,
      hint,
      tags,
      quizOptions,
      correctAnswer,
      explanations
    }
  `;
  try {
    return await sanityClient.fetch<SanityChallenge | null>(query, { slug });
  } catch (error) {
    console.warn("Failed to load challenge from Sanity.", error);
    return null;
  }
};

/** Single course by slug */
export const getCourse = async (slug: string): Promise<SanityCourse | null> => {
  const query = `
    *[_type == "course" && slug.current == $slug][0] {
      _id,
      title,
      "slug": slug.current,
      shortDescription,
      description,
      language,
      courseVersion,
      level,
      thumbnail,
      thumbnailPrompt,
      tags,
      learningObjectives,
      prerequisites,
      totalLessons,
      estimatedHours,
      order,
      status,
      publishedAt
    }
  `;
  try {
    return (await sanityClient.fetch<SanityCourse | null>(query, { slug })) ?? getStarterCourse(slug);
  } catch (error) {
    console.warn("Using starter course because Sanity course could not be loaded.", error);
    return getStarterCourse(slug);
  }
};

/** Single lesson by slug with full body content */
export const getLesson = async (
  lessonSlug: string,
): Promise<SanityLesson | null> => {
  const query = `
    *[_type == "lesson" && slug.current == $lessonSlug][0] {
      _id,
      title,
      "slug": slug.current,
      order,
      summary,
      objectives,
      difficulty,
      estimatedMinutes,
      xp,
      lessonType,
      notebookUrl,
      exercise,
      body,
      "quizzes": quizzes[] {
        _key,
        question,
        options,
        correctIndex,
        explanation,
        xp
      },
      "course": course-> {
        _id,
        title,
        "slug": slug.current,
        language,
        totalLessons
      }
    }
  `;
  try {
    return (await sanityClient.fetch<SanityLesson | null>(query, { lessonSlug })) ?? getStarterLesson(lessonSlug);
  } catch (error) {
    console.warn("Using starter lesson because Sanity lesson could not be loaded.", error);
    return getStarterLesson(lessonSlug);
  }
};

/** All lessons for a course in order */
export const getLessonsForCourse = async (
  courseId: string,
): Promise<SanityLesson[]> => {
  const query = `
    *[_type == "lesson" && course._ref == $courseId] | order(order asc) {
      _id,
      title,
      "slug": slug.current,
      order,
      summary,
      objectives,
      difficulty,
      estimatedMinutes,
      xp,
      lessonType,
      notebookUrl,
      exercise,
      body,
      "quizzes": quizzes[] {
        _key,
        question,
        options,
        correctIndex,
        explanation,
        xp
      },
      "course": course-> {
        _id,
        title,
        "slug": slug.current,
        language,
        totalLessons
      }
    }
  `;
  try {
    return await sanityClient.fetch<SanityLesson[]>(query, { courseId });
  } catch (error) {
    console.warn("Using starter lessons because Sanity lessons could not be loaded.", error);
    return getStarterLessonsForCourse(courseId);
  }
};
