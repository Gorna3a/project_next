'use client';
import dynamic from "next/dynamic";

const ArenaHub = dynamic(() => import("@/platform/pages/Arena/ArenaHub"), { ssr: false });

export default function Arena() {
  return <ArenaHub />;
}
