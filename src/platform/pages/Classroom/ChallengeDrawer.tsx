'use client';

// ─── ChallengeDrawer ──────────────────────────────────────────────────────────
// Opens a classroom's linked challenge in a shadcn Drawer (vaul) instead of
// navigating to /app/training/[id]. The embedded ChallengeView records the
// completion server-side (which auto-syncs the linked assignment); `onSolved`
// then lets the assignments panel refresh in place.

import dynamic from 'next/dynamic';
import { useLanguage } from '../../../core/context/LanguageContext';
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerHeaderClose,
  DrawerTitle,
} from '@/components/ui/drawer';
import type { Assignment } from './classroomTypes';

const ChallengeView = dynamic(() => import('../Arena/ChallengeView'), {
  ssr: false,
  loading: () => (
    <div className="h-64 grid place-items-center font-mono text-xs font-black uppercase tracking-widest text-black/50">
      …
    </div>
  ),
});

export const ChallengeDrawer = ({
  assignment,
  open,
  onOpenChange,
  onSolved,
}: {
  /** The challenge-type assignment whose linked challenge to show. */
  assignment: Assignment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Fired after the server records the solve (assignment auto-sync included). */
  onSolved: (info: { recorded: boolean; revealed: boolean }) => void;
}) => {
  const { t, isRTL } = useLanguage();
  // Sheet slides in from the inline-end edge (RTL-aware)
  const direction = isRTL ? 'left' : 'right';

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction={direction} shouldScaleBackground={false}>
      <DrawerContent>
        <DrawerHeader dir={isRTL ? 'rtl' : 'ltr'}>
          <div className={`flex items-center gap-3 min-w-0 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span className="w-2 h-6 bg-[#FFD23F] border border-white shrink-0" aria-hidden />
            <div className="min-w-0">
              <DrawerTitle>{t('classroom.challengeDrawerTitle')}</DrawerTitle>
              <DrawerDescription className="truncate normal-case tracking-normal text-white/70">
                {assignment?.title ?? ''}
              </DrawerDescription>
            </div>
          </div>
          <DrawerHeaderClose onClick={() => onOpenChange(false)} aria-label="Close" />
        </DrawerHeader>
        <DrawerBody className={isRTL ? 'text-right' : 'text-left'}>
          {assignment?.challengeId && (
            // key forces a fresh attempt state when switching assignments
            <ChallengeView
              key={assignment.id}
              challengeId={assignment.challengeId}
              embedded
              onSolved={onSolved}
              onRequestClose={() => onOpenChange(false)}
            />
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};
