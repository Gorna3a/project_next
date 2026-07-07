'use client';
import dynamic from "next/dynamic";

const ClassroomPage = dynamic(() => import("@/platform/pages/Classroom/ClassroomPage"), { ssr: false });

export default function Classroom() {
  return <ClassroomPage />;
}
