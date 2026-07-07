'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Lightbulb } from 'lucide-react';

interface WordEntry {
  word: string;
  hint: string;
  emoji: string;
  category: string;
}

const WORD_BANK: WordEntry[] = [
  // Animals
  { word: 'ELEPHANT', hint: 'The biggest land animal with a trunk', emoji: '🐘', category: 'Animals' },
  { word: 'DOLPHIN',  hint: 'A smart ocean mammal that loves to jump', emoji: '🐬', category: 'Animals' },
  { word: 'PENGUIN',  hint: 'A bird that cannot fly but loves swimming', emoji: '🐧', category: 'Animals' },
  { word: 'GIRAFFE',  hint: 'Has the longest neck of any animal', emoji: '🦒', category: 'Animals' },
  { word: 'BUTTERFLY',hint: 'Starts as a caterpillar, then transforms', emoji: '🦋', category: 'Animals' },
  // Science
  { word: 'VOLCANO',  hint: 'A mountain that can shoot out hot lava', emoji: '🌋', category: 'Science' },
  { word: 'GRAVITY',  hint: 'The force that pulls things to the ground', emoji: '🍎', category: 'Science' },
  { word: 'OXYGEN',   hint: 'The gas in air that humans breathe', emoji: '💨', category: 'Science' },
  { word: 'GALAXY',   hint: 'A huge group of billions of stars in space', emoji: '🌌', category: 'Science' },
  { word: 'CRYSTAL',  hint: 'A natural mineral with a geometric shape', emoji: '💎', category: 'Science' },
  // Tech
  { word: 'KEYBOARD', hint: 'You use this to type on a computer', emoji: '⌨️', category: 'Tech' },
  { word: 'MONITOR',  hint: 'The screen you look at on a computer', emoji: '🖥️', category: 'Tech' },
  { word: 'BROWSER',  hint: 'App used to visit websites', emoji: '🌐', category: 'Tech' },
  { word: 'PROGRAM',  hint: 'Instructions that tell a computer what to do', emoji: '💻', category: 'Tech' },
  { word: 'NETWORK',  hint: 'Connected computers sharing information', emoji: '📡', category: 'Tech' },
  // Space
  { word: 'ASTEROID', hint: 'A rocky object that floats around in space', emoji: '☄️', category: 'Space' },
  { word: 'SATURN',   hint: 'The planet famous for its beautiful rings', emoji: '🪐', category: 'Space' },
  { word: 'ECLIPSE',  hint: 'When the moon blocks the sun from Earth', emoji: '🌑', category: 'Space' },
  // Food
  { word: 'BROCCOLI', hint: 'A green vegetable that looks like a tiny tree', emoji: '🥦', category: 'Food' },
  { word: 'AVOCADO',  hint: 'A green creamy fruit great on toast', emoji: '🥑', category: 'Food' },
];

const shuffle = (str: string): string => {
  const arr = str.split('');
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  // Ensure shuffled != original
  return arr.join('') === str ? shuffle(str) : arr.join('');
};

