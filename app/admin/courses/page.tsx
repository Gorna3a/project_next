'use client';
import dynamic from "next/dynamic";

const CourseManagement = dynamic(() => import("@/platform/pages/Admin/CourseManagement"), { ssr: false });

export default function Courses() {
  return <CourseManagement />;
}
