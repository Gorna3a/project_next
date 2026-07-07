'use client';

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, CheckCircle2, HelpCircle } from "lucide-react";

const COLORS = [
  { name: "Red",    hex: "#ef4444" },
  { name: "Blue",   hex: "#3b82f6" },
  { name: "Green",  hex: "#22c55e" },
  { name: "Yellow", hex: "#eab308" },
  { name: "Purple", hex: "#a855f7" },
  { name: "Orange", hex: "#f97316" },
];

const CODE_LENGTH = 4;
const MAX_ATTEMPTS = 10;

interface Guess {
  colors: string[];
  exact: number;
  partial: number;
}

export const MastermindGame = () => {
  const [secret, setSecret] = useState<string[]>([]);
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string[]>([]);
  const [gameState, setGameState] = useState<"playing" | "won" | "lost">("playing");

  const generateSecret = useCallback(() => {
    const newSecret = [];
    for (let i = 0; i < CODE_LENGTH; i++) {
      newSecret.push(COLORS[Math.floor(Math.random() * COLORS.length)].hex);
    }
    setSecret(newSecret);
  }, []);

  const reset = useCallback(() => {
    generateSecret();
    setGuesses([]);
    setCurrentGuess([]);
    setGameState("playing");
  }, [generateSecret]);

  useEffect(() => {
    reset();
  }, [reset]);

  const handleColorClick = (colorHex: string) => {
    if (gameState !== "playing" || currentGuess.length >= CODE_LENGTH) return;
    setCurrentGuess([...currentGuess, colorHex]);
  };

  const removeLastColor = () => {
    if (gameState !== "playing" || currentGuess.length === 0) return;
    setCurrentGuess(currentGuess.slice(0, -1));
  };

  const submitGuess = () => {
    if (gameState !== "playing" || currentGuess.length !== CODE_LENGTH) return;

    let exact = 0;
    let partial = 0;
    const secretCopy = [...secret];
    const guessCopy = [...currentGuess];

    // Check exact matches
    for (let i = 0; i < CODE_LENGTH; i++) {
      if (guessCopy[i] === secretCopy[i]) {
        exact++;
        secretCopy[i] = "";
        guessCopy[i] = "match";
      }
    }

    // Check partial matches
    for (let i = 0; i < CODE_LENGTH; i++) {
      if (guessCopy[i] !== "match") {
        const index = secretCopy.indexOf(guessCopy[i]);
        if (index !== -1 && secretCopy[index] !== "") {
          partial++;
          secretCopy[index] = "";
        }
      }
    }

    const newGuess: Guess = {
      colors: currentGuess,
      exact,
      partial,
    };

    const newGuesses = [newGuess, ...guesses];
    setGuesses(newGuesses);
    setCurrentGuess([]);

    if (exact === CODE_LENGTH) {
      setGameState("won");
    } else if (newGuesses.length >= MAX_ATTEMPTS) {
      setGameState("lost");
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-gray-800 dark:text-white">🕵️ Mastermind</h2>
        <button
          onClick={reset}
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-xl border-4 border-gray-100 dark:border-gray-800 space-y-8">
        {/* Secret Code (hidden unless game over) */}
        <div className="flex justify-center gap-3">
          {Array.from({ length: CODE_LENGTH }).map((_, i) => (
            <div
              key={i}
              className="w-10 h-10 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center transition-all duration-500"
              style={{
                backgroundColor: gameState !== "playing" ? secret[i] : "transparent",
              }}
            >
              {gameState === "playing" && <HelpCircle className="w-5 h-5 text-gray-300 dark:text-gray-700" />}
            </div>
          ))}
        </div>

        {/* Guesses History */}
        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
          {gameState === "playing" && (
            <div className="flex items-center gap-4 py-2 border-b border-gray-100 dark:border-gray-800 border-dashed">
              <div className="flex gap-2">
                {Array.from({ length: CODE_LENGTH }).map((_, i) => (
                  <button
                    key={i}
                    onClick={removeLastColor}
                    className="w-8 h-8 rounded-full border-2 border-gray-200 dark:border-gray-700 transition-all"
                    style={{ backgroundColor: currentGuess[i] || "transparent" }}
                  />
                ))}
              </div>
              <button
                disabled={currentGuess.length !== CODE_LENGTH}
                onClick={submitGuess}
                className="ml-auto px-4 py-1.5 rounded-full bg-purple-600 text-white font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-700 transition-colors"
              >
                Guess
              </button>
            </div>
          )}

          {guesses.map((guess, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <div className="flex gap-2">
                {guess.colors.map((color, i) => (
                  <div key={i} className="w-8 h-8 rounded-full shadow-sm" style={{ backgroundColor: color }} />
                ))}
              </div>
              <div className="flex gap-1 ml-auto">
                {Array.from({ length: guess.exact }).map((_, i) => (
                  <div key={i} className="w-3 h-3 rounded-full bg-red-500" />
                ))}
                {Array.from({ length: guess.partial }).map((_, i) => (
                  <div key={i} className="w-3 h-3 rounded-full bg-gray-400" />
                ))}
              </div>
            </div>
          ))}
          
          {guesses.length === 0 && gameState === "playing" && (
            <p className="text-center text-gray-400 text-sm italic font-medium">Make your first guess!</p>
          )}
        </div>

        {/* Color Picker */}
        {gameState === "playing" && (
          <div className="space-y-4">
            <p className="text-center text-xs font-black text-gray-400 uppercase tracking-widest">Pick Colors</p>
            <div className="flex justify-center gap-3">
              {COLORS.map((color) => (
                <button
                  key={color.hex}
                  onClick={() => handleColorClick(color.hex)}
                  className="w-10 h-10 rounded-full shadow-md hover:scale-110 active:scale-95 transition-all"
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
            </div>
          </div>
        )}

        {/* Status Messages */}
        <AnimatePresence>
          {gameState !== "playing" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-2xl text-center font-black ${
                gameState === "won" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}
            >
              {gameState === "won" ? (
                <>
                  <div className="text-2xl mb-1">🎉 YOU WON!</div>
                  <p className="text-sm">You cracked the secret code!</p>
                </>
              ) : (
                <>
                  <div className="text-2xl mb-1">💀 GAME OVER</div>
                  <p className="text-sm">The secret code was revealed above.</p>
                </>
              )}
              <button
                onClick={reset}
                className="mt-4 px-6 py-2 rounded-full bg-white text-gray-800 shadow-md hover:shadow-lg transition-all"
              >
                Play Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="bg-purple-50 dark:bg-purple-900/10 p-4 rounded-2xl border-2 border-purple-100 dark:border-purple-900/30">
        <h4 className="font-black text-purple-700 dark:text-purple-400 text-sm mb-1 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> How to Play
        </h4>
        <ul className="text-xs text-purple-600 dark:text-purple-300 space-y-1 font-medium">
          <li>• Guess the 4-color secret sequence in 10 tries.</li>
          <li>• <span className="text-red-500 font-bold">Red dots</span> mean a color is correct and in the right spot.</li>
          <li>• <span className="text-gray-500 dark:text-gray-400 font-bold">Grey dots</span> mean a color is correct but in the wrong spot.</li>
        </ul>
      </div>
    </div>
  );
};
