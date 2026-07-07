'use client';

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { db } from "../../core/firebase/config";
import { doc, updateDoc } from "firebase/firestore";
import { useLanguage } from "../../core/context/LanguageContext";

const PRESET_AVATARS = [
  "https://api.dicebear.com/7.x/pixel-art/svg?seed=Felix",
  "https://api.dicebear.com/7.x/pixel-art/svg?seed=Aneka",
  "https://api.dicebear.com/7.x/pixel-art/svg?seed=Bubba",
  "https://api.dicebear.com/7.x/pixel-art/svg?seed=Cookie",
  "https://api.dicebear.com/7.x/pixel-art/svg?seed=George",
  "https://api.dicebear.com/7.x/pixel-art/svg?seed=Misty",
  "https://api.dicebear.com/7.x/pixel-art/svg?seed=Peanut",
  "https://api.dicebear.com/7.x/pixel-art/svg?seed=Spooky"
];

interface AvatarPickerProps {
  uid: string;
  onComplete: () => void;
}

export const AvatarPicker = ({ uid, onComplete }: AvatarPickerProps) => {
  const { t, isRTL } = useLanguage();
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!selected) return;
    setLoading(true);
    try {
      await updateDoc(doc(db, "users", uid), {
        photoURL: selected
      });
      onComplete();
    } catch (error) {
      console.error("Failed to update avatar:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-gray-100 dark:border-gray-800 ${isRTL ? 'text-right' : 'text-left'}`}>
      <div className="text-center space-y-4 mb-8">
        <div className="w-16 h-16 bg-brand-100 dark:bg-brand-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8 text-brand-600 dark:text-brand-400" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
          {t('profile.chooseAvatar')}
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
          {t('profile.avatarDesc')}
        </p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        {PRESET_AVATARS.map((url, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelected(url)}
            className={`relative rounded-2xl overflow-hidden aspect-square border-4 transition-all
              ${selected === url ? "border-brand-500 scale-105" : "border-transparent bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
          >
            <img src={url} alt={`Avatar ${i}`} className="w-full h-full object-cover" />
            {selected === url && (
              <div className="absolute inset-0 bg-brand-500/20 flex items-center justify-center">
                <div className="bg-brand-500 rounded-full p-1 shadow-lg">
                  <Check className="w-4 h-4 text-white" />
                </div>
              </div>
            )}
          </motion.button>
        ))}
      </div>

      <button
        onClick={handleSave}
        disabled={!selected || loading}
        className="btn-primary w-full py-4 rounded-2xl justify-center font-black text-sm uppercase tracking-widest disabled:opacity-50 transition-all shadow-lg shadow-brand-500/20"
      >
        {loading ? t('common.saving') : t('profile.startCoding')}
      </button>
      
      <button 
        onClick={onComplete}
        className="w-full mt-4 text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors uppercase tracking-widest"
      >
        {t('profile.skipForNow')}
      </button>
    </div>
  );
};
