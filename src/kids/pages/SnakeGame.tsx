'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';

const COLS = 20;
const ROWS = 15;
const CELL = 24;
type Dir = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Pos = { x: number; y: number };

const rand = () => ({ x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) });

export const SnakeGame = () => {
  const [snake, setSnake]   = useState<Pos[]>([{ x: 10, y: 7 }]);
  const [food,  setFood]    = useState<Pos>(rand());
  const [,   setDir]     = useState<Dir>('RIGHT');
  const [score, setScore]   = useState(0);
  const [dead,  setDead]    = useState(false);
  const [started, setStarted] = useState(false);
  const dirRef = useRef<Dir>('RIGHT');

  const reset = useCallback(() => {
    setSnake([{ x: 10, y: 7 }]);
    setFood(rand());
    setDir('RIGHT');
    dirRef.current = 'RIGHT';
    setScore(0);
    setDead(false);
    setStarted(false);
  }, []);

  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      const map: Record<string, Dir> = {
        ArrowUp: 'UP', ArrowDown: 'DOWN', ArrowLeft: 'LEFT', ArrowRight: 'RIGHT',
        w: 'UP', s: 'DOWN', a: 'LEFT', d: 'RIGHT',
      };
      const d = map[e.key];
      if (!d) return;
      e.preventDefault();
      const opp: Record<Dir, Dir> = { UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT' };
      if (d !== opp[dirRef.current]) { dirRef.current = d; setDir(d); setStarted(true); }
    };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, []);

  useEffect(() => {
    if (!started || dead) return;
    const interval = setInterval(() => {
      setSnake(prev => {
        const head = prev[0];
        const delta: Record<Dir, Pos> = { UP:{x:0,y:-1}, DOWN:{x:0,y:1}, LEFT:{x:-1,y:0}, RIGHT:{x:1,y:0} };
        const d = delta[dirRef.current];
        const next = { x: head.x + d.x, y: head.y + d.y };
        if (next.x < 0 || next.x >= COLS || next.y < 0 || next.y >= ROWS) { setDead(true); return prev; }
        if (prev.some(s => s.x === next.x && s.y === next.y)) { setDead(true); return prev; }
        const ate = next.x === food.x && next.y === food.y;
        if (ate) { setScore(s => s + 10); setFood(rand()); }
        return ate ? [next, ...prev] : [next, ...prev.slice(0, -1)];
      });
    }, 140);
    return () => clearInterval(interval);
  }, [started, dead, food]);

  const move = (d: Dir) => {
    const opp: Record<Dir, Dir> = { UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT' };
    if (d !== opp[dirRef.current]) { dirRef.current = d; setDir(d); setStarted(true); }
  };

  return (
    <div className="space-y-3 flex flex-col items-center">
      <div className="flex items-center justify-between w-full max-w-lg">
        <span className="font-black px-3 py-1 rounded-full text-sm" style={{ backgroundColor: '#ecfdf5', color: '#059669' }}>
          🍎 Score: {score}
        </span>
        <button onClick={reset} className="flex items-center gap-1 px-3 py-1.5 rounded-full font-black text-sm"
          style={{ backgroundColor: '#f5f3ff', color: '#7c3aed' }}>
          <RotateCcw className="w-4 h-4" /> Reset
        </button>
      </div>

      <div className="relative rounded-2xl overflow-hidden border-4 border-green-400 bg-green-50"
        style={{ width: COLS * CELL, height: ROWS * CELL }}>
        {/* Food */}
        <div className="absolute text-xl flex items-center justify-center"
          style={{ left: food.x * CELL, top: food.y * CELL, width: CELL, height: CELL }}>🍎</div>
        {/* Snake */}
        {snake.map((s, i) => (
          <div key={i} className="absolute rounded-sm transition-all"
            style={{
              left: s.x * CELL + 2, top: s.y * CELL + 2,
              width: CELL - 4, height: CELL - 4,
              backgroundColor: i === 0 ? '#15803d' : '#22c55e',
            }} />
        ))}
        {!started && !dead && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-2xl">
            <p className="font-black text-lg text-green-700">Press arrow keys or buttons below to start! 🐍</p>
          </div>
        )}
        {dead && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 rounded-2xl space-y-2">
            <div className="text-5xl">💀</div>
            <p className="font-black text-2xl" style={{ color: '#dc2626' }}>Game Over!</p>
            <p className="font-black" style={{ color: '#6b7280' }}>Score: {score}</p>
            <button onClick={reset} className="px-6 py-2 rounded-full text-white font-black"
              style={{ backgroundColor: '#22c55e' }}>Play Again!</button>
          </motion.div>
        )}
      </div>

      {/* Mobile / touch controls */}
      <div className="grid grid-cols-3 gap-2 w-36">
        <div />
        <button onClick={() => move('UP')} className="p-2 rounded-xl font-black text-lg bg-green-100 text-green-700">↑</button>
        <div />
        <button onClick={() => move('LEFT')} className="p-2 rounded-xl font-black text-lg bg-green-100 text-green-700">←</button>
        <button onClick={() => move('DOWN')} className="p-2 rounded-xl font-black text-lg bg-green-100 text-green-700">↓</button>
        <button onClick={() => move('RIGHT')} className="p-2 rounded-xl font-black text-lg bg-green-100 text-green-700">→</button>
      </div>
    </div>
  );
};
