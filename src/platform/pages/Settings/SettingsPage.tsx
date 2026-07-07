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

// ─── Section wrapper ──────────────────────────────────────────────────────────

const Section = ({
  icon: Icon,
  title,
  children,
  isRTL,
}: {
  icon: React.ComponentType<{
    className?: string;
    style?: React.CSSProperties;
  }>;
  title: string;
  children: React.ReactNode;
  isRTL: boolean;
}) => (
  <motion.div variants={fadeUp} className={`card p-6 space-y-4 ${isRTL ? 'text-right' : 'text-left'}`}>
    <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
      <Icon className="w-5 h-5" style={{ color: "var(--accent-text)" }} />
      <h2 className="font-semibold" style={{ color: "var(--text-primary)" }}>
        {title}
      </h2>
    </div>
    {children}
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
      className={`max-w-2xl mx-auto space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}
    >
      {/* Page heading */}
      <motion.div variants={fadeUp}>
        <h1
          className="text-2xl font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          {t('settings.title')}
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
          {t('settings.subtitle')}
        </p>
      </motion.div>

      {/* ── Appearance ── */}
      <Section icon={Palette} title={t('settings.appearance')} isRTL={isRTL}>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          {t('settings.appearanceDesc')}
        </p>
        <ThemePicker />
      </Section>

      {/* ── Theme Lab ── */}
      <Section icon={Palette} title={t('settings.themeLab')} isRTL={isRTL}>
        <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
          {t('settings.themeLabDesc')}
        </p>
        <ThemeLab />
      </Section>

      {/* ── Notifications ── */}
      <Section icon={Bell} title={t('settings.notifications')} isRTL={isRTL}>
        <div className={`flex items-center justify-between py-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <p
              className="text-sm font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              {t('settings.emailNotifs')}
            </p>
            <p
              className="text-xs mt-0.5"
              style={{ color: "var(--text-muted)" }}
            >
              {t('settings.emailNotifsDesc')}
            </p>
          </div>
          {/* Toggle switch */}
          <button
            onClick={() => setEmailNotifs((v) => !v)}
            className="w-12 h-6 rounded-full flex items-center p-1 transition-colors duration-300 flex-shrink-0"
            style={{
              backgroundColor: emailNotifs
                ? "var(--accent)"
                : "var(--bg-subtle)",
            }}
          >
            <motion.div
              animate={{ x: isRTL ? (emailNotifs ? -24 : 0) : (emailNotifs ? 24 : 0) }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="w-4 h-4 bg-white rounded-full shadow"
            />
          </button>
        </div>
      </Section>

      {/* ── Account info ── */}
      <Section icon={Shield} title={t('settings.account')} isRTL={isRTL}>
        <div className="space-y-2">
          <div
            className={`flex justify-between items-center py-2 border-b ${isRTL ? 'flex-row-reverse' : ''}`}
            style={{ borderColor: "var(--border)" }}
          >
            <span
              className="text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              {t('settings.email')}
            </span>
            <span
              className="text-sm font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              {user?.email}
            </span>
          </div>
          <div
            className={`flex justify-between items-center py-2 border-b ${isRTL ? 'flex-row-reverse' : ''}`}
            style={{ borderColor: "var(--border)" }}
          >
            <span
              className="text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              {t('settings.role')}
            </span>
            <span
              className="text-sm font-medium capitalize"
              style={{ color: "var(--text-primary)" }}
            >
              {profile?.role === 'student' ? t('common.student') : profile?.role === 'teacher' ? t('common.teacher') : profile?.role === 'admin' ? t('common.admin') : (profile?.role ?? t('common.student'))}
            </span>
          </div>
          <div className={`flex justify-between items-center py-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span
              className="text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              {t('settings.memberSince')}
            </span>
            <span
              className="text-sm font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              {profile?.createdAt
                ? new Date(profile.createdAt).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US')
                : "—"}
            </span>
          </div>
        </div>
      </Section>

      {/* ── Danger Zone ── */}
      <motion.div
        variants={fadeUp}
        className={`card p-6 space-y-4 border-2 ${isRTL ? 'text-right' : 'text-left'}`}
        style={{
          borderColor: "rgba(239,68,68,0.3)",
          backgroundColor: "rgba(239,68,68,0.04)",
        }}
      >
        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <h2 className="font-semibold text-red-600 dark:text-red-400">
            {t('settings.dangerZone')}
          </h2>
        </div>

        <AnimatePresence mode="wait">
          {!deleteConfirm ? (
            <motion.div
              key="initial"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={isRTL ? 'text-right' : 'text-left'}
            >
              <p
                className="text-sm mb-3"
                style={{ color: "var(--text-secondary)" }}
              >
                {t('settings.deleteDesc')}
              </p>
              <button
                onClick={() => setDeleteConfirm(true)}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-red-600 border border-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
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
              <p className="text-sm font-semibold text-red-600">
                {t('settings.deleteConfirm')}
              </p>
              <ul className={`text-xs space-y-1 text-red-500 ${isRTL ? 'pr-4' : 'pl-4'}`}>
                <li>&bull; {t('settings.deleteWarning1')}</li>
                <li>&bull; {t('settings.deleteWarning2')}</li>
                <li>&bull; {t('settings.deleteWarning3')}</li>
                <li>&bull; {t('settings.deleteWarning4')}</li>
              </ul>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                {t('settings.typeDelete')}
              </p>
              <input
                value={deleteInput}
                onChange={(e) => setDeleteInput(e.target.value)}
                placeholder="DELETE"
                className={`input text-sm font-mono ${isRTL ? 'text-right' : 'text-left'}`}
              />
              <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <button
                  onClick={() => {
                    setDeleteConfirm(false);
                    setDeleteInput("");
                  }}
                  className="btn-secondary flex-1"
                >
                  {t('settings.cancel')}
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteInput !== "DELETE" || deleting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
      </motion.div>
    </motion.div>
  );
}
