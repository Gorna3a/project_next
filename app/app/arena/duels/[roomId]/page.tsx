'use client';
import dynamic from "next/dynamic";

const DuelArena = dynamic(() => import("@/platform/pages/Arena/DuelZone/DuelArena"), { ssr: false });

export default function Duel() {
  return <DuelArena />;
}
