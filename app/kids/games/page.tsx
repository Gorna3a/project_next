'use client';
import dynamic from "next/dynamic";

const GamesPage = dynamic(() => import("@/kids/pages/GamesPage"), { ssr: false });

export default function Games() {
  return <GamesPage />;
}
