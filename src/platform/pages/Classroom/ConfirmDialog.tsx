'use client';

// ─── ConfirmDialog ────────────────────────────────────────────────────────────
// Shared destructive-action confirmation built on the shadcn Dialog (Radix),
// styled to PixelCode's neobrutalist classroom theme (hard border, offset
// shadow, mono uppercase labels). Replaces the native window.confirm().

import { Loader2, Trash2 } from 'lucide-react';
import { useLanguage } from '../../../core/context/LanguageContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export const ConfirmDialog = ({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  destructive = true,
  busy = false,
  icon,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  /** Label of the confirm button (e.g. "Delete"). */
  confirmLabel: string;
  destructive?: boolean;
  busy?: boolean;
  /** Optional leading icon for the confirm button. */
  icon?: React.ReactNode;
  onConfirm: () => void | Promise<void>;
}) => {
  const { t, isRTL } = useLanguage();

  const confirmClasses = destructive
    ? 'bg-[#FF6B6B] text-black hover:bg-black hover:text-white'
    : 'bg-black text-white hover:bg-[#FFD23F] hover:text-black';

  return (
    <Dialog open={open} onOpenChange={o => { if (!busy) onOpenChange(o); }}>
      <DialogContent className={isRTL ? 'text-right' : 'text-left'}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <DialogFooter className={isRTL ? 'flex-row-reverse sm:justify-end' : ''}>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={busy}
            className="bg-white text-black border-[3px] border-black shadow-[3px_3px_0_0_#000] font-mono text-xs font-black uppercase tracking-widest px-4 py-2.5 hover:bg-black hover:text-white transition-all disabled:opacity-50"
          >
            {t('common.cancel')}
          </button>
          <button
            type="button"
            onClick={() => { void onConfirm(); }}
            disabled={busy}
            className={`inline-flex items-center justify-center gap-2 border-[3px] border-black shadow-[3px_3px_0_0_#000] font-mono text-xs font-black uppercase tracking-widest px-4 py-2.5 transition-all disabled:opacity-50 ${confirmClasses}`}
          >
            {busy
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : icon !== undefined
                ? icon
                : destructive
                  ? <Trash2 className="w-4 h-4" />
                  : null}
            {confirmLabel}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