export const WordScramble = () => {
  const [usedWords,  setUsedWords]  = useState<Set<string>>(new Set());
  const [entry,      setEntry]      = useState<WordEntry>(WORD_BANK[0]);
  const [scrambled,  setScrambled]  = useState<string[]>([]);
  const [selected,   setSelected]   = useState<number[]>([]);  // indices into scrambled
  // guess removed
  const [result,     setResult]     = useState<'correct' | 'wrong' | null>(null);
  const [score,      setScore]      = useState(0);
  const [showHint,   setShowHint]   = useState(false);
  const [shake,      setShake]      = useState(false);

  const nextWord = useCallback((used: Set<string>) => {
    const remaining = WORD_BANK.filter(w => !used.has(w.word));
    if (!remaining.length) { setUsedWords(new Set()); nextWord(new Set()); return; }
    const next = remaining[Math.floor(Math.random() * remaining.length)];
    setEntry(next);
    setScrambled(shuffle(next.word).split(''));
    setSelected([]);
    // setGuess removed
    setResult(null);
    setShowHint(false);
  }, []);

  useEffect(() => { nextWord(new Set()); }, [nextWord]);

  const handleLetterClick = (idx: number) => {
    if (result || selected.includes(idx)) return;
    const newSelected = [...selected, idx];
    const newGuess = newSelected.map(i => scrambled[i]).join('');
    setSelected(newSelected);
    // setGuess removed

    if (newGuess.length === entry.word.length) {
      if (newGuess === entry.word) {
        setResult('correct');
        const pts = showHint ? 5 : 10;
        setScore(s => s + pts);
        const newUsed = new Set(usedWords).add(entry.word);
        setUsedWords(newUsed);
        setTimeout(() => nextWord(newUsed), 1600);
      } else {
        setResult('wrong');
        setShake(true);
        setTimeout(() => { setSelected([]); /* setGuess removed */ setResult(null); setShake(false); }, 900);
      }
    }
  };

  const handleRemoveLast = () => {
    if (!selected.length || result) return;
    const newSel = selected.slice(0, -1);
    setSelected(newSel);
    // setGuess removed
  };

  const handleSkip = () => nextWord(usedWords);

  const letterColors = [
    '#4f46e5','#db2777','#16a34a','#d97706','#0891b2','#7c3aed','#dc2626','#059669',
  ];

  return (
    <div className="space-y-6 flex flex-col items-center max-w-lg mx-auto">
      {/* Score + category */}
      <div className="flex items-center justify-between w-full">
        <span className="font-black px-3 py-1.5 rounded-full text-sm"
          style={{ backgroundColor: '#fef3c7', color: '#92400e' }}>🏆 {score} pts</span>
        <span className="font-black px-3 py-1.5 rounded-full text-sm"
          style={{ backgroundColor: '#eef2ff', color: '#4f46e5' }}>📂 {entry.category}</span>
        <button onClick={handleSkip}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full font-black text-sm"
          style={{ backgroundColor: '#f5f3ff', color: '#7c3aed' }}>
          <RotateCcw className="w-3.5 h-3.5" /> Skip
        </button>
      </div>

      {/* Emoji + hint */}
      <div className="text-center space-y-2">
        <div className="text-7xl">{entry.emoji}</div>
        <AnimatePresence>
          {showHint && (
            <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="text-sm font-bold px-4 py-2 rounded-xl"
              style={{ backgroundColor: '#fffbeb', color: '#92400e' }}>
              💡 {entry.hint}
            </motion.p>
          )}
        </AnimatePresence>
        {!showHint && (
          <button onClick={() => setShowHint(true)}
            className="flex items-center gap-1 text-xs font-black mx-auto px-3 py-1 rounded-full"
            style={{ backgroundColor: '#fffbeb', color: '#d97706' }}>
            <Lightbulb className="w-3.5 h-3.5" /> Show hint (−5 pts)
          </button>
        )}
      </div>

      {/* Answer slots */}
      <motion.div
        animate={shake ? { x: [-8,8,-8,8,0] } : {}}
        transition={{ duration: 0.4 }}
        className="flex gap-2 flex-wrap justify-center"
      >
        {Array.from({ length: entry.word.length }).map((_, i) => {
          const letter = selected[i] !== undefined ? scrambled[selected[i]] : '';
          return (
            <div key={i}
              className="w-10 h-12 rounded-xl border-4 flex items-center justify-center font-black text-xl transition-all"
              style={{
                borderColor: result === 'correct' ? '#22c55e' : result === 'wrong' ? '#ef4444' : letter ? '#6366f1' : '#d1d5db',
                backgroundColor: result === 'correct' ? '#dcfce7' : result === 'wrong' ? '#fee2e2' : letter ? '#eef2ff' : '#f9fafb',
                color: result === 'correct' ? '#166534' : result === 'wrong' ? '#991b1b' : '#4f46e5',
              }}>
              {letter}
            </div>
          );
        })}
      </motion.div>

      {/* Result message */}
      <AnimatePresence mode="wait">
        {result === 'correct' && (
          <motion.div key="correct" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ opacity: 0 }}
            className="font-black text-2xl text-center" style={{ color: '#059669' }}>
            🎉 Correct! +{showHint ? 5 : 10} pts
          </motion.div>
        )}
        {result === 'wrong' && (
          <motion.div key="wrong" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ opacity: 0 }}
            className="font-black text-xl text-center" style={{ color: '#dc2626' }}>
            ❌ Try again!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scrambled letters */}
      <div className="flex gap-3 flex-wrap justify-center">
        {scrambled.map((letter, idx) => {
          const isUsed = selected.includes(idx);
          const color = letterColors[idx % letterColors.length];
          return (
            <motion.button key={idx}
              whileHover={!isUsed && !result ? { scale: 1.15, y: -4 } : {}}
              whileTap={!isUsed && !result ? { scale: 0.9 } : {}}
              onClick={() => handleLetterClick(idx)}
              className="w-12 h-14 rounded-2xl font-black text-xl border-4 shadow-md transition-all"
              style={{
                backgroundColor: isUsed ? '#e5e7eb' : color + '22',
                borderColor: isUsed ? '#d1d5db' : color,
                color: isUsed ? '#9ca3af' : color,
                cursor: isUsed || !!result ? 'default' : 'pointer',
                textDecoration: isUsed ? 'line-through' : 'none',
              }}>
              {letter}
            </motion.button>
          );
        })}
      </div>

      {/* Undo button */}
      {selected.length > 0 && !result && (
        <button onClick={handleRemoveLast}
          className="font-black text-sm px-4 py-2 rounded-full"
          style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>
          ← Undo last letter
        </button>
      )}

      <p className="text-xs text-gray-400 font-semibold text-center">
        Click letters in the right order to spell the word! 🔤
      </p>
    </div>
  );
};
