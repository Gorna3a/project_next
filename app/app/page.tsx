'use client';
import dynamic from "next/dynamic";

const DashboardPage = dynamic(() => import("@/platform/pages/Dashboard/DashboardPage"), { ssr: false });

export default function Dashboard() {
  return <DashboardPage />;
}
