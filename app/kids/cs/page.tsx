'use client';
import dynamic from "next/dynamic";

const LearnCSPage = dynamic(() => import("@/kids/pages/LearnCSPage"), { ssr: false });

export default function LearnCS() {
  return <LearnCSPage />;
}
