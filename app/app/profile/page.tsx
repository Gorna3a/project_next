'use client';
import dynamic from "next/dynamic";

const ProfilePage = dynamic(() => import("@/platform/pages/Profile/ProfilePage"), { ssr: false });

export default function Profile() {
  return <ProfilePage />;
}
