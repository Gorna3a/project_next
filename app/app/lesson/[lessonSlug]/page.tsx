'use client';
import dynamic from "next/dynamic";

const LessonPage = dynamic(() => import("@/platform/pages/Courses/LessonPage"), { ssr: false });

export default function Lesson() {
  return <LessonPage />;
}
