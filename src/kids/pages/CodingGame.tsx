'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Rocket, Brain, Code, ArrowRight } from "lucide-react";

interface Level {
  id: number;
  type: "output" | "bug" | "order";
  title: string;
  problem: string;
  code?: string;
  options?: string[];
  answer: string | number;
  explanation: string;
  visual?: string;
}

const LEVELS: Level[] = [
  {
    id: 1,
    type: "output",
    title: "The Hello Machine",
    problem: "What will this code print on the screen?",
    code: `message = "Hello"\nname = "Pixel"\nprint(message + " " + name)`,
    options: ["HelloPixel", "Hello Pixel", "Pixel Hello", "Error"],
    answer: "Hello Pixel",
    explanation: "We joined 'Hello', a space, and 'Pixel' together!",
  },
  {
    id: 2,
    type: "bug",
    title: "Fix the Math",
    problem: "Which line has a mistake? We want to add 5 and 10.",
    code: `1: x = 5\n2: y = 10\n3: total = x - y\n4: print(total)`,
    options: ["Line 1", "Line 2", "Line 3", "Line 4"],
    answer: "Line 3",
    explanation: "Line 3 uses minus (-) instead of plus (+).",
  },
  {
    id: 3,
    type: "order",
    title: "Robot's Morning",
    problem: "Put the steps in the right order for the robot to make toast.",
    options: ["Eat toast", "Put bread in toaster", "Spread jam", "Wait for pop"],
    answer: "Put bread in toaster,Wait for pop,Spread jam,Eat toast",
    explanation: "First the bread goes in, then we wait, then jam, then yum!",
  },
  {
    id: 4,
    type: "output",
    title: "Counting Loop",
    problem: "How many times will 'Jump!' be printed?",
    code: `for i in range(3):\n    print("Jump!")`,
    options: ["1", "2", "3", "4"],
    answer: "3",
    explanation: "The loop runs for 0, 1, and 2 — that's 3 times!",
  },
  {
    id: 5,
    type: "bug",
    title: "The Missing Quote",
    problem: "Something is wrong with this secret message. Where is the bug?",
    code: `secret = "I love coding\nprint(secret)`,
    options: ["Missing a quote at the end of line 1", "Print should be capital", "Missing a space", "Variable name is too long"],
    answer: "Missing a quote at the end of line 1",
    explanation: "Every starting quote (\") needs an ending quote (\")!",
  },
];

