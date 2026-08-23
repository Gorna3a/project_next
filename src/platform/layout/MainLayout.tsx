'use client';

import { useState, type ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export const MainLayout = ({ children }: { children?: ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="app" style={{ gridTemplateColumns: collapsed ? '64px 1fr' : '230px 1fr', backgroundColor: 'var(--bg-base)' } as any}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <div className="main">
        <Header sidebarCollapsed={collapsed} />
        <div className="wrap">
          {children}
        </div>
      </div>
    </div>
  );
};
