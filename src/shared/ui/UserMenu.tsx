'use client';

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { 
  User, 
  Settings, 
  LogOut, 
  LayoutDashboard, 
  ChevronDown,
  ShieldCheck
} from "lucide-react";
import { useAuth } from "../../core/context/AuthContext";
import { useLanguage } from "../../core/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

interface UserMenuProps {
  variant?: "platform" | "kids" | "landing";
}

export const UserMenu = ({ variant = "platform" }: UserMenuProps) => {
  const { user, profile, logOut } = useAuth();
  const { t, isRTL } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) {
    if (variant === "platform") return null;
    
    return (
      <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <Link href="/login" className={variant === "kids" ? "text-white hover:underline font-bold text-sm" : "btn-secondary text-sm px-4 py-2"}>
          {t('auth.loginLink')}
        </Link>
        <Link href="/signup" className={variant === "kids" ? "bg-white text-purple-600 px-4 py-2 rounded-full font-black text-sm shadow-md" : "btn-primary text-sm px-4 py-2"}>
          {variant === "kids" 
            ? t('common.joinNow') 
            : t('common.getStarted')}
        </Link>
      </div>
    );
  }

  const isAdmin = profile?.role === "admin";
  const initials = profile?.displayName?.[0] || user.email?.[0] || "U";

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 p-1 rounded-xl transition-all
          ${variant === "kids" 
            ? "bg-white/20 text-white hover:bg-white/30" 
            : "hover:bg-gray-100 dark:hover:bg-gray-800"}`}
      >
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs shadow-inner
          ${variant === "kids" ? "bg-yellow-400 text-purple-700" : "bg-brand-500 text-white"}`}>
          {profile?.photoURL ? (
            <img src={profile.photoURL} alt="" className="w-full h-full rounded-full object-cover" />
          ) : (
            initials.toUpperCase()
          )}
        </div>
        <span className={`text-sm font-bold hidden sm:block ${variant === "kids" ? "text-white" : "text-gray-700 dark:text-gray-200"}`}>
          {profile?.displayName?.split(' ')[0] || t('common.user')}
        </span>
        <ChevronDown className={`w-4 h-4 opacity-50 ${variant === "kids" ? "text-white" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 w-56 rounded-2xl shadow-xl border z-50 overflow-hidden`}
            style={{ 
              backgroundColor: "var(--bg-elevated)", 
              borderColor: "var(--border)" 
            }}
          >
            <div className={`p-4 border-b border-gray-100 dark:border-gray-800 ${isRTL ? 'text-right' : 'text-left'}`}>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{t('userMenu.signedInAs')}</p>
              <p className="text-sm font-bold truncate" style={{ color: "var(--text-base)" }}>
                {profile?.displayName || user.email}
              </p>
              {isAdmin && (
                <div className={`mt-2 flex items-center gap-1.5 px-2 py-0.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md text-[10px] font-black uppercase tracking-tighter w-fit ${isRTL ? 'mr-0 ml-auto' : ''}`}>
                  <ShieldCheck className="w-3 h-3" /> {t('nav.admin')}
                </div>
              )}
            </div>

            <div className="p-2">
              <Link
                href="/app"
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-brand-600 transition-all ${isRTL ? 'flex-row-reverse text-right' : ''}`}
              >
                <LayoutDashboard className="w-4 h-4" />
                {t('nav.dashboard')}
              </Link>
              <Link
                href="/app/profile"
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-brand-600 transition-all ${isRTL ? 'flex-row-reverse text-right' : ''}`}
              >
                <User className="w-4 h-4" />
                {t('userMenu.myProfile')}
              </Link>
              <Link
                href="/app/settings"
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-brand-600 transition-all ${isRTL ? 'flex-row-reverse text-right' : ''}`}
              >
                <Settings className="w-4 h-4" />
                {t('common.settings')}
              </Link>
            </div>

            <div className="p-2 border-t border-gray-100 dark:border-gray-800">
              <button
                onClick={() => {
                  logOut();
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all ${isRTL ? 'flex-row-reverse text-right' : ''}`}
              >
                <LogOut className="w-4 h-4" />
                {t('common.logout')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
