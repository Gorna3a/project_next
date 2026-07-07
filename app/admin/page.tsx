'use client';
import dynamic from "next/dynamic";

const AdminDashboard = dynamic(() => import("@/platform/pages/Admin/AdminDashboard"), { ssr: false });

export default function Admin() {
  return <AdminDashboard />;
}
