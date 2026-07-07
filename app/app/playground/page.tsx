'use client';
import dynamic from "next/dynamic";

const PlaygroundPage = dynamic(() => import("@/platform/pages/Playground/PlaygroundPage"), { ssr: false });

export default function Playground() {
  return <PlaygroundPage />;
}
