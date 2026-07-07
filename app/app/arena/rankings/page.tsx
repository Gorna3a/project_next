'use client';
import dynamic from "next/dynamic";

const ArenaLeaderboard = dynamic(() => import("@/platform/pages/Arena/Rankings/ArenaLeaderboard"), { ssr: false });

export default function Rankings() {
  return <ArenaLeaderboard />;
}
