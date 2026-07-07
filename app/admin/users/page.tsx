'use client';
import dynamic from "next/dynamic";

const UserManagement = dynamic(() => import("@/platform/pages/Admin/UserManagement"), { ssr: false });

export default function Users() {
  return <UserManagement />;
}
