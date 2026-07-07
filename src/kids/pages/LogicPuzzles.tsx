'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, CheckCircle2, XCircle, Brain, ArrowRight } from "lucide-react";

interface Puzzle {
  id: number;
  type: "sequence" | "grid" | "shapes";
  question: string;
  items: string[];
  options: string[];
  answer: string;
  hint: string;
  explanation: string;
}

const PUZZLES: Puzzle[] = [
  {
    id: 1,
    type: "sequence",
    question: "What number comes next in this pattern?",
    items: ["2", "4", "6", "8", "?"],
    options: ["9", "10", "12", "14"],
    answer: "10",
    hint: "We are skipping one number each time (adding 2)!",
    explanation: "8 + 2 = 10. This is an arithmetic sequence!",
  },
  {
    id: 2,
    type: "sequence",
    question: "Can you spot the doubling pattern?",
    items: ["1", "2", "4", "8", "16", "?"],
    options: ["20", "24", "30", "32"],
    answer: "32",
    hint: "Each number is twice as big as the one before it!",
    explanation: "16 x 2 = 32. This is called a geometric sequence!",
  },
  {
    id: 3,
    type: "shapes",
    question: "Which shape completes the set?",
    items: ["🔴", "🟦", "🔴", "🟦", "🔴", "?"],
    options: ["🔴", "🟦", "🟡", "🟢"],
    answer: "🟦",
    hint: "The colors are alternating back and forth!",
    explanation: "It follows an A-B-A-B pattern.",
  },
  {
    id: 4,
    type: "sequence",
    question: "This one is tricky! It's the Fibonacci sequence...",
    items: ["1", "1", "2", "3", "5", "8", "?"],
    options: ["10", "11", "12", "13"],
    answer: "13",
    hint: "Try adding the last two numbers together to get the next one!",
    explanation: "5 + 8 = 13. This is one of nature's favorite patterns!",
  },
  {
    id: 5,
    type: "sequence",
    question: "Going backwards now!",
    items: ["20", "17", "14", "11", "?"],
    options: ["10", "9", "8", "7"],
    answer: "8",
    hint: "We are taking away 3 each time!",
    explanation: "11 - 3 = 8. Subtracting works for patterns too!",
  },
];

export const LogicPuzzles = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);
  // solvedCount removed

  const puzzle = PUZZLES[currentIdx];

  const handleOptionClick = (opt: string) => {
    if (isCorrect !== null) return;
    setSelected(opt);
    const correct = opt === puzzle.answer;
    setIsCorrect(correct);
    if (correct) {
      // setSolvedCount removed
    }
  };

  const nextPuzzle = () => {
    if (currentIdx < PUZZLES.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelected(null);
      setIsCorrect(null);
      setShowHint(false);
    }
  };

  const restart = () => {
    setCurrentIdx(0);
    setSelected(null);
    setIsCorrect(null);
    setShowHint(false);
    // setSolvedCount removed
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
            <Brain className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black text-gray-800 dark:text-white">Logic Puzzles</h2>
        </div>
        <div className="px-4 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 font-black">
          {currentIdx + 1} / {PUZZLES.length}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-xl border-4 border-gray-100 dark:border-gray-800 space-y-8">
        <div className="text-center space-y-4">
          <h3 className="text-2xl font-black text-gray-800 dark:text-white">{puzzle.question}</h3>
          
          <div className="flex justify-center items-center gap-3 py-6">
            {puzzle.items.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black shadow-sm
                  ${item === "?" ? "bg-indigo-600 text-white animate-pulse" : "bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-100 dark:border-gray-700"}`}
              >
                {item}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {puzzle.options.map((opt) => {
            const isSelected = selected === opt;
            const isAnswer = opt === puzzle.answer;
            let style = "border-gray-100 dark:border-gray-800 hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/10";
            
            if (isCorrect !== null) {
              if (isAnswer) style = "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 ring-2 ring-green-500";
              else if (isSelected) style = "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 opacity-60";
              else style = "border-gray-100 dark:border-gray-800 opacity-40";
            }

            return (
              <button
                key={opt}
                disabled={isCorrect !== null}
                onClick={() => handleOptionClick(opt)}
                className={`py-4 rounded-2xl border-2 font-black transition-all ${style} flex items-center justify-center text-xl shadow-sm`}
              >
                {opt}
              </button>
            );
          })}
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => setShowHint(!showHint)}
            className="flex items-center gap-2 text-sm font-bold text-amber-600 dark:text-amber-400 hover:underline"
          >
            <Lightbulb className="w-4 h-4" /> {showHint ? "Hide Hint" : "Need a Hint?"}
          </button>
        </div>

        <AnimatePresence>
          {showHint && !isCorrect && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-2xl text-amber-700 dark:text-amber-400 text-sm font-bold text-center border-2 border-amber-100 dark:border-amber-900/30"
            >
              💡 {puzzle.hint}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isCorrect !== null && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-6 rounded-2xl border-2 text-center ${isCorrect ? "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800/50" : "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800/50"}`}
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                {isCorrect ? (
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-600" />
                )}
                <h4 className={`text-xl font-black ${isCorrect ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}`}>
                  {isCorrect ? "Brilliant!" : "Not Quite!"}
                </h4>
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-6">{puzzle.explanation}</p>
              
              <div className="flex justify-center">
                {isCorrect ? (
                  currentIdx < PUZZLES.length - 1 ? (
                    <button
                      onClick={nextPuzzle}
                      className="px-8 py-3 rounded-2xl bg-indigo-600 text-white font-black shadow-lg hover:bg-indigo-700 transition-all flex items-center gap-2"
                    >
                      Next Puzzle <ArrowRight className="w-5 h-5" />
                    </button>
                  ) : (
                    <div className="text-center">
                      <p className="text-2xl font-black text-amber-500 mb-4">🏆 Logic Master!</p>
                      <button
                        onClick={restart}
                        className="px-8 py-3 rounded-2xl bg-indigo-600 text-white font-black shadow-lg hover:bg-indigo-700 transition-all"
                      >
                        Play Again
                      </button>
                    </div>
                  )
                ) : (
                  <button
                    onClick={() => { setSelected(null); setIsCorrect(null); }}
                    className="px-8 py-3 rounded-2xl bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-black hover:bg-gray-300 dark:hover:bg-gray-700 transition-all"
                  >
                    Try Again
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
