'use client';

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Timer, Zap, Trophy, Flame, Play, RotateCcw } from "lucide-react";

interface Problem {
  id: number;
  q: string;
  a: number;
  options: number[];
}

const generateProblem = (score: number): Problem => {
  const level = Math.floor(score / 50) + 1;
  const max = Math.min(10 + level * 5, 50);
  
  let a, b, op, ans;
  const roll = Math.random();
  
  if (roll < 0.4 || level === 1) {
    a = Math.floor(Math.random() * max) + 1;
    b = Math.floor(Math.random() * max) + 1;
    op = "+";
    ans = a + b;
  } else if (roll < 0.7) {
    a = Math.floor(Math.random() * max) + 1;
    b = Math.floor(Math.random() * a) + 1;
    op = "-";
    ans = a - b;
  } else {
    a = Math.floor(Math.random() * 12) + 1;
    b = Math.floor(Math.random() * 10) + 1;
    op = "×";
    ans = a * b;
  }

  const options = new Set<number>([ans]);
  while (options.size < 4) {
    const offset = Math.floor(Math.random() * 5) + 1;
    options.add(ans + (Math.random() > 0.5 ? offset : -offset));
  }

  return {
    id: Date.now(),
    q: `${a} ${op} ${b}`,
    a: ans,
    options: Array.from(options).sort(() => Math.random() - 0.5),
  };
};

export const MathArena = () => {
  const [gameState, setGameState] = useState<"idle" | "playing" | "results">("idle");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [problem, setProblem] = useState<Problem | null>(null);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const timerRef = useRef<number | null>(null);

  const startGame = useCallback(() => {
    setScore(0);
    setTimeLeft(60);
    setStreak(0);
    setBestStreak(0);
    setProblem(generateProblem(0));
    setGameState("playing");
  }, []);

  const handleAnswer = (ans: number) => {
    if (gameState !== "playing" || !problem) return;

    if (ans === problem.a) {
      const bonus = Math.floor(streak / 5) * 2;
      const points = 10 + bonus;
      setScore(s => s + points);
      setStreak(st => {
        const next = st + 1;
        if (next > bestStreak) setBestStreak(next);
        return next;
      });
      setProblem(generateProblem(score + points));
    } else {
      setStreak(0);
      setProblem(generateProblem(score));
    }
  };

  useEffect(() => {
    if (gameState === "playing" && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            setGameState("results");
            if (timerRef.current) window.clearInterval(timerRef.current);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [gameState, timeLeft]);

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-md border-2 border-gray-100 dark:border-gray-800 flex flex-col items-center">
          <Timer className="w-5 h-5 text-blue-500 mb-1" />
          <span className={`text-xl font-black ${timeLeft <= 10 ? "text-red-500 animate-pulse" : "text-gray-700 dark:text-gray-300"}`}>
            {timeLeft}s
          </span>
          <span className="text-[10px] font-black text-gray-400 uppercase">Time</span>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-md border-2 border-gray-100 dark:border-gray-800 flex flex-col items-center">
          <Zap className="w-5 h-5 text-amber-500 mb-1" />
          <span className="text-xl font-black text-gray-700 dark:text-gray-300">{score}</span>
          <span className="text-[10px] font-black text-gray-400 uppercase">Score</span>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-md border-2 border-gray-100 dark:border-gray-800 flex flex-col items-center">
          <Flame className="w-5 h-5 text-orange-500 mb-1" />
          <span className="text-xl font-black text-gray-700 dark:text-gray-300">{streak}</span>
          <span className="text-[10px] font-black text-gray-400 uppercase">Streak</span>
        </div>
      </div>

      <div className="relative min-h-[400px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {gameState === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center space-y-8"
            >
              <div className="space-y-4">
                <div className="w-24 h-24 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto">
                  <Trophy className="w-12 h-12 text-indigo-600" />
                </div>
                <h2 className="text-3xl font-black text-gray-800 dark:text-white">Math Arena</h2>
                <p className="text-gray-500 font-bold max-w-xs mx-auto">
                  Solve as many problems as you can in 60 seconds. Keep the streak alive for bonus points!
                </p>
              </div>
              <button
                onClick={startGame}
                className="px-12 py-4 rounded-full bg-indigo-600 text-white font-black text-xl shadow-xl hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 mx-auto"
              >
                <Play className="w-6 h-6 fill-current" /> Start Blitz
              </button>
            </motion.div>
          )}

          {gameState === "playing" && problem && (
            <motion.div
              key="playing"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full space-y-12"
            >
              <div className="text-center">
                <motion.div
                  key={problem.q}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-7xl md:text-8xl font-black text-gray-800 dark:text-white tracking-tighter"
                >
                  {problem.q} = ?
                </motion.div>
              </div>

              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                {problem.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleAnswer(opt)}
                    className="py-6 rounded-3xl bg-white dark:bg-gray-900 border-4 border-gray-100 dark:border-gray-800 text-3xl font-black text-gray-800 dark:text-white shadow-lg hover:border-indigo-500 hover:scale-105 active:scale-95 transition-all"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {gameState === "results" && (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full bg-white dark:bg-gray-900 rounded-3xl p-10 border-4 border-indigo-100 dark:border-indigo-900/30 shadow-2xl text-center space-y-8"
            >
              <div className="space-y-2">
                <div className="text-6xl mb-4">🎖️</div>
                <h2 className="text-3xl font-black text-gray-800 dark:text-white">Arena Blitz Finished!</h2>
                <div className="flex justify-center gap-8 py-4">
                  <div>
                    <p className="text-4xl font-black text-indigo-600">{score}</p>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Total Score</p>
                  </div>
                  <div className="w-px bg-gray-100 dark:bg-gray-800 h-10" />
                  <div>
                    <p className="text-4xl font-black text-orange-500">{bestStreak}</p>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Best Streak</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-3">
                <button
                  onClick={startGame}
                  className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-black text-lg shadow-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-5 h-5" /> Try Again
                </button>
                <button
                  onClick={() => setGameState("idle")}
                  className="w-full py-4 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-black"
                >
                  Exit Arena
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-2xl border-2 border-amber-100 dark:border-amber-900/30">
        <p className="text-xs text-amber-700 dark:text-amber-400 font-bold flex items-center gap-2">
          <Zap className="w-4 h-4" /> <strong>Pro Tip:</strong> Every 5 streak gives you bonus points! Speed is key, but don't rush into mistakes!
        </p>
      </div>
    </div>
  );
};
