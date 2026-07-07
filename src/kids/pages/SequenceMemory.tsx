'use client';

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Trophy, RotateCcw, Play } from "lucide-react";

const COLORS = [
  { id: 0, name: "Indigo", bg: "#6366f1", active: "#818cf8" },
  { id: 1, name: "Rose",   bg: "#f43f5e", active: "#fb7185" },
  { id: 2, name: "Amber",  bg: "#f59e0b", active: "#fbbf24" },
  { id: 3, name: "Emerald",bg: "#10b981", active: "#34d399" },
];

export const SequenceMemory = () => {
  const [gameState, setGameState] = useState<"idle" | "showing" | "input" | "gameover">("idle");
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [activeTile, setActiveTile] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  // audioRef removed

  const startNextRound = useCallback((currentSeq: number[]) => {
    const nextTile = Math.floor(Math.random() * 4);
    const newSeq = [...currentSeq, nextTile];
    setSequence(newSeq);
    setUserSequence([]);
    setGameState("showing");
    playSequence(newSeq);
  }, []);

  const playSequence = async (seq: number[]) => {
    for (let i = 0; i < seq.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 600));
      setActiveTile(seq[i]);
      // Play sound if needed
      await new Promise(resolve => setTimeout(resolve, 400));
      setActiveTile(null);
    }
    setGameState("input");
  };

  const handleTileClick = (tileId: number) => {
    if (gameState !== "input") return;

    const nextUserSeq = [...userSequence, tileId];
    setUserSequence(nextUserSeq);
    setActiveTile(tileId);
    setTimeout(() => setActiveTile(null), 200);

    // Check if correct
    if (tileId !== sequence[userSequence.length]) {
      setGameState("gameover");
      return;
    }

    // Check if round complete
    if (nextUserSeq.length === sequence.length) {
      setScore(s => s + 1);
      setTimeout(() => startNextRound(sequence), 800);
    }
  };

  const startGame = () => {
    setScore(0);
    startNextRound([]);
  };

  return (
    <div className="max-w-md mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Brain className="w-8 h-8 text-purple-500" />
          <h2 className="text-2xl font-black text-gray-800 dark:text-white">Brain Memory</h2>
        </div>
        <div className="px-4 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-black">
          Level {score + 1}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-xl border-4 border-gray-100 dark:border-gray-800 relative min-h-[400px] flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {gameState === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center space-y-6"
            >
              <div className="w-20 h-20 bg-purple-50 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto text-4xl">🧠</div>
              <p className="text-gray-500 font-bold max-w-xs mx-auto">
                Watch the pattern carefully and repeat it back. The sequence gets longer every round!
              </p>
              <button
                onClick={startGame}
                className="px-10 py-3 rounded-full bg-purple-600 text-white font-black text-lg shadow-lg hover:bg-purple-700 transition-all flex items-center gap-2 mx-auto"
              >
                <Play className="w-5 h-5 fill-current" /> Start Training
              </button>
            </motion.div>
          )}

          {(gameState === "showing" || gameState === "input") && (
            <motion.div
              key="playing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              <p className="text-center text-sm font-black text-gray-400 uppercase tracking-widest">
                {gameState === "showing" ? "Watch Closely..." : "Your Turn!"}
              </p>
              
              <div className="grid grid-cols-2 gap-4 aspect-square max-w-[300px] mx-auto">
                {COLORS.map((color) => {
                  const isActive = activeTile === color.id;
                  return (
                    <motion.button
                      key={color.id}
                      onClick={() => handleTileClick(color.id)}
                      disabled={gameState !== "input"}
                      className={`relative rounded-3xl shadow-lg transition-all border-4 ${gameState === "input" ? "hover:scale-105 active:scale-95 cursor-pointer" : "cursor-default"}`}
                      style={{
                        backgroundColor: isActive ? color.active : color.bg,
                        borderColor: isActive ? "white" : "transparent",
                        boxShadow: isActive ? `0 0 30px ${color.active}` : "none",
                      }}
                      animate={isActive ? { scale: 1.05 } : { scale: 1 }}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="pulse"
                          className="absolute inset-0 rounded-3xl bg-white/30"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: [0, 1, 0] }}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>
              
              <div className="flex justify-center gap-2">
                {sequence.map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      i < userSequence.length ? "bg-purple-500 scale-125" : "bg-gray-200 dark:bg-gray-800"
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {gameState === "gameover" && (
            <motion.div
              key="gameover"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6"
            >
              <Trophy className="w-16 h-16 text-amber-500 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-3xl font-black text-gray-800 dark:text-white">Nice Try!</h3>
                <p className="text-gray-500 font-bold">You reached Level {score + 1}</p>
              </div>
              <button
                onClick={startGame}
                className="px-10 py-3 rounded-full bg-purple-600 text-white font-black text-lg shadow-lg hover:bg-purple-700 transition-all flex items-center gap-2 mx-auto"
              >
                <RotateCcw className="w-5 h-5" /> Try Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="bg-purple-50 dark:bg-purple-900/10 p-4 rounded-2xl border-2 border-purple-100 dark:border-purple-900/30 text-center">
        <p className="text-xs text-purple-700 dark:text-purple-400 font-bold">
          Training your memory helps with coding because you can hold more logic steps in your head! 🧑‍💻
        </p>
      </div>
    </div>
  );
};
