'use client';
import dynamic from "next/dynamic";

const KidsHomePage = dynamic(() => import("@/kids/pages/KidsHomePage"), { ssr: false });

export default function KidsHome() {
  return <KidsHomePage />;
}
