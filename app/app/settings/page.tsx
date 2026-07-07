'use client';
import dynamic from "next/dynamic";

const SettingsPage = dynamic(() => import("@/platform/pages/Settings/SettingsPage"), { ssr: false });

export default function Settings() {
  return <SettingsPage />;
}
