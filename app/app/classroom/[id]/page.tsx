'use client';
import dynamic from "next/dynamic";

const ClassroomDetailPage = dynamic(() => import("@/platform/pages/Classroom/ClassroomDetailPage"), { ssr: false });

export default function ClassroomDetail() {
  return <ClassroomDetailPage />;
}
