'use client';

import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { RotateCcw, CheckCircle2, Trophy, AlertTriangle } from "lucide-react";

type SudokuSize = 4 | 9;

interface Cell {
  value: number;
  isInitial: boolean;
  userInput: number;
  isCorrect?: boolean;
}

export const SudokuGame = () => {
  const [size, setSize] = useState<SudokuSize>(4);
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [gameState, setGameState] = useState<"playing" | "won">("playing");
  const [errors, setErrors] = useState(0);

  const generatePuzzle = useCallback((newSize: SudokuSize) => {
    // Basic Sudoku generation for kids (pre-defined templates or simple random)
    // For 4x4 we can do a simple valid grid and remove some numbers
    const newGrid: Cell[][] = Array(newSize).fill(null).map(() => 
      Array(newSize).fill(null).map(() => ({ value: 0, isInitial: false, userInput: 0 }))
    );

    if (newSize === 4) {
      // Simple 4x4 template
      const template = [
        [1, 2, 3, 4],
        [3, 4, 1, 2],
        [2, 1, 4, 3],
        [4, 3, 2, 1]
      ];
      // Shuffle rows/cols within blocks? Let's just use it and hide numbers.
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          newGrid[r][c].value = template[r][c];
          if (Math.random() > 0.4) {
            newGrid[r][c].isInitial = true;
            newGrid[r][c].userInput = template[r][c];
          }
        }
      }
    } else {
      // 9x9 template
      const template = [
        [5, 3, 4, 6, 7, 8, 9, 1, 2],
        [6, 7, 2, 1, 9, 5, 3, 4, 8],
        [1, 9, 8, 3, 4, 2, 5, 6, 7],
        [8, 5, 9, 7, 6, 1, 4, 2, 3],
        [4, 2, 6, 8, 5, 3, 7, 9, 1],
        [7, 1, 3, 9, 2, 4, 8, 5, 6],
        [9, 6, 1, 5, 3, 7, 2, 8, 4],
        [2, 8, 7, 4, 1, 9, 6, 3, 5],
        [3, 4, 5, 2, 8, 6, 1, 7, 9]
      ];
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          newGrid[r][c].value = template[r][c];
          if (Math.random() > 0.6) {
            newGrid[r][c].isInitial = true;
            newGrid[r][c].userInput = template[r][c];
          }
        }
      }
    }
    setGrid(newGrid);
    setGameState("playing");
    setErrors(0);
    setSelectedCell(null);
  }, []);

  useEffect(() => {
    generatePuzzle(size);
  }, [size, generatePuzzle]);

  const handleCellClick = (r: number, c: number) => {
    if (gameState === "won" || grid[r][c].isInitial) return;
    setSelectedCell([r, c]);
  };

  const handleNumberInput = (num: number) => {
    if (!selectedCell || gameState === "won") return;
    const [r, c] = selectedCell;
    const newGrid = [...grid];
    const cell = newGrid[r][c];
    
    if (cell.value === num) {
      cell.userInput = num;
      cell.isCorrect = true;
      // Check for win
      const allDone = newGrid.every(row => row.every(cell => cell.userInput === cell.value));
      if (allDone) setGameState("won");
    } else {
      setErrors(e => e + 1);
      cell.isCorrect = false;
      setTimeout(() => {
        setGrid(prev => {
          const g = [...prev];
          g[r][c].isCorrect = undefined;
          return g;
        });
      }, 500);
    }
    setGrid(newGrid);
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-gray-800 dark:text-white">🧩 Sudoku</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setSize(4)}
            className={`px-3 py-1 rounded-lg font-black text-xs transition-all ${size === 4 ? "bg-purple-600 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-500"}`}
          >
            4x4
          </button>
          <button
            onClick={() => setSize(9)}
            className={`px-3 py-1 rounded-lg font-black text-xs transition-all ${size === 9 ? "bg-purple-600 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-500"}`}
          >
            9x9
          </button>
          <button
            onClick={() => generatePuzzle(size)}
            className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center px-2">
        <div className="flex items-center gap-1.5 text-sm font-black text-red-500">
          <AlertTriangle className="w-4 h-4" /> Mistakes: {errors}
        </div>
        {gameState === "won" && (
          <div className="flex items-center gap-1.5 text-sm font-black text-green-500">
            <Trophy className="w-4 h-4" /> You Won!
          </div>
        )}
      </div>

      {/* Grid */}
      <div 
        className={`grid gap-1 bg-gray-200 dark:bg-gray-800 p-1 rounded-xl shadow-lg border-4 border-gray-200 dark:border-gray-800`}
        style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
      >
        {grid.map((row, r) => (
          row.map((cell, c) => {
            const isSelected = selectedCell?.[0] === r && selectedCell?.[1] === c;
            const isBlockStartRow = r % (size === 4 ? 2 : 3) === 0 && r !== 0;
            const isBlockStartCol = c % (size === 4 ? 2 : 3) === 0 && c !== 0;

            return (
              <button
                key={`${r}-${c}`}
                onClick={() => handleCellClick(r, c)}
                className={`
                  aspect-square flex items-center justify-center font-black text-lg transition-all
                  ${cell.isInitial ? "bg-gray-50 dark:bg-gray-900 text-gray-400" : "bg-white dark:bg-gray-950 text-purple-600"}
                  ${isSelected ? "ring-4 ring-purple-400 z-10 scale-105 rounded-lg shadow-md" : "rounded-sm"}
                  ${cell.isCorrect === false ? "bg-red-100 dark:bg-red-900/40 text-red-600" : ""}
                  ${cell.isCorrect === true ? "bg-green-50 dark:bg-green-900/20 text-green-600" : ""}
                `}
                style={{
                  fontSize: size === 4 ? "1.5rem" : "1.125rem",
                  marginTop: isBlockStartRow ? "2px" : "0",
                  marginLeft: isBlockStartCol ? "2px" : "0",
                }}
              >
                {cell.userInput !== 0 ? cell.userInput : ""}
              </button>
            );
          })
        ))}
      </div>

      {/* Number Pad */}
      <div className="flex justify-center gap-2 flex-wrap">
        {Array.from({ length: size }).map((_, i) => (
          <button
            key={i + 1}
            onClick={() => handleNumberInput(i + 1)}
            className="w-12 h-12 rounded-2xl bg-white dark:bg-gray-900 shadow-md border-2 border-gray-100 dark:border-gray-800 font-black text-gray-800 dark:text-white hover:border-purple-500 transition-all active:scale-90"
          >
            {i + 1}
          </button>
        ))}
      </div>

      {gameState === "won" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-green-100 dark:bg-green-900/30 p-6 rounded-3xl text-center border-4 border-green-200 dark:border-green-800"
        >
          <Trophy className="w-12 h-12 text-green-600 mx-auto mb-2" />
          <h3 className="text-2xl font-black text-green-800 dark:text-green-400">Amazing Job!</h3>
          <p className="text-sm text-green-700 dark:text-green-500 font-bold mb-4">You solved the {size}x{size} Sudoku!</p>
          <button
            onClick={() => generatePuzzle(size)}
            className="px-8 py-2 rounded-full bg-green-600 text-white font-black hover:bg-green-700 transition-all shadow-lg"
          >
            New Game
          </button>
        </motion.div>
      )}

      <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-2xl border-2 border-blue-100 dark:border-blue-900/30">
        <h4 className="font-black text-blue-700 dark:text-blue-400 text-sm mb-1 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> Sudoku Tips
        </h4>
        <ul className="text-xs text-blue-600 dark:text-blue-300 space-y-1 font-medium">
          <li>• Fill the grid so every row and column has numbers 1 to {size}.</li>
          <li>• Each small block must also contain all numbers 1 to {size}.</li>
          <li>• Pick a square, then pick a number to fill it!</li>
        </ul>
      </div>
    </div>
  );
};
