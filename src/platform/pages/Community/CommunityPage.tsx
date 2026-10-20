'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import { Users, ArrowLeft, ArrowRight } from "lucide-react";
import { useLanguage } from "../../../core/context/LanguageContext";

export default function CommunityPage() {
  const { t, isRTL } = useLanguage();

  return (
    <div className="max-w-3xl mx-auto py-10">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-4"
      >
        <div className="crt scan">
          <span className="section-label">{t('community.notReadyTag')}</span>
          <h1 style={{ marginTop: 14 }}>{t('community.notReadyTitle')}</h1>
          <p className="sub" style={{ marginTop: 10 }}>
            {t('community.title').toUpperCase()} · PIXELCODE
          </p>
        </div>

        <div className="panel">
          <div className="panel-head">
            <span>{t('community.title').toUpperCase()}</span>
            <span className="flex items-center gap-2">
              <span className="dot" />
              BUILDING
            </span>
          </div>
          <div className="p-6 space-y-5 text-center">
            <div
              className="w-16 h-16 mx-auto grid place-items-center"
              style={{
                background: 'var(--border)',
                color: 'var(--phosphor)',
                border: '4px solid var(--border)',
                boxShadow: '4px 4px 0 var(--border)',
              }}
            >
              <Users style={{ width: 30, height: 30 }} />
            </div>
            <p className="mono text-sm leading-relaxed" style={{ color: 'var(--fg)' }}>
              {t('community.notReadyDesc')}
            </p>
            <Link
              href="/app"
              className={`big-btn yellow inline-flex items-center justify-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
              style={{ width: 'auto', padding: '12px 20px', margin: '0 auto' }}
            >
              {isRTL ? <ArrowRight style={{ width: 16, height: 16 }} /> : <ArrowLeft style={{ width: 16, height: 16 }} />}
              {t('community.backHome')}
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
