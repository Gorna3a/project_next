'use client';
import dynamic from "next/dynamic";

const PublicProfile = dynamic(() => import("@/platform/pages/Profile/PublicProfile"), { ssr: false });

export default function UserProfile() {
  return <PublicProfile />;
}
