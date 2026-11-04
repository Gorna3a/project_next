'use client';

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  collection, query, orderBy, limit as fbLimit, getDocs,
} from "firebase/firestore";
import { Search, Users, Zap, Flame, UserPlus, Check, Loader2, ChevronRight } from "lucide-react";
import { db } from "../../../core/firebase/config";
import { useAuth } from "../../../core/context/AuthContext";
import { useLanguage } from "../../../core/context/LanguageContext";
import { socialService } from "../../../core/services/socialService";
import { pixelAvatarFor } from "../../../shared/ui/avatarFallback";
import type { UserProfile } from "../../../core/types";

const today = (iso: string) => new Date().toLocaleDateString(iso);

type RelState = 'loading' | 'none' | 'pending' | 'friends' | 'self' | 'error';

/** Self-contained friend button: resolves relationship once on mount. */
const FriendButton = ({ target }: { target: UserProfile }) => {
  const { profile } = useAuth();
  const { t } = useLanguage();
  const [rel, setRel] = useState<RelState>('loading');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    let alive = true;
    if (!profile) return;
    if (profile.uid === target.uid) { setRel('self'); return; }
    socialService
      .getRelationship(profile.uid, target.uid)
      .then(r => { if (alive) setRel(r); })
      .catch(() => { if (alive) setRel('error'); });
    return () => { alive = false; };
  }, [profile, target.uid]);

  if (!profile) return null;
  if (rel === 'self') {
    return <span className="friend-chip self">{t('community.you').toUpperCase()}</span>;
  }
  if (rel === 'friends') {
    return <span className="friend-chip friends"><Check size={12} strokeWidth={3.5} aria-hidden="true" /> {t('community.alreadyFriends').toUpperCase()}</span>;
  }
  if (rel === 'pending') {
    return <span className="friend-chip pending">{t('community.requestSent').toUpperCase()} ✓</span>;
  }
  if (rel === 'loading') {
    return <span className="friend-chip pending"><Loader2 size={12} className="animate-spin" aria-hidden="true" /> …</span>;
  }
  return (
    <button
      className="friend-chip add"
      disabled={sending}
      onClick={async () => {
        if (sending) return;
        setSending(true);
        try {
          await socialService.sendFriendRequest(profile, target.uid);
          setRel('pending');
        } catch {
          setRel('error');
        } finally {
          setSending(false);
        }
      }}
    >
      <UserPlus size={12} strokeWidth={3} aria-hidden="true" />
      {sending ? '…' : t('community.addFriend').toUpperCase()}
    </button>
  );
};

const CoderCard = ({ coder }: { coder: UserProfile }) => (
  <div className="coder-card">
    <Link href={`/app/profile/${coder.uid}`} aria-label={coder.displayName}>
      <img
        className="coder-avatar"
        src={coder.photoURL || pixelAvatarFor(coder.displayName)}
        alt=""
      />
    </Link>
    <Link href={`/app/profile/${coder.uid}`} className="coder-name">{coder.displayName}</Link>
    <div className="coder-meta">
      <span><Zap size={11} strokeWidth={3} aria-hidden="true" /> {Number(coder.totalXP ?? 0).toLocaleString()} XP</span>
      <span className="coder-lvl">LVL {Number(coder.level ?? 1)}</span>
      <span><Flame size={11} strokeWidth={3} aria-hidden="true" /> {Number(coder.streak ?? 0)}</span>
    </div>
    <FriendButton target={coder} />
  </div>
);

