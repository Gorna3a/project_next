// ─── One-shot streak backfill ─────────────────────────────────────────────────
// Reconstructs each user's current streak from timestamped activity that
// exists in Firestore: courseProgress.startedAt / lastAccessed and
// completedChallenges.completedAt. NOTES / LIMITATIONS:
//   • Days are keyed by UTC date (same convention as the forward-going rule).
//   • Daily visits without XP-earning actions were never logged, so a user
//     who opened the site daily but never finished anything will show a
//     lower streak than their lived reality. Nothing to backfill from.
//   • The counted run ends at the most recent known active day; users whose
//     latest activity is older than yesterday reset to 1 on their next
//     award anyway (standard reset semantics, unchanged from before).
//   • XP is NEVER touched.
// Usage:
//   node scripts/backfill-streaks.mjs            # dry run — read-only, prints a report
//   node scripts/backfill-streaks.mjs --apply    # writes streak/lastStreakDate

import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

const __dirname = dirname(fileURLToPath(import.meta.url));
const apply = process.argv.includes('--apply');

// Load .env.local manually (no dotenv dependency needed)
const envPath = join(__dirname, '..', '.env.local');
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_B64;
if (!b64) {
  console.error('FIREBASE_SERVICE_ACCOUNT_B64 not found in .env.local');
  process.exit(1);
}
const sa = JSON.parse(Buffer.from(b64, 'base64').toString('utf8'));
const app = getApps().length ? getApps()[0] : initializeApp({ credential: cert(sa), projectId: sa.project_id });
const db = getFirestore(app);

const dayKey = (d) => d.toISOString().slice(0, 10);
const prevDay = (key) => { const d = new Date(`${key}T00:00:00Z`); d.setUTCDate(d.getUTCDate() - 1); return d.toISOString().slice(0, 10); };
const toDayKey = (v) => {
  if (!v) return null;
  if (v instanceof Timestamp) return dayKey(v.toDate());
  if (typeof v.toDate === 'function') return dayKey(v.toDate());
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : dayKey(d);
};

const usersSnap = await db.collection('users').get();
console.log(`Scanning ${usersSnap.size} user docs…`);

let scanned = 0, withActivity = 0, toUpdate = 0, unchanged = 0, alreadyLonger = 0;
const histogram = new Map();
const longest = [];

for (const userDoc of usersSnap.docs) {
  scanned++;
  const uid = userDoc.id;
  const data = userDoc.data() ?? {};
  const days = new Set();

  // Course progress days
  const cpSnap = await db.collection('users').doc(uid).collection('courseProgress').get();
  for (const cp of cpSnap.docs) {
    const c = cp.data() ?? {};
    for (const f of ['startedAt', 'lastAccessed']) {
      const k = toDayKey(c[f]);
      if (k) days.add(k);
    }
  }
  // Challenge completion days
  const ccSnap = await db.collection('users').doc(uid).collection('completedChallenges').get();
  for (const cDoc of ccSnap.docs) {
    const k = toDayKey(cDoc.data()?.completedAt);
    if (k) days.add(k);
  }
  // xpEvents (only exists after the new route ships — safe to try)
  try {
    const evSnap = await db.collection('xpEvents').where('uid', '==', uid).get();
    for (const ev of evSnap.docs) {
      const k = toDayKey(ev.data()?.awardedAt);
      if (k) days.add(k);
    }
  } catch { /* collection may not exist yet */ }

  const sorted = [...days].sort();
  if (sorted.length === 0) { histogram.set(0, (histogram.get(0) ?? 0) + 1); continue; }
  withActivity++;

  // Count the consecutive run ending at the most recent active day.
  let run = 1, endDay = sorted[sorted.length - 1], cur = endDay;
  for (let i = sorted.length - 2; i >= 0; i--) {
    if (sorted[i] === prevDay(cur)) { run++; cur = sorted[i]; } else break;
  }
  histogram.set(run, (histogram.get(run) ?? 0) + 1);
  longest.push({ uid, run, endDay, email: data.email ?? null, name: data.displayName ?? null });

  const current = Number(data.streak ?? 0);
  if (run > current) {
    toUpdate++;
    if (apply) {
      await db.collection('users').doc(uid).set(
        { streak: run, lastStreakDate: endDay },
        { merge: true },
      );
    }
  } else if (run === current && data.lastStreakDate) {
    unchanged++;
  } else {
    alreadyLonger++;
  }
}

console.log('\n── Backfill report ───────────────────────');
console.log(`users scanned:            ${scanned}`);
console.log(`users with activity days: ${withActivity}`);
console.log(`users to update:          ${toUpdate} (current streak < reconstructed run)`);
console.log(`already ≥ or equal:       ${alreadyLonger + unchanged}`);
console.log('reconstructed-run histogram (length → users):');
for (const [k, v] of [...histogram.entries()].sort((a, b) => a[0] - b[0])) {
  console.log(`   ${String(k).padStart(3)} → ${v}`);
}
console.log('\ntop 10 reconstructed runs:');
for (const l of longest.sort((a, b) => b.run - a.run).slice(0, 10)) {
  console.log(`   ${l.run}d @ ${l.endDay}  ${l.name ?? ''} <${l.email ?? ''}>  ${l.uid}`);
}
console.log(apply
  ? '\n✅ Applied — streaks written.'
  : '\nℹ️  DRY RUN — nothing written. Re-run with --apply to commit.');
