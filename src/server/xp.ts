// ─── XP / streak math shared by the award API route and the backfill script ──

export const XP_PER_LEVEL = 1000;

export const levelForXp = (xp: number): number =>
  Math.floor(Math.max(0, xp) / XP_PER_LEVEL) + 1;

/** UTC day key, e.g. "2026-11-04" (matches the route's server clock). */
export const utcDayKey = (d: Date = new Date()): string =>
  d.toISOString().slice(0, 10);

export const prevDayKey = (key: string): string => {
  const d = new Date(`${key}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
};

export const isValidDayKey = (raw: unknown): raw is string =>
  typeof raw === 'string' && /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(raw);

/**
 * Trust the client's local calendar day only when it is plausibly "today"
 * for *some* timezone on Earth: not more than 1 day ahead of UTC, and not
 * absurdly far in the past. Returns null to fall back to UTC.
 */
export const sanitizeClientDate = (raw: unknown): string | null => {
  if (!isValidDayKey(raw)) return null;
  const utcToday = utcDayKey();
  const t = Date.parse(`${raw}T00:00:00Z`);
  const now = Date.parse(`${utcToday}T00:00:00Z`);
  const diffDays = Math.round((t - now) / 86400000);
  return diffDays <= 1 ? raw : null; // future dates are rejected, past is fine
};

/**
 * Forward-going streak rule: any XP-earning day counts as an activity day.
 * Same day → unchanged; yesterday → +1; anything older or never → reset to 1.
 */
export const nextStreak = (
  current: number,
  lastKey: string | null,
  todayKey: string,
): number => {
  if (lastKey === todayKey) return current;
  if (lastKey === prevDayKey(todayKey)) return current + 1;
  return 1;
};

export const clampInt = (
  value: unknown,
  min: number,
  max: number,
  fallback: number,
): number => {
  const n = Math.floor(Number(value));
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
};
