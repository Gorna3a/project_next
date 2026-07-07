'use client';
import dynamic from "next/dynamic";

const ChallengeView = dynamic(() => import("@/platform/pages/Arena/ChallengeView"), { ssr: false });

export default function Challenge() {
  return <ChallengeView />;
}
