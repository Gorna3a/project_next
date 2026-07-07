'use client';
import dynamic from "next/dynamic";

const MathPage = dynamic(() => import("@/kids/pages/MathPage"), { ssr: false });

export default function Math() {
  return <MathPage />;
}
