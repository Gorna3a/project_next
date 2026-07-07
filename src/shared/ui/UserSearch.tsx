'use client';

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, User, Trophy, Sword, ChevronRight, ChevronLeft } from "lucide-react";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "../../core/firebase/config";
import Link from "next/link";
import { useLanguage } from "../../core/context/LanguageContext";
import type { UserProfile } from "../../core/types";

interface UserSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserSearch = ({ isOpen, onClose }: UserSearchProps) => {
  const { t, isRTL } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setSearchTerm("");
      setResults([]);
    }
  }, [isOpen]);

  // Debounced search
  useEffect(() => {
    if (!searchTerm.trim() || searchTerm.length < 2) {
      setResults([]);
      return;
    }

    const delay = setTimeout(async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, "users"),
          where("displayName", ">=", searchTerm),
          where("displayName", "<=", searchTerm + "\uf8ff"),
          limit(6)
        );
        const snap = await getDocs(q);
        const users = snap.docs.map(doc => ({ ...doc.data() } as UserProfile));
        setResults(users);
      } catch (e) {
        console.error("Search error:", e);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(delay);
  }, [searchTerm]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
          />

          {/* Search Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-[10%] left-1/2 -translate-x-1/2 w-full max-w-xl z-[70] p-4"
          >
            <div className={`bg-white dark:bg-gray-900 rounded-[2rem] shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden ${isRTL ? 'text-right' : 'text-left'}`}>
              {/* Input Header */}
              <div className={`p-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t('social.searchPlaceholder')}
                  className={`flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-white font-medium text-lg placeholder:text-gray-400 ${isRTL ? 'text-right' : 'text-left'}`}
                />
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Results Area */}
              <div className="max-h-[400px] overflow-y-auto p-2 custom-scrollbar">
                {loading ? (
                  <div className="p-12 text-center">
                    <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  </div>
                ) : results.length > 0 ? (
                  <div className="space-y-1">
                    {results.map((user) => (
                      <Link
                        key={user.uid}
                        href={`/app/profile/${user.uid}`}
                        onClick={onClose}
                        className={`flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all group ${isRTL ? 'flex-row-reverse' : ''}`}
                      >
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 p-0.5 shadow-lg shadow-brand-500/20">
                          {user.photoURL ? (
                            <img src={user.photoURL} alt="" className="w-full h-full rounded-[10px] object-cover" />
                          ) : (
                            <div className="w-full h-full rounded-[10px] bg-brand-600 flex items-center justify-center text-white">
                              <User className="w-6 h-6" />
                            </div>
                          )}
                        </div>
                        <div className={`flex-1 min-w-0 ${isRTL ? 'text-right' : 'text-left'}`}>
                          <h4 className="font-bold text-gray-900 dark:text-white truncate">
                            {user.displayName}
                          </h4>
                          <div className={`flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 font-medium ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <span className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <Trophy className="w-3 h-3 text-yellow-500" /> {t('common.level')} {user.level}
                            </span>
                            <span className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <Sword className="w-3 h-3 text-brand-500" /> {user.totalXP} {t('common.xp')}
                            </span>
                          </div>
                        </div>
                        {isRTL ? (
                          <ChevronLeft className="w-5 h-5 text-gray-300 group-hover:text-brand-500 group-hover:-translate-x-1 transition-all" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-brand-500 group-hover:translate-x-1 transition-all" />
                        )}
                      </Link>
                    ))}
                  </div>
                ) : searchTerm.length >= 2 ? (
                  <div className="p-12 text-center text-gray-500 dark:text-gray-400">
                    {t('social.noUsersFound')} "{searchTerm}"
                  </div>
                ) : (
                  <div className="p-12 text-center space-y-2">
                    <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-3xl flex items-center justify-center mx-auto mb-4">
                       <User className="w-8 h-8 text-gray-300" />
                    </div>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{t('social.typeToSearch')}</p>
                    <p className="text-xs text-gray-500">{t('social.searchHint')}</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
