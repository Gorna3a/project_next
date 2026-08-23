'use client';

import { useState } from "react";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "../../core/context/LanguageContext";
import { useNotifications } from "../../core/context/NotificationContext";
import { UserMenu } from "../../shared/ui/UserMenu";
import { NotificationTray } from "../../shared/ui/NotificationTray";
import { UserSearch } from "../../shared/ui/UserSearch";

interface HeaderProps {
  sidebarCollapsed: boolean;
}

export const Header = ({ sidebarCollapsed }: HeaderProps) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const { unreadCount } = useNotifications();
  const { isRTL } = useLanguage();

  return (
    <>
      <motion.header
        animate={{
          left: isRTL ? 0 : (sidebarCollapsed ? 64 : 230),
          right: isRTL ? (sidebarCollapsed ? 64 : 230) : 0,
        }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="topbar fixed top-0 h-[56px] flex items-center justify-between px-4 z-30"
        style={{ borderBottom: '4px solid var(--border)', background: 'var(--surface)' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            className="md:hidden grid place-items-center w-8 h-8 border-[3px] border-black bg-white hover:bg-black hover:text-white transition-colors"
            onClick={() => setShowSearch(true)}
            aria-label="Menu"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
          </button>
          <div className="drive hidden sm:flex">
            <div className="drive-slot"><i /><b /><i /></div>
            <div style={{ fontFamily: "'Press Start 2P'", fontSize: 7 }}>DRIVE A:</div>
          </div>
          <span className="mono hidden lg:inline" style={{ fontSize: 9, opacity: 0.5 }}>PIXEL OS v1.2 — CRT MODE</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={() => setShowSearch(true)}
            className="w-8 h-8 grid place-items-center border-[3px] border-black bg-white hover:bg-black hover:text-white transition-colors"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          <div className="hidden sm:flex" style={{ width: 42, height: 14, border: '3px solid var(--border)', background: 'var(--border)', gap: 2, padding: 2, display: 'flex' }}>
            <i style={{ flex: 1, background: 'var(--phosphor)' }} />
            <i style={{ flex: 1, background: 'var(--orange)' }} />
            <i style={{ flex: 1, background: 'var(--yellow, #FFE600)' }} />
          </div>

          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={`w-8 h-8 grid place-items-center border-[3px] transition-colors ${showNotifications ? 'bg-black text-white border-black' : 'bg-white border-black hover:bg-black hover:text-white'}`}
              aria-label="Notifications"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 8a6 6 0 0 1 12 0c0 7-6 5-6 9H6s-6-2-6-9" /><path d="M10 21a2 2 0 0 0 4 0" /></svg>
              {unreadCount > 0 && <span className={`absolute -top-1 ${isRTL ? '-left-1' : '-right-1'} w-2.5 h-2.5 bg-[var(--orange)] border-2 border-black rounded-full`} />}
            </button>
            <NotificationTray isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
          </div>

          <div className="hidden sm:flex border-[3px] border-black bg-white items-center gap-1.5 px-1.5 py-1">
            <UserMenu variant="platform" />
          </div>
          <div className="sm:hidden">
            <UserMenu variant="platform" />
          </div>
        </div>
      </motion.header>
      <UserSearch isOpen={showSearch} onClose={() => setShowSearch(false)} />
    </>
  );
};
