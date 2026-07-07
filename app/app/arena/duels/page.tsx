'use client';
import dynamic from "next/dynamic";

const DuelLobby = dynamic(() => import("@/platform/pages/Arena/DuelZone/DuelLobby"), { ssr: false });

export default function Duels() {
  return <DuelLobby />;
}
