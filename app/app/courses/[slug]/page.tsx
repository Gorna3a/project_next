'use client';
import dynamic from "next/dynamic";

const CourseDetailPage = dynamic(() => import("@/platform/pages/Courses/CourseDetailPage"), { ssr: false });

export default function CourseDetail() {
  return <CourseDetailPage />;
}
