'use client';

import { useRef, useState, type ChangeEvent } from "react";
import { Check, Upload, X } from "lucide-react";
import { db } from "../../core/firebase/config";
import { doc, updateDoc } from "firebase/firestore";
import { useLanguage } from "../../core/context/LanguageContext";
import { useAuth } from "../../core/context/AuthContext";

// 12 locally generated pixel-art avatars (see scripts/build-avatars.mjs)
const PRESET_AVATARS = Array.from(
  { length: 12 },
  (_, i) => `/avatars/avatar-${String(i + 1).padStart(2, '0')}.png`,
);

interface AvatarPickerProps {
  uid: string;
  onComplete: () => void;
}

export const AvatarPicker = ({ uid, onComplete }: AvatarPickerProps) => {
  const { t, isRTL } = useLanguage();
  const { refreshProfile } = useAuth();
  const [selected, setSelected] = useState<string | null>(null);
  const [source, setSource] = useState<'platform' | 'upload'>('platform');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    if (!selected) return;
    setLoading(true);
    setError(null);
    try {
      await updateDoc(doc(db, "users", uid), {
        photoURL: selected,
        photoSource: source,
      });
      await refreshProfile();
      onComplete();
    } catch (e) {
      console.error("Failed to update avatar:", e);
      setError("Couldn't save avatar — try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError('Image too big — max 5 MB.');
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const size = Math.min(img.width, img.height);
      const sx = Math.floor((img.width - size) / 2);
      const sy = Math.floor((img.height - size) / 2);
      const canvas = document.createElement('canvas');
      canvas.width = 96;
      canvas.height = 96;
      const ctx = canvas.getContext('2d');
      if (!ctx) { setError('Upload failed — try another image.'); URL.revokeObjectURL(url); return; }
      ctx.drawImage(img, sx, sy, size, size, 0, 0, 96, 96);
      URL.revokeObjectURL(url);
      setSelected(canvas.toDataURL('image/png'));
      setSource('upload');
      setError(null);
    };
    img.onerror = () => { URL.revokeObjectURL(url); setError('Could not read that image.'); };
    img.src = url;
  };

  const close = () => onComplete();

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="avatar-picker-title"
      className={`border-[4px] shadow-[8px_8px_0_rgba(0,0,0,0.55)] max-w-md w-full p-6 relative ${isRTL ? 'text-right' : 'text-left'}`}
      style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
    >
      <button
        onClick={close}
        aria-label="Close"
        className="absolute top-3 end-3 p-1.5 hover:opacity-60 transition-opacity"
        style={{ color: 'var(--fg)' }}
      >
        <X className="w-5 h-5" />
      </button>

      <div className="text-center mb-5">
        <h2
          id="avatar-picker-title"
          className="font-bold tracking-tight"
          style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 13, color: 'var(--fg)' }}
        >
          {t('profile.chooseAvatar').toUpperCase()}
        </h2>
        <p className="mt-3 text-xs font-bold" style={{ color: 'var(--muted)' }}>
          {t('profile.avatarDesc')}
        </p>
      </div>

      {/* Preview + pick grid */}
      <div className="grid grid-cols-6 gap-3 mb-4">
        {PRESET_AVATARS.map((url, i) => {
          const active = selected === url;
          return (
            <button
              key={i}
              onClick={() => { setSelected(url); setSource('platform'); setError(null); }}
              aria-pressed={active}
              aria-label={`Avatar ${i + 1}`}
              className="relative aspect-square overflow-hidden grid place-items-center transition-transform duration-100 active:scale-95"
              style={{
                background: '#1A1A1A',
                border: `3px solid ${active ? 'var(--phosphor)' : 'var(--border)'}`,
                boxShadow: active ? '3px 3px 0 var(--phosphor)' : '3px 3px 0 rgba(0,0,0,0.35)',
              }}
            >
              <img src={url} alt={`Avatar ${i + 1}`} className="w-full h-full object-cover" style={{ imageRendering: 'pixelated' }} />
              {active && (
                <div className="absolute top-0.5 end-0.5 rounded-full p-0.5" style={{ background: 'var(--phosphor)' }}>
                  <Check className="w-3 h-3" color="#161616" strokeWidth={4} />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Upload from device */}
      <input
        ref={fileRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={handleFile}
        aria-hidden="true"
      />
      <button
        onClick={() => fileRef.current?.click()}
        className="w-full flex items-center justify-center gap-2 py-2.5 text-[10px] font-black uppercase tracking-widest transition-colors"
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          background: source === 'upload' ? 'var(--phosphor)' : 'transparent',
          color: 'var(--fg)',
          border: '3px dashed var(--border)',
        }}
      >
        <Upload className="w-4 h-4" />
        {source === 'upload' ? 'Custom image ready — save it!' : 'Upload from device'}
      </button>
      {source === 'upload' && selected && (
        <div className="flex justify-center mt-3">
          <img
            src={selected}
            alt="Uploaded avatar preview"
            className="w-20 h-20 object-cover"
            style={{ border: '3px solid var(--phosphor)' }}
          />
        </div>
      )}

      {error && (
        <p className="mt-3 text-center text-xs font-bold" role="alert" style={{ color: '#E15555' }}>
          {error}
        </p>
      )}

      <button
        onClick={handleSave}
        disabled={!selected || loading}
        className="mt-4 w-full py-3.5 text-[10px] font-black uppercase tracking-widest disabled:opacity-40 transition-all active:translate-x-[2px] active:translate-y-[2px]"
        style={{
          fontFamily: "'Press Start 2P', monospace",
          background: 'var(--phosphor)',
          color: '#161616',
          border: '3px solid var(--border)',
          boxShadow: '4px 4px 0 var(--border)',
        }}
      >
        {loading ? '…' : t('profile.startCoding')}
      </button>

      <button
        onClick={close}
        className="w-full mt-3 py-2 text-[9px] font-black uppercase tracking-widest hover:opacity-70 transition-opacity"
        style={{ fontFamily: 'Space Mono, monospace', color: 'var(--muted)' }}
      >
        {t('profile.skipForNow')}
      </button>
    </div>
  );
};