export default function CommunityPage() {
  const { profile } = useAuth();
  const { t, isRTL, language } = useLanguage();

  const [term, setTerm] = useState("");
  const [matches, setMatches] = useState<UserProfile[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [topCoders, setTopCoders] = useState<UserProfile[] | null>(null);
  const [crew, setCrew] = useState<UserProfile[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const locale = language === 'ar' ? 'ar-EG' : 'en-GB';

  // Load top coders + the user's friend crew once.
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const q = query(collection(db, "users"), orderBy("totalXP", "desc"), fbLimit(8));
        const snap = await getDocs(q);
        if (!alive) return;
        setTopCoders(snap.docs.map(d => ({ ...d.data(), uid: d.id } as UserProfile)));
      } catch (e) {
        console.error('[Community] top coders failed:', e);
        if (alive) setTopCoders([]);
      }
      if (profile) {
        try {
          const friends = await socialService.getFriends(profile.uid);
          if (alive) setCrew(friends.slice(0, 12));
        } catch (e) {
          console.error('[Community] crew failed:', e);
        }
      }
    })();
    return () => { alive = false; };
  }, [profile]);

  // Debounced prefix search (Firestore range query).
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const trimmed = term.trim();
    if (trimmed.length < 2) { setMatches(null); setSearching(false); return; }
    setSearching(true);
    debounceRef.current = setTimeout(async () => {
      try {
        setMatches(await socialService.searchUsers(trimmed, 8));
      } catch (e) {
        console.error('[Community] search failed:', e);
        setMatches([]);
      } finally {
        setSearching(false);
      }
    }, 350);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [term]);

  const shown = matches !== null ? matches : (topCoders ?? []);
  const listState =
    searching ? 'searching'
    : matches !== null ? (matches.length ? 'results' : 'empty')
    : 'top';

  return (
    <div className={`wrap ${isRTL ? 'rtl' : ''}`}>
      <div className="sys">
        <span>PIXEL CODE — {t('community.title').toUpperCase()}</span>
        <span>{today(locale)}</span>
      </div>

      {/* ── Find coders ─────────────────────────────────────────────── */}
      <div className="section-label" style={{ marginTop: 16 }}>▣ {t('community.findCoders').toUpperCase()}</div>

      <div className="panel">
        <div className="panel-head">
          <span>{t('community.title').toUpperCase()}</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <Users size={12} aria-hidden="true" /> {t('community.live').toUpperCase()}
          </span>
        </div>

        <div style={{ padding: 14 }}>
          <label className="search-row">
            <Search size={18} strokeWidth={3} aria-hidden="true" />
            <input
              type="text"
              value={term}
              onChange={e => setTerm(e.target.value)}
              placeholder={t('community.searchPlaceholder')}
              aria-label={t('community.searchPlaceholder')}
              autoComplete="off"
              spellCheck={false}
            />
            {term && (
              <button className="search-clear" onClick={() => setTerm('')} aria-label="Clear">✕</button>
            )}
          </label>

          <div className="coder-list-head">
            <span className="mono" style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', color: 'var(--muted)' }}>
              {listState === 'results' ? t('community.searchResults').toUpperCase()
               : listState === 'searching' ? '…'
               : t('community.topCoders').toUpperCase()}
            </span>
            {listState === 'top' && <span className="dot" aria-hidden="true" />}
          </div>

          {listState === 'empty' ? (
            <p className="mono" style={{ padding: '22px 10px', textAlign: 'center', color: 'var(--muted)', fontSize: 12 }}>
              {t('community.noMatches')}
            </p>
          ) : topCoders === null && matches === null ? (
            <p className="mono" style={{ padding: '22px 10px', textAlign: 'center', color: 'var(--muted)', fontSize: 12 }}>
              …
            </p>
          ) : (
            <div className="coder-grid" aria-live="polite">
              {shown.map(coder => <CoderCard key={coder.uid} coder={coder} />)}
            </div>
          )}
        </div>
      </div>

      {/* ── Your crew ───────────────────────────────────────────────── */}
      {crew.length > 0 && (
        <>
          <div className="section-label" style={{ marginTop: 16 }}>▣ {t('community.yourCrew').toUpperCase()}</div>
          <div className="crew-strip">
            {crew.map(friend => (
              <Link key={friend.uid} href={`/app/profile/${friend.uid}`} className="crew-chip">
                <img
                  src={friend.photoURL || pixelAvatarFor(friend.displayName)}
                  alt=""
                  className="crew-avatar"
                />
                <span className="crew-name">{friend.displayName}</span>
                <ChevronRight size={12} strokeWidth={3} aria-hidden="true" />
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
