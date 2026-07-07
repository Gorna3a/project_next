'use client';
import dynamic from "next/dynamic";

const CoursesPage = dynamic(() => import("@/platform/pages/Courses/CoursesPage"), { ssr: false });

export default function Courses() {
  return <CoursesPage />;
}
