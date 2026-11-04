'use client';
import dynamic from "next/dynamic";

const ArduinoPage = dynamic(() => import("@/platform/pages/Arduino/ArduinoPage"), { ssr: false });

export default function Arduino() {
  return <ArduinoPage />;
}
