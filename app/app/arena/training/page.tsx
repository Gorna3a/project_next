'use client';
import dynamic from "next/dynamic";

const TrainingGrounds = dynamic(() => import("@/platform/pages/Arena/TrainingGrounds"), { ssr: false });

export default function Training() {
  return <TrainingGrounds />;
}
