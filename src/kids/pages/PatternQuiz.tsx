'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp } from 'lucide-react';

// Each level gets harder patterns
interface PatternDef {
  generate: () => { sequence: string[]; answer: string; options: string[]; rule: string };
}

const EMOJI_SETS = {
  colors:   ['🔴','🔵','🟡','🟢','🟠','🟣','⚫','⚪'],
  animals:  ['🐶','🐱','🐭','🐰','🦊','🐻','🐼','🐨','🐯','🦁'],
  shapes:   ['🔺','🔶','🔷','🔸','🔹','🔻','⭐','💠','🔘'],
  nature:   ['🌸','🌻','🌙','⭐','☀️','🌈','🌊','❄️','🍁'],
  numbers:  ['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣'],
};
const rand = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
const pick4 = (arr: string[], must: string) => {
  const pool = arr.filter(x => x !== must);
  const opts = [must];
  while (opts.length < 4) {
    const r = rand(pool);
    if (!opts.includes(r)) opts.push(r);
  }
  return opts.sort(() => Math.random() - 0.5);
};

// Level definitions — each returns a fresh random pattern
const LEVELS: PatternDef[] = [
  // Level 1: Simple AB repeat (e.g. 🔴🔵🔴🔵🔴 → 🔵)
  {
    generate() {
      const set = EMOJI_SETS.colors;
      const [a, b] = [rand(set), rand(set.filter(x => x !== rand(set)))];
      const seq = [a,b,a,b,a];
      return { sequence: seq, answer: b, options: pick4(set, b), rule: 'AB pattern: the two colours alternate!' };
    },
  },
  // Level 2: ABC repeat
  {
    generate() {
      const set = EMOJI_SETS.animals;
      const pool = [...set].sort(() => Math.random()-0.5).slice(0,3);
      const [a,b,c] = pool;
      const seq = [a,b,c,a,b];
      return { sequence: seq, answer: c, options: pick4(set, c), rule: 'ABC pattern: three items keep repeating!' };
    },
  },
  // Level 3: Growing sequence (add one each time)
  {
    generate() {
      const set = EMOJI_SETS.shapes;
      const [a,b] = [rand(set), rand(set)];
      // 1×a, 2×b, 3×a
      const seq = [a, b, b, a, a, a, b];
      const answer = b;
      return { sequence: seq, answer, options: pick4(set, answer), rule: 'The count grows by 1 each step!' };
    },
  },
  // Level 4: Two interleaved patterns
  {
    generate() {
      const setA = EMOJI_SETS.nature;
      const setB = EMOJI_SETS.shapes;
      const a1 = rand(setA), a2 = rand(setA.filter(x=>x!==a1));
      const b  = rand(setB);
      // a1, b, a2, b, a1, b → answer = a2
      const seq = [a1, b, a2, b, a1];
      const answer = b;
      const all = [...setA, ...setB];
      return { sequence: seq, answer, options: pick4(all, answer), rule: 'Two separate patterns are mixed together!' };
    },
  },
  // Level 5: Fibonacci-style length growth
  {
    generate() {
      const [a,b] = [rand(EMOJI_SETS.colors), rand(EMOJI_SETS.nature)];
      // a×1, b×2, a×3, b→ answer is b
      const seq = [a, b, b, a, a, a];
      const answer = b;
      const all = [...EMOJI_SETS.colors, ...EMOJI_SETS.nature];
      return { sequence: seq, answer, options: pick4(all, answer), rule: 'Each group is 1 longer than the last (1,2,3,4…)!' };
    },
  },
  // Level 6: Reverse then repeat
  {
    generate() {
      const set = EMOJI_SETS.animals;
      const [a,b,c] = [...set].sort(()=>Math.random()-.5).slice(0,3);
      // a,b,c,c,b → answer = a
      const seq = [a,b,c,c,b];
      const answer = a;
      return { sequence: seq, answer, options: pick4(set, answer), rule: 'It goes forward then reverses — like a palindrome!' };
    },
  },
];

const LEVEL_NAMES = ['Starter 🌱','Easy ⭐','Medium 🔥','Hard 💪','Expert 🧠','Master 🏆'];

