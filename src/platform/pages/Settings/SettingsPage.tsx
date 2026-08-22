'use client';

import { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Palette, Bell, Shield, Loader2, AlertTriangle } from "lucide-react";
import { deleteUser } from "firebase/auth";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../../core/firebase/config";
import { useAuth } from "../../../core/context/AuthContext";
import { ThemePicker } from "../../../shared/ui/ThemePicker";
import { ThemeLab } from "../../../shared/ui/ThemeLab";
import { useRouter } from "next/navigation";
import { useLanguage } from "../../../core/context/LanguageContext";
import toast from "react-hot-toast";

// ─── Variants ─────────────────────────────────────────────────────────────────

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" as const },
  },
};
const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

// ─── Section wrapper — hard brutalist card ───────────────────────────────────

const Section = ({
  icon: Icon,
  title,
  children,
  isRTL,
  accent = "bg-[#FFD23F]",
}: {
  icon: React.ComponentType<{
    className?: string;
    style?: React.CSSProperties;
  }>;
  title: string;
  children: React.ReactNode;
  isRTL: boolean;
  accent?: string;
}) => (
  <motion.div variants={fadeUp} className={`bg-white border-[3px] border-black shadow-[5px_5px_0_0_#000] overflow-hidden ${isRTL ? 'text-right' : 'text-left'}`}>
    <div className={`flex items-center gap-3 px-6 py-3 border-b-[3px] border-black ${accent} ${isRTL ? 'flex-row-reverse' : ''}`}>
      <span className="w-8 h-8 bg-black border-[2px] border-black grid place-items-center shrink-0">
        <Icon className="w-4 h-4 text-white" />
      </span>
      <h2 className="font-mono text-xs font-black uppercase tracking-widest text-black">
        {title}
      </h2>
    </div>
    <div className="p-6 space-y-4">
      {children}
    </div>
  </motion.div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const { user, profile, logOut } = useAuth();
  const { t, isRTL } = useLanguage();
  const navigate = useRouter();
  const [emailNotifs, setEmailNotifs] = useState(
    profile?.preferences?.emailNotifs ?? true,
  );
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");
  const [deleting, setDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    if (deleteInput !== "DELETE" || !user) return;
    setDeleting(true);
    try {
      await deleteDoc(doc(db, "users", user.uid));
      await deleteUser(user);
      await logOut();
      toast.success(t('settings.accountDeleted'));
      navigate.push("/");
    } catch (e: unknown) {
      if (
        e instanceof Error &&
        (e as { code?: string }).code === "auth/requires-recent-login"
      ) {
        toast.error(t('settings.reloginRequired'));
      } else {
        toast.error(t('settings.deleteFailed'));
      }
    } finally {
      setDeleting(false);
      setDeleteConfirm(false);
    }
  };

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className={`max-w-2xl mx-auto space-y-6 pb-12 ${isRTL ? 'text-right' : 'text-left'}`}
    >
      {/* Page heading — black masthead */}
      <motion.div variants={fadeUp} className="bg-black text-white border-[3px] border-black shadow-[5px_5px_0_0_#000] p-6">
        <h1 className="font-black text-2xl tracking-tight flex items-center gap-3" style={{ fontFamily: "'Syne', sans-serif" }}>
          <span className="w-2 h-6 bg-[#FFD23F] border border-white hidden sm:inline-block" />
          {t('settings.title')}
        </h1>
        <p className="font-mono text-xs font-bold uppercase tracking-widest mt-1 text-white/60">
          {t('settings.subtitle')}
        </p>
      </motion.div>

      {/* ── Appearance ── */}
      <Section icon={Palette} title={t('settings.appearance')} isRTL={isRTL} accent="bg-[#FFD23F]">
        <p className="font-mono text-xs font-bold uppercase tracking-widest text-black/60">
          {t('settings.appearanceDesc')}
        </p>
        <ThemePicker />
      </Section>

      {/* ── Theme Lab ── */}
      <Section icon={Palette} title={t('settings.themeLab')} isRTL={isRTL} accent="bg-[#74B9FF]">
        <p className="font-mono text-xs font-bold uppercase tracking-widest text-black/60 mb-2">
          {t('settings.themeLabDesc')}
        </p>
        <ThemeLab />
      </Section>

      {/* ── Notifications ── */}
      <Section icon={Bell} title={t('settings.notifications')} isRTL={isRTL} accent="bg-[#88D498]">
        <div className={`flex items-center justify-between gap-4 py-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <p className="font-mono text-sm font-black uppercase tracking-widest text-black">
              {t('settings.emailNotifs')}
            </p>
            <p className="font-mono text-xs font-bold mt-1 text-black/60">
              {t('settings.emailNotifsDesc')}
            </p>
          </div>
          {/* Toggle — hard rectangle */}
          <button
            onClick={() => setEmailNotifs((v) => !v)}
            className={`w-14 h-8 border-[3px] border-black flex items-center p-1 transition-colors duration-200 shrink-0 shadow-[3px_3px_0_0_#000] ${emailNotifs ? 'bg-black' : 'bg-white'}`}
            aria-pressed={emailNotifs}
          >
            <motion.div
              animate={{ x: isRTL ? (emailNotifs ? -20 : 0) : (emailNotifs ? 20 : 0) }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className={`w-4 h-4 border-[2px] border-black shadow-sm ${emailNotifs ? 'bg-[#FFD23F]' : 'bg-black'}`}
            />
          </button>
        </div>
      </Section>

      {/* ── Account info ── */}
      <Section icon={Shield} title={t('settings.account')} isRTL={isRTL} accent="bg-white">
        <div className="space-y-0 border-[3px] border-black overflow-hidden">
          <div className={`flex justify-between items-center py-3 px-4 border-b-[3px] border-black bg-[#FFFDF5] ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span className="font-mono text-xs font-black uppercase tracking-widest text-black">
              {t('settings.email')}
            </span>
            <span className="font-mono text-xs font-bold text-black">
              {user?.email}
            </span>
          </div>
          <div className={`flex justify-between items-center py-3 px-4 border-b-[3px] border-black bg-white ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span className="font-mono text-xs font-black uppercase tracking-widest text-black">
              {t('settings.role')}
            </span>
            <span className="font-mono text-xs font-black uppercase tracking-widest bg-black text-white border-[2px] border-black px-2 py-1">
              {profile?.role === 'student' ? t('common.student') : profile?.role === 'teacher' ? t('common.teacher') : profile?.role === 'admin' ? t('common.admin') : (profile?.role ?? t('common.student'))}
            </span>
          </div>
          <div className={`flex justify-between items-center py-3 px-4 bg-[#FFFDF5] ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span className="font-mono text-xs font-black uppercase tracking-widest text-black">
              {t('settings.memberSince')}
            </span>
            <span className="font-mono text-xs font-bold text-black">
              {profile?.createdAt
                ? new Date(profile.createdAt).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US')
                : "—"}
            </span>
          </div>
        </div>
      </Section>

      {/* ── Danger Zone — hard red card ── */}
      <motion.div
        variants={fadeUp}
        className={`bg-[#FF6B6B] border-[3px] border-black shadow-[5px_5px_0_0_#000] overflow-hidden ${isRTL ? 'text-right' : 'text-left'}`}
      >
        <div className={`flex items-center gap-3 px-6 py-3 bg-black border-b-[3px] border-black ${isRTL ? 'flex-row-reverse' : ''}`}>
          <span className="w-8 h-8 bg-[#FF6B6B] border-[2px] border-white grid place-items-center">
            <AlertTriangle className="w-4 h-4 text-black" />
          </span>
          <h2 className="font-mono text-xs font-black uppercase tracking-widest text-white">
            {t('settings.dangerZone')}
          </h2>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {!deleteConfirm ? (
              <motion.div
                key="initial"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={isRTL ? 'text-right' : 'text-left'}
              >
                <p className="font-mono text-xs font-bold leading-relaxed text-black">
                  {t('settings.deleteDesc')}
                </p>
                <button
                  onClick={() => setDeleteConfirm(true)}
                  className="mt-3 bg-black text-white border-[3px] border-black shadow-[3px_3px_0_0_#000] font-mono text-xs font-black uppercase tracking-widest px-4 py-2 hover:bg-white hover:text-black active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
                >
                  {t('settings.deleteAccount')}
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                <p className="font-mono text-xs font-black uppercase tracking-widest bg-black text-white border-[2px] border-black px-3 py-2 inline-block">
                  {t('settings.deleteConfirm')}
                </p>
                <ul className={`font-mono text-xs font-bold space-y-1 text-black bg-white border-[3px] border-black p-3 ${isRTL ? 'pr-6' : 'pl-6'}`}>
                  <li>• {t('settings.deleteWarning1')}</li>
                  <li>• {t('settings.deleteWarning2')}</li>
                  <li>• {t('settings.deleteWarning3')}</li>
                  <li>• {t('settings.deleteWarning4')}</li>
                </ul>
                <p className="font-mono text-xs font-black uppercase tracking-widest text-black">
                  {t('settings.typeDelete')}
                </p>
                <input
                  value={deleteInput}
                  onChange={(e) => setDeleteInput(e.target.value)}
                  placeholder="DELETE"
                  className={`w-full bg-white border-[3px] border-black shadow-[3px_3px_0_0_#000] px-3 py-2.5 font-mono text-sm font-black tracking-widest placeholder:text-black/30 focus:outline-none ${isRTL ? 'text-right' : 'text-left'}`}
                />
                <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <button
                    onClick={() => {
                      setDeleteConfirm(false);
                      setDeleteInput("");
                    }}
                    className="flex-1 bg-white text-black border-[3px] border-black shadow-[3px_3px_0_0_#000] font-mono text-xs font-black uppercase tracking-widest py-2.5 hover:bg-black hover:text-white transition-colors"
                  >
                    {t('settings.cancel')}
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleteInput !== "DELETE" || deleting}
                    className="flex-1 flex items-center justify-center gap-2 bg-black text-white border-[3px] border-black shadow-[3px_3px_0_0_#000] font-mono text-xs font-black uppercase tracking-widest py-2.5 hover:bg-white hover:text-black disabled:opacity-50 disabled:cursor-not-allowed active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
                  >
                    {deleting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      t('settings.confirmDelete')
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
