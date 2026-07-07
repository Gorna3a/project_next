'use client';
import dynamic from "next/dynamic";

const ChallengeManager = dynamic(() => import("@/platform/pages/Admin/ChallengeManager"), { ssr: false });

export default function Challenges() {
  return <ChallengeManager />;
}
