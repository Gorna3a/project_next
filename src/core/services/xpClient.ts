// ─── Client → /api/xp/award ───────────────────────────────────────────────────
// The browser can no longer write XP fields directly (see firestore.rules);
// it authenticates with its Firebase ID token and *requests* an award, and
// the server validates + commits it. On success a `pixelcode:xp` event is
// broadcast so AuthContext re-fetches the profile and the UI (XP chip,
// dashboard, profile page) updates without a hard refresh.

import { auth } from '../firebase/config';

/** Broadcast so AuthContext re-fetches the profile (XP chip / dashboard update). */
export const XP_UPDATED_EVENT = 'pixelcode:xp';

export interface XpAwardResponse {
  awarded: number;
  totalXP: number;
  level: number;
  streak: number;
  reason: string | null;
}

/** Local calendar day as YYYY-MM-DD (server validates and may fall back to UTC). */
const localDateKey = (): string => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export const requestXpAward = async (
  action: string,
  payload: Record<string, unknown> = {},
): Promise<XpAwardResponse | null> => {
  const user = auth.currentUser;
  if (!user) return null;
  try {
    const idToken = await user.getIdToken();
    const res = await fetch('/api/xp/award', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${idToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action, ...payload, clientDate: localDateKey() }),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      console.error(`[xp] award request failed (${res.status})`, detail);
      return null;
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event(XP_UPDATED_EVENT));
    }
    return (await res.json()) as XpAwardResponse;
  } catch (e) {
    console.error('[xp] award request errored:', e);
    return null;
  }
};
