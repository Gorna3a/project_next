'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';

type Square = 'X' | 'O' | null;

function calcWinner(squares: Square[]): { winner: Square; line: number[] } | null {
  const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  for (const [a,b,c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c])
      return { winner: squares[a], line: [a,b,c] };
  }
  return null;
}

export const TicTacToe = () => {
  const [squares, setSquares] = useState<Square[]>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const result = calcWinner(squares);
  const isDraw = !result && squares.every(Boolean);

  const handleClick = (i: number) => {
    if (squares[i] || result) return;
    const next = squares.slice();
    next[i] = xIsNext ? 'X' : 'O';
    setSquares(next);
    setXIsNext(!xIsNext);
  };

  const reset = useCallback(() => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  }, []);

  const status = result
    ? `🎉 Player ${result.winner} wins!`
    : isDraw ? "🤝 It's a draw!"
    : `${xIsNext ? '❌ X' : '⭕ O'}'s turn`;

  return (
    <div className="space-y-6 flex flex-col items-center">
      <div className="flex items-center justify-between w-full max-w-xs">
        <motion.span
          key={status}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="font-black text-base px-4 py-2 rounded-full"
          style={{ backgroundColor: '#fef3c7', color: '#92400e' }}
        >
          {status}
        </motion.span>
        <button onClick={reset}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full font-black text-sm"
          style={{ backgroundColor: '#f5f3ff', color: '#7c3aed' }}>
          <RotateCcw className="w-4 h-4" /> Reset
        </button>
      </div>

      {/* Board */}
      <div className="p-4 rounded-3xl" style={{ backgroundColor: '#4f46e5' }}>
        <div className="grid grid-cols-3 gap-3">
          {squares.map((sq, i) => {
            const isWin = result?.line.includes(i);
            return (
              <motion.button
                key={i}
                whileHover={!sq && !result ? { scale: 1.08 } : {}}
                whileTap={!sq && !result ? { scale: 0.92 } : {}}
                onClick={() => handleClick(i)}
                className="w-24 h-24 rounded-2xl flex items-center justify-center font-black text-5xl shadow-md border-4 transition-all"
                style={{
                  backgroundColor: isWin ? '#fef3c7' : sq ? '#eef2ff' : 'white',
                  borderColor: isWin ? '#f59e0b' : sq === 'X' ? '#6366f1' : sq === 'O' ? '#ec4899' : '#c7d2fe',
                  cursor: sq || result ? 'default' : 'pointer',
                }}>
                {sq === 'X' && (
                  <motion.span initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
                    style={{ color: '#4f46e5' }}>✕</motion.span>
                )}
                {sq === 'O' && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                    style={{ color: '#db2777' }}>○</motion.span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-6 text-sm font-black">
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
          style={{ backgroundColor: '#eef2ff', color: '#4f46e5' }}>
          <span>✕</span> Player X
        </span>
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
          style={{ backgroundColor: '#fdf2f8', color: '#db2777' }}>
          <span>○</span> Player O
        </span>
      </div>

      {(result || isDraw) && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
          className="text-center p-5 rounded-2xl border-4 font-black w-full max-w-xs"
          style={{ backgroundColor: '#fef3c7', borderColor: '#fbbf24', color: '#92400e' }}>
          <div className="text-4xl mb-2">{result ? '🏆' : '🤝'}</div>
          <div className="text-xl mb-3">{result ? `Player ${result.winner} wins!` : "It's a draw!"}</div>
          <button onClick={reset} className="px-6 py-2 rounded-full text-white font-black"
            style={{ backgroundColor: '#f59e0b' }}>Play Again!</button>
        </motion.div>
      )}
    </div>
  );
};
