'use client';
import dynamic from "next/dynamic";

const IDEHomePage = dynamic(() => import("@/platform/pages/IDE/IDEHomePage"), { ssr: false });

export default function IDEPage() {
  return <IDEHomePage />;
}