export const CodingGame = () => {
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [order, setOrder] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);

  const level = LEVELS[currentLevelIdx];

  const handleOptionClick = (opt: string) => {
    if (isCorrect !== null) return;
    setSelected(opt);
    const correct = opt === level.answer;
    setIsCorrect(correct);
    if (correct) setScore(s => s + 20);
  };

  const handleOrderClick = (opt: string) => {
    if (isCorrect !== null || order.includes(opt)) return;
    const newOrder = [...order, opt];
    setOrder(newOrder);
    
    if (newOrder.length === level.options?.length) {
      const correct = newOrder.join(",") === level.answer;
      setIsCorrect(correct);
      if (correct) setScore(s => s + 20);
    }
  };

  const resetOrder = () => {
    if (isCorrect !== null) return;
    setOrder([]);
  };

  const nextLevel = () => {
    if (currentLevelIdx < LEVELS.length - 1) {
      setCurrentLevelIdx(currentLevelIdx + 1);
      setSelected(null);
      setOrder([]);
      setIsCorrect(null);
    }
  };

  const restart = () => {
    setCurrentLevelIdx(0);
    setSelected(null);
    setOrder([]);
    setIsCorrect(null);
    setScore(0);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
            <Code className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-800 dark:text-white">Coding Logic</h2>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Level {level.id} of {LEVELS.length}</p>
          </div>
        </div>
        <div className="px-4 py-2 rounded-2xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 font-black text-lg">
          🏆 {score} XP
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-xl border-4 border-gray-100 dark:border-gray-800 space-y-6">
        <div className="space-y-2">
          <h3 className="text-2xl font-black text-gray-800 dark:text-white flex items-center gap-2">
            {level.type === "order" ? <Brain className="w-6 h-6 text-purple-500" /> : <Rocket className="w-6 h-6 text-blue-500" />}
            {level.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 font-bold">{level.problem}</p>
        </div>

        {level.code && (
          <div className="bg-gray-50 dark:bg-black rounded-2xl p-6 font-mono text-sm border-2 border-gray-100 dark:border-gray-800 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
            <pre className="text-gray-800 dark:text-gray-200 leading-relaxed">
              {level.code}
            </pre>
          </div>
        )}

        {/* Answer Selection */}
        <div className="grid gap-3">
          {level.type !== "order" ? (
            level.options?.map((opt) => {
              const isSelected = selected === opt;
              const isAnswer = opt === level.answer;
              let style = "border-gray-100 dark:border-gray-800 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/10";
              
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
                  className={`p-4 rounded-2xl border-2 font-black text-left transition-all ${style} flex items-center justify-between`}
                >
                  {opt}
                  {isCorrect !== null && isAnswer && <CheckCircle2 className="w-5 h-5" />}
                  {isCorrect !== null && isSelected && !isAnswer && <XCircle className="w-5 h-5" />}
                </button>
              );
            })
          ) : (
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2 justify-center">
                {level.options?.map((opt) => (
                  <button
                    key={opt}
                    disabled={isCorrect !== null || order.includes(opt)}
                    onClick={() => handleOrderClick(opt)}
                    className={`px-4 py-2 rounded-xl border-2 font-bold transition-all
                      ${order.includes(opt) 
                        ? "bg-gray-100 dark:bg-gray-800 text-gray-400 border-transparent scale-90" 
                        : "bg-white dark:bg-gray-900 border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 hover:scale-105 active:scale-95"}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              
              <div className="space-y-2">
                <p className="text-center text-xs font-black text-gray-400 uppercase tracking-widest">Your Steps</p>
                <div className="flex flex-col gap-2">
                  {order.map((opt, i) => (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      key={i}
                      className={`p-3 rounded-xl border-2 font-black flex items-center gap-3
                        ${isCorrect === true ? "bg-green-50 border-green-500 text-green-700" : 
                          isCorrect === false ? "bg-red-50 border-red-500 text-red-700" : 
                          "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300"}`}
                    >
                      <span className="w-6 h-6 rounded-full bg-white dark:bg-black/20 flex items-center justify-center text-xs">{i + 1}</span>
                      {opt}
                    </motion.div>
                  ))}
                  {order.length === 0 && (
                    <div className="h-12 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-300 dark:text-gray-700 font-bold italic">
                      Click steps above in order...
                    </div>
                  )}
                </div>
                {order.length > 0 && isCorrect === null && (
                  <button 
                    onClick={resetOrder}
                    className="w-full text-center text-xs font-bold text-gray-400 hover:text-red-500 transition-colors"
                  >
                    Clear Order
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Level Feedback */}
        <AnimatePresence>
          {isCorrect !== null && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className={`p-6 rounded-2xl border-2 ${isCorrect ? "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800/50" : "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800/50"}`}
            >
              <h4 className={`font-black mb-2 flex items-center gap-2 ${isCorrect ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}`}>
                {isCorrect ? "🌟 Great Thinking!" : "💡 Nice Try!"}
              </h4>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-6">{level.explanation}</p>
              
              <div className="flex justify-center">
                {isCorrect ? (
                  currentLevelIdx < LEVELS.length - 1 ? (
                    <button
                      onClick={nextLevel}
                      className="px-8 py-3 rounded-2xl bg-green-600 text-white font-black shadow-lg hover:bg-green-700 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                    >
                      Next Level <ArrowRight className="w-5 h-5" />
                    </button>
                  ) : (
                    <div className="text-center">
                      <p className="text-2xl font-black text-amber-500 mb-4">🎉 Quest Complete!</p>
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
                    onClick={() => { setSelected(null); setOrder([]); setIsCorrect(null); }}
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

      <p className="text-center text-xs font-bold text-gray-400">
        Improve your logic and step-by-step thinking to become a master coder! 🧙‍♂️
      </p>
    </div>
  );
};