export const PatternQuizAdvanced = () => {
  const [level,    setLevel]    = useState(0);
  const [score,    setScore]    = useState(0);
  const [streak,   setStreak]   = useState(0);
  const [correct,  setCorrect]  = useState(0);
  const [total,    setTotal]    = useState(0);
  const [pattern,  setPattern]  = useState(() => LEVELS[0].generate());
  const [selected, setSelected] = useState<string | null>(null);
  const [showRule, setShowRule]  = useState(false);
  const [levelUp,  setLevelUp]  = useState(false);

  const nextQuestion = useCallback((lvl: number) => {
    setPattern(LEVELS[Math.min(lvl, LEVELS.length-1)].generate());
    setSelected(null);
    setShowRule(false);
  }, []);

  const handleAnswer = (opt: string) => {
    if (selected) return;
    setSelected(opt);
    const isRight = opt === pattern.answer;
    setTotal(t => t+1);
    if (isRight) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      setCorrect(c => c+1);
      const xp = 10 + level * 5;
      setScore(s => s + xp);
      setShowRule(true);
      // Level up every 3 correct in a row
      if (newStreak > 0 && newStreak % 3 === 0 && level < LEVELS.length - 1) {
        setLevelUp(true);
        setTimeout(() => {
          setLevelUp(false);
          const nl = level + 1;
          setLevel(nl);
          nextQuestion(nl);
        }, 2000);
      } else {
        setTimeout(() => nextQuestion(level), 1800);
      }
    } else {
      setStreak(0);
      setTimeout(() => nextQuestion(level), 1500);
    }
  };

  return (
    <div className="space-y-5 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex gap-2">
          <span className="font-black px-3 py-1 rounded-full text-sm"
            style={{ backgroundColor: '#fef3c7', color: '#92400e' }}>🏆 {score} pts</span>
          <span className="font-black px-3 py-1 rounded-full text-sm"
            style={{ backgroundColor: '#ecfdf5', color: '#059669' }}>🔥 {streak}</span>
        </div>
        <span className="font-black px-3 py-1 rounded-full text-sm"
          style={{ backgroundColor: '#eef2ff', color: '#4f46e5' }}>
          Level {level+1}: {LEVEL_NAMES[level]}
        </span>
        <span className="text-xs font-black text-gray-400">{correct}/{total} correct</span>
      </div>

      {/* Level progress bar */}
      <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: '#e5e7eb' }}>
        <motion.div className="h-full rounded-full"
          style={{ backgroundColor: '#6366f1' }}
          animate={{ width: `${((streak % 3) / 3) * 100}%` }}
          transition={{ duration: 0.4 }} />
      </div>
      <p className="text-xs text-center font-semibold text-gray-400">
        {3 - (streak % 3)} more correct in a row to level up!
      </p>

      {/* Level up banner */}
      <AnimatePresence>
        {levelUp && (
          <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0 }}
            className="text-center p-4 rounded-2xl border-4 font-black"
            style={{ backgroundColor: '#f0fdf4', borderColor: '#22c55e', color: '#166534' }}>
            <ChevronUp className="w-8 h-8 mx-auto mb-1" />
            <div className="text-xl">Level Up! → {LEVEL_NAMES[Math.min(level+1, LEVELS.length-1)]}</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pattern display */}
      <AnimatePresence mode="wait">
        <motion.div key={pattern.sequence.join('')}
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
          className="p-6 rounded-2xl border-4 text-center"
          style={{ backgroundColor: '#f5f3ff', borderColor: '#a78bfa' }}>
          <p className="font-black text-gray-700 mb-4 text-sm">What comes next? 🤔</p>
          <div className="flex justify-center items-center gap-2 flex-wrap mb-2">
            {pattern.sequence.map((s, i) => (
              <motion.span key={i} initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ delay: i * 0.08 }} className="text-3xl">{s}</motion.span>
            ))}
            <span className="text-3xl font-black w-10 h-10 rounded-xl border-4 border-dashed flex items-center justify-center"
              style={{ borderColor: '#7c3aed', color: '#7c3aed' }}>?</span>
          </div>
          <AnimatePresence>
            {showRule && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-xs font-bold mt-3 px-3 py-1 rounded-lg"
                style={{ backgroundColor: '#ede9fe', color: '#6d28d9' }}>
                💡 {pattern.rule}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      {/* Options */}
      <div className="grid grid-cols-4 gap-3">
        {pattern.options.map(opt => {
          const isCorrect  = opt === pattern.answer;
          const isSelected = opt === selected;
          const answered   = selected !== null;
          return (
            <motion.button key={opt}
              whileHover={!answered ? { scale: 1.1 } : {}}
              whileTap={!answered ? { scale: 0.9 } : {}}
              onClick={() => handleAnswer(opt)}
              className="p-3 rounded-xl text-2xl border-4 font-black transition-all"
              style={{
                backgroundColor: answered ? (isCorrect ? '#dcfce7' : isSelected ? '#fee2e2' : '#f9fafb') : 'white',
                borderColor: answered ? (isCorrect ? '#22c55e' : isSelected ? '#ef4444' : '#e5e7eb') : '#e5e7eb',
                cursor: answered ? 'default' : 'pointer',
                opacity: answered && !isCorrect && !isSelected ? 0.4 : 1,
              }}>
              {opt}
            </motion.button>
          );
        })}
      </div>

      {/* Feedback */}
      <AnimatePresence>
        {selected && (
          <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="text-center font-black text-lg"
            style={{ color: selected === pattern.answer ? '#059669' : '#dc2626' }}>
            {selected === pattern.answer
              ? `🎉 Correct! +${10 + level * 5} pts`
              : `❌ The answer was ${pattern.answer}`}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};
