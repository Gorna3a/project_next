'use client';
import dynamic from "next/dynamic";

const TrainingPage = dynamic(() => import("@/platform/pages/Training/TrainingPage"), { ssr: false });

export default function Training() {
  return <TrainingPage />;
}
