'use client';

import { useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useLanguage } from "../../core/context/LanguageContext";

export const MainLayout = ({ children }: { children?: ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { isRTL } = useLanguage();

  const marginValue = collapsed ? 64 : 240;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-base)" }}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <Header sidebarCollapsed={collapsed} />

      <motion.main
        animate={{ 
          marginLeft: isRTL ? 0 : marginValue,
          marginRight: isRTL ? marginValue : 0
        }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="pt-16 min-h-screen"
      >
        <div className="p-6">
          {children}
        </div>
      </motion.main>
    </div>
  );
};
