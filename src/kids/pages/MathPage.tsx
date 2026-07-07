'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Clock, Trophy, Flame } from 'lucide-react';

type Op = '+' | '-' | '×' | '÷';

interface Problem {
  display: string;
  visual: string;
  answer: number;
  options: number[];
  op: Op;
}

const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateProblem = (level: number): Problem => {
  // Difficulty scaling by level
  const maxNum = level <= 2 ? 10 : level <= 4 ? 25 : level <= 6 ? 50 : 100;
  const ops: Op[] = level <= 1 ? ['+'] : level <= 2 ? ['+', '-'] : level <= 4 ? ['+', '-', '×'] : ['+', '-', '×', '÷'];
  const op = ops[Math.floor(Math.random() * ops.length)];

  let a: number, b: number, answer: number;

  switch (op) {
    case '+': a = rand(1, maxNum); b = rand(1, maxNum); answer = a + b; break;
    case '-': a = rand(Math.ceil(maxNum/2), maxNum); b = rand(1, a); answer = a - b; break;
    case '×': a = rand(1, Math.min(12, level * 2 + 1)); b = rand(1, Math.min(12, level + 2)); answer = a * b; break;
    case '÷': {
      b = rand(2, Math.min(10, level)); answer = rand(2, Math.min(10, level)); a = b * answer; break;
    }
  }

  // Wrong options close to the real answer
  const wrong = new Set<number>();
  while (wrong.size < 3) {
    const offset = rand(1, Math.max(3, Math.floor(answer * 0.3)));
    const candidate = answer + (Math.random() < 0.5 ? offset : -offset);
    if (candidate !== answer && candidate >= 0) wrong.add(candidate);
  }
  const options = [...Array.from(wrong), answer].sort(() => Math.random() - 0.5);

  // Emoji visual for small numbers
  const visual = (op === '+' || op === '-') && a <= 10 && b <= 10
    ? `${'⭐'.repeat(a)} ${op === '+' ? '➕' : '➖'} ${'⭐'.repeat(b)}`
    : '';

  return { display: `${a} ${op} ${b} = ?`, visual, answer, options, op };
};

const OP_COLORS: Record<Op, { bg: string; border: string; color: string }> = {
  '+': { bg: '#ecfdf5', border: '#6ee7b7', color: '#059669' },
  '-': { bg: '#fef2f2', border: '#fca5a5', color: '#dc2626' },
  '×': { bg: '#f5f3ff', border: '#a78bfa', color: '#7c3aed' },
  '÷': { bg: '#fffbeb', border: '#fbbf24', color: '#d97706' },
};

const ENCOURAGEMENTS = ['🎉 Amazing!','⭐ Superstar!','🚀 Brilliant!','🏆 Champion!','💪 Perfect!','🎯 Great job!','🔥 On fire!','💎 Genius!'];
const WRONG_MSGS     = ['😅 Almost!','💪 Keep going!','🤔 Try again!','💡 You can do it!'];

const LEVEL_NAMES = ['Beginner 🌱','Easy ⭐','Getting Harder 🔥','Intermediate 💪','Advanced 🧠','Expert 🏆','Master 👑'];

export default function MathPage() {
  const [level,   setLevel]   = useState(1);
  const [problem, setProblem] = useState(() => generateProblem(1));
  const [selected,setSelected]= useState<number | null>(null);
  const [score,   setScore]   = useState(0);
  const [streak,  setStreak]  = useState(0);
  const [total,   setTotal]   = useState(0);
  const [correct, setCorrect] = useState(0);
  const [message, setMessage] = useState('');
  const [timeLeft,setTimeLeft]= useState(20);
  const [timerOn, setTimerOn] = useState(false);
  const [shake,   setShake]   = useState(false);
  const [levelUp, setLevelUp] = useState(false);

  const next = useCallback((lvl: number) => {
    setProblem(generateProblem(lvl));
    setSelected(null);
    setMessage('');
    setTimeLeft(Math.max(8, 20 - lvl * 2));
  }, []);

  // Timer
  useEffect(() => {
    if (!timerOn || selected !== null) return;
    if (timeLeft <= 0) {
      // Time's up — count as wrong
      setStreak(0);
      setTotal(t => t+1);
      setMessage("⏰ Time's up!");
      setTimeout(() => next(level), 1200);
      return;
    }
    const id = setTimeout(() => setTimeLeft(t => t-1), 1000);
    return () => clearTimeout(id);
  }, [timeLeft, timerOn, selected, level, next]);

  const handleAnswer = (opt: number) => {
    if (selected !== null) return;
    setSelected(opt);
    setTotal(t => t+1);
    if (opt === problem.answer) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      setCorrect(c => c+1);
      const bonus = timerOn ? Math.ceil(timeLeft / 2) : 0;
      setScore(s => s + 10 + bonus);
      setMessage(ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)]);
      // Level up every 5 correct
      if (newStreak > 0 && newStreak % 5 === 0 && level < 6) {
        setLevelUp(true);
        const nl = level + 1;
        setTimeout(() => { setLevelUp(false); setLevel(nl); next(nl); }, 2000);
      } else {
        setTimeout(() => next(level), 1400);
      }
    } else {
      setStreak(0);
      setShake(true);
      setMessage(WRONG_MSGS[Math.floor(Math.random() * WRONG_MSGS.length)]);
      setTimeout(() => { next(level); setShake(false); }, 1400);
    }
  };

  const modeStyle = OP_COLORS[problem.op];

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-1">
        <h1 className="text-4xl font-black" style={{ color: '#059669' }}>🔢 Math Adventure!</h1>
        <p className="text-sm font-bold text-gray-500">Answer correctly to level up! 🚀</p>
      </motion.div>

      {/* Stats bar */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { icon: Trophy, label: 'Score',    value: score,                            color: '#d97706', bg: '#fffbeb' },
          { icon: Flame,  label: 'Streak',   value: streak,                           color: '#dc2626', bg: '#fef2f2' },
          { icon: Zap,    label: 'Level',    value: level,                            color: '#7c3aed', bg: '#f5f3ff' },
          { icon: Clock,  label: 'Accuracy', value: total > 0 ? `${Math.round((correct/total)*100)}%` : '—', color: '#0891b2', bg: '#ecfeff' },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <div key={label} className="text-center py-2 px-1 rounded-2xl font-black" style={{ backgroundColor: bg }}>
            <Icon className="w-4 h-4 mx-auto mb-0.5" style={{ color }} />
            <div className="text-lg" style={{ color }}>{value}</div>
            <div className="text-xs text-gray-400">{label}</div>
          </div>
        ))}
      </div>

      {/* Level name + timer toggle */}
      <div className="flex items-center justify-between">
        <span className="font-black text-sm px-3 py-1 rounded-full"
          style={{ backgroundColor: '#eef2ff', color: '#4f46e5' }}>
          {LEVEL_NAMES[level - 1]}
        </span>
        <button onClick={() => { setTimerOn(t => !t); setTimeLeft(20); }}
          className={`font-black text-sm px-3 py-1 rounded-full transition-all`}
          style={{
            backgroundColor: timerOn ? '#fef2f2' : '#f3f4f6',
            color: timerOn ? '#dc2626' : '#6b7280',
          }}>
          ⏱ Timer: {timerOn ? 'ON' : 'OFF'}
        </button>
      </div>

      {/* Streak progress to next level */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs font-semibold text-gray-400">
          <span>Progress to level {Math.min(level+1,7)}</span>
          <span>{streak % 5}/5 correct</span>
        </div>
        <div className="h-2.5 rounded-full" style={{ backgroundColor: '#e5e7eb' }}>
          <motion.div className="h-full rounded-full" style={{ backgroundColor: '#6366f1' }}
            animate={{ width: `${((streak % 5) / 5) * 100}%` }}
            transition={{ duration: 0.4 }} />
        </div>
      </div>

      {/* Level-up banner */}
      <AnimatePresence>
        {levelUp && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
            className="text-center p-4 rounded-2xl border-4 font-black"
            style={{ backgroundColor: '#f0fdf4', borderColor: '#22c55e', color: '#166534' }}>
            🎉 LEVEL UP! → {LEVEL_NAMES[Math.min(level, 6)]}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Timer bar */}
      {timerOn && selected === null && (
        <div className="space-y-1">
          <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: '#e5e7eb' }}>
            <motion.div className="h-full rounded-full transition-all"
              style={{
                width: `${(timeLeft / (Math.max(8, 20 - level * 2))) * 100}%`,
                backgroundColor: timeLeft > 8 ? '#22c55e' : timeLeft > 4 ? '#f59e0b' : '#ef4444',
              }} />
          </div>
          <p className="text-center text-sm font-black" style={{ color: timeLeft <= 4 ? '#dc2626' : '#6b7280' }}>
            ⏱ {timeLeft}s
          </p>
        </div>
      )}

      {/* Problem card */}
      <motion.div
        key={problem.display}
        animate={shake ? { x: [-10,10,-10,10,0] } : {}}
        transition={{ duration: 0.4 }}
        initial={{ scale: 0.95, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        className="rounded-3xl p-6 text-center border-4 shadow-xl space-y-4"
        style={{ backgroundColor: modeStyle.bg, borderColor: modeStyle.border }}>

        {/* Visual helper for small numbers */}
        {problem.visual && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-2xl text-center break-all leading-loose">
            {problem.visual}
          </motion.p>
        )}

        <p className="font-black" style={{ fontSize: problem.visual ? '3rem' : '4rem', color: modeStyle.color }}>
          {problem.display}
        </p>

        <div className="grid grid-cols-2 gap-3">
          {problem.options.map((opt, i) => {
            const isCorrect  = opt === problem.answer;
            const isSelected = opt === selected;
            const answered   = selected !== null;
            return (
              <motion.button key={i}
                whileHover={!answered ? { scale: 1.05, y: -2 } : {}}
                whileTap={!answered ? { scale: 0.95 } : {}}
                onClick={() => handleAnswer(opt)}
                className="py-4 rounded-2xl font-black text-2xl border-4 shadow transition-all"
                style={{
                  backgroundColor: answered ? (isCorrect ? '#dcfce7' : isSelected ? '#fee2e2' : 'white') : 'white',
                  borderColor:     answered ? (isCorrect ? '#22c55e' : isSelected ? '#ef4444' : '#e5e7eb') : '#e5e7eb',
                  color:           answered ? (isCorrect ? '#166534' : isSelected ? '#991b1b' : '#9ca3af') : '#1f2937',
                  cursor: answered ? 'default' : 'pointer',
                }}>
                {answered && isCorrect && '✓ '}{opt}
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Feedback */}
      <AnimatePresence>
        {message && (
          <motion.div initial={{ opacity: 0, scale: 0.8, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center text-3xl font-black"
            style={{ color: selected === problem.answer ? '#059669' : '#dc2626' }}>
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
