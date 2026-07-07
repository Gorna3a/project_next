'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';

type Color = 'w' | 'b';
type PieceType = 'K' | 'Q' | 'R' | 'B' | 'N' | 'P';
interface Piece { type: PieceType; color: Color; }
type Board = (Piece | null)[][];

// Distinct Unicode chess pieces - white pieces are filled, black pieces are outlined
const WHITE_PIECE: Record<PieceType, string> = {
  K: '♔', Q: '♕', R: '♖', B: '♗', N: '♘', P: '♙',
};
const BLACK_PIECE: Record<PieceType, string> = {
  K: '♚', Q: '♛', R: '♜', B: '♝', N: '♞', P: '♟',
};

const initBoard = (): Board => {
  const back: PieceType[] = ['R','N','B','Q','K','B','N','R'];
  const board: Board = Array(8).fill(null).map(() => Array(8).fill(null));
  back.forEach((t, c) => {
    board[0][c] = { type: t, color: 'b' };
    board[7][c] = { type: t, color: 'w' };
  });
  for (let c = 0; c < 8; c++) {
    board[1][c] = { type: 'P', color: 'b' };
    board[6][c] = { type: 'P', color: 'w' };
  }
  return board;
};

const getMoves = (board: Board, row: number, col: number): [number, number][] => {
  const piece = board[row][col];
  if (!piece) return [];
  const { type, color } = piece;
  const moves: [number, number][] = [];
  const inBounds = (r: number, c: number) => r >= 0 && r < 8 && c >= 0 && c < 8;
  const friendly = (r: number, c: number) => board[r][c]?.color === color;
  const slide = (dr: number, dc: number) => {
    let r = row + dr, c = col + dc;
    while (inBounds(r, c)) {
      if (friendly(r, c)) break;
      moves.push([r, c]);
      if (board[r][c]) break;
      r += dr; c += dc;
    }
  };
  if (type === 'P') {
    const dir = color === 'w' ? -1 : 1;
    const startRow = color === 'w' ? 6 : 1;
    if (inBounds(row+dir, col) && !board[row+dir][col]) {
      moves.push([row+dir, col]);
      if (row === startRow && !board[row+2*dir][col]) moves.push([row+2*dir, col]);
    }
    for (const dc of [-1,1]) {
      if (inBounds(row+dir, col+dc) && board[row+dir][col+dc] && !friendly(row+dir, col+dc))
        moves.push([row+dir, col+dc]);
    }
  }
  if (type === 'N') {
    for (const [dr,dc] of [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]])
      if (inBounds(row+dr, col+dc) && !friendly(row+dr, col+dc)) moves.push([row+dr, col+dc]);
  }
  if (type === 'K') {
    for (const [dr,dc] of [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]])
      if (inBounds(row+dr, col+dc) && !friendly(row+dr, col+dc)) moves.push([row+dr, col+dc]);
  }
  if (type === 'R' || type === 'Q') { slide(-1,0); slide(1,0); slide(0,-1); slide(0,1); }
  if (type === 'B' || type === 'Q') { slide(-1,-1); slide(-1,1); slide(1,-1); slide(1,1); }
  return moves;
};

interface ChessGameProps {
  lightSquare?: string;
  darkSquare?: string;
}

export const ChessGame = ({ lightSquare = '#f0d9b5', darkSquare = '#b58863' }: ChessGameProps) => {
  const [board, setBoard]       = useState<Board>(initBoard);
  const [selected, setSelected] = useState<[number,number] | null>(null);
  const [turn, setTurn]         = useState<Color>('w');
  const [moves, setMoves]       = useState<[number,number][]>([]);
  const [captured, setCaptured] = useState<{ w: Piece[]; b: Piece[] }>({ w: [], b: [] });
  const [winner, setWinner]     = useState<Color | null>(null);
  const [lastMove, setLastMove] = useState<[[number,number],[number,number]] | null>(null);

  const reset = useCallback(() => {
    setBoard(initBoard()); setSelected(null); setTurn('w');
    setMoves([]); setCaptured({ w: [], b: [] }); setWinner(null); setLastMove(null);
  }, []);

  const handleClick = (row: number, col: number) => {
    if (winner) return;
    const piece = board[row][col];
    if (selected) {
      const isValid = moves.some(([r,c]) => r === row && c === col);
      if (isValid) {
        const nb = board.map(r => r.slice()) as Board;
        const cap = nb[row][col];
        let moved = nb[selected[0]][selected[1]]!;
        if (moved.type === 'P' && (row === 0 || row === 7)) moved = { ...moved, type: 'Q' };
        nb[row][col] = moved;
        nb[selected[0]][selected[1]] = null;
        const nc = { ...captured };
        if (cap) nc[turn] = [...nc[turn], cap];
        if (cap?.type === 'K') setWinner(turn);
        setBoard(nb); setCaptured(nc);
        setLastMove([selected, [row, col]]);
        setSelected(null); setMoves([]);
        setTurn(turn === 'w' ? 'b' : 'w');
        return;
      }
      setSelected(null); setMoves([]);
    }
    if (piece && piece.color === turn) {
      setSelected([row, col]);
      setMoves(getMoves(board, row, col));
    }
  };

  const isLight   = (r: number, c: number) => (r + c) % 2 === 0;
  const isSelected = (r: number, c: number) => selected?.[0] === r && selected?.[1] === c;
  const isMove    = (r: number, c: number) => moves.some(([mr,mc]) => mr === r && mc === c);
  const isLast    = (r: number, c: number) => lastMove && (
    (lastMove[0][0] === r && lastMove[0][1] === c) || (lastMove[1][0] === r && lastMove[1][1] === c)
  );

  const getPieceStyle = (p: Piece) => ({
    fontSize: '2rem',
    lineHeight: 1,
    // White pieces: creamy white with dark shadow; Black pieces: very dark with white shadow
    color: p.color === 'w' ? '#fffaf0' : '#1a1a2e',
    textShadow: p.color === 'w'
      ? '0 1px 3px rgba(0,0,0,0.9), 0 0 6px rgba(0,0,0,0.6)'
      : '0 1px 2px rgba(255,255,255,0.7), 0 0 4px rgba(255,255,255,0.4)',
    filter: p.color === 'w' ? 'drop-shadow(0 2px 3px rgba(0,0,0,0.8))' : 'drop-shadow(0 2px 3px rgba(0,0,0,0.5))',
  });

  return (
    <div className="space-y-4 flex flex-col items-center">
      {/* Color legend */}
      <div className="flex gap-6 text-sm font-black">
        <span className="flex items-center gap-2 px-3 py-1.5 rounded-full"
          style={{ backgroundColor: '#f5f5f0', border: '2px solid #ccc' }}>
          <span style={{ color: '#1a1a2e', fontSize: '1.2rem', textShadow: '0 1px 2px rgba(255,255,255,0.6)' }}>♚</span>
          <span style={{ color: '#374151' }}>Black</span>
        </span>
        <span className="flex items-center gap-2 px-3 py-1.5 rounded-full"
          style={{ backgroundColor: '#1a1a2e', border: '2px solid #555' }}>
          <span style={{ color: '#fffaf0', fontSize: '1.2rem', textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}>♔</span>
          <span style={{ color: '#e5e7eb' }}>White</span>
        </span>
      </div>

      <div className="flex items-center justify-between w-full max-w-sm">
        <span className="font-black px-3 py-1 rounded-full text-sm"
          style={{ backgroundColor: '#fef3c7', color: '#92400e' }}>
          {winner ? `🏆 ${winner === 'w' ? 'White' : 'Black'} wins!`
            : `${turn === 'w' ? '⬜ White' : '⬛ Black'}'s turn`}
        </span>
        <button onClick={reset} className="flex items-center gap-1 px-3 py-1.5 rounded-full font-black text-sm"
          style={{ backgroundColor: '#f5f3ff', color: '#7c3aed' }}>
          <RotateCcw className="w-4 h-4" /> New Game
        </button>
      </div>

      {/* Captured by white */}
      <div className="flex gap-0.5 min-h-6 self-start text-xl">
        {captured.w.map((p, i) => (
          <span key={i} style={getPieceStyle(p)}>
            {p.color === 'w' ? WHITE_PIECE[p.type] : BLACK_PIECE[p.type]}
          </span>
        ))}
      </div>

      {/* Board with rank/file labels */}
      <div className="flex">
        {/* Rank labels */}
        <div className="flex flex-col justify-around pr-1">
          {[8,7,6,5,4,3,2,1].map(n => (
            <span key={n} className="text-xs font-black text-center" style={{ height: 52, lineHeight: '52px', width: 14, color: '#6b7280' }}>{n}</span>
          ))}
        </div>
        <div>
          <div className="rounded-xl overflow-hidden border-4 border-amber-800 shadow-2xl">
            {board.map((row, r) => (
              <div key={r} className="flex">
                {row.map((piece, c) => {
                  const sel = isSelected(r, c);
                  const mv  = isMove(r, c);
                  const lm  = isLast(r, c);
                  let bg = isLight(r, c) ? lightSquare : darkSquare;
                  if (sel) bg = '#f6f669';
                  else if (lm) bg = isLight(r, c) ? '#cdd26a' : '#aaa23a';

                  return (
                    <button key={c} onClick={() => handleClick(r, c)}
                      className="relative flex items-center justify-center select-none"
                      style={{ width: 52, height: 52, backgroundColor: bg }}>
                      {mv && (
                        <div className="absolute rounded-full z-10 pointer-events-none"
                          style={{
                            width: piece ? '88%' : '34%',
                            height: piece ? '88%' : '34%',
                            backgroundColor: piece ? 'rgba(20,85,30,0.5)' : 'rgba(20,85,30,0.45)',
                            border: piece ? '4px solid rgba(20,85,30,0.6)' : 'none',
                          }} />
                      )}
                      {piece && (
                        <span className="z-20 select-none"
                          style={getPieceStyle(piece)}>
                          {piece.color === 'w' ? WHITE_PIECE[piece.type] : BLACK_PIECE[piece.type]}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
          {/* File labels */}
          <div className="flex justify-around mt-1">
            {['a','b','c','d','e','f','g','h'].map(l => (
              <span key={l} className="text-xs font-black text-center" style={{ width: 52, color: '#6b7280' }}>{l}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Captured by black */}
      <div className="flex gap-0.5 min-h-6 self-start text-xl">
        {captured.b.map((p, i) => (
          <span key={i} style={getPieceStyle(p)}>
            {p.color === 'w' ? WHITE_PIECE[p.type] : BLACK_PIECE[p.type]}
          </span>
        ))}
      </div>

      {winner && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
          className="text-center p-5 rounded-2xl border-4 font-black"
          style={{ backgroundColor: '#fef3c7', borderColor: '#fbbf24', color: '#92400e' }}>
          <div className="text-4xl mb-2">♟️👑</div>
          <div className="text-xl">{winner === 'w' ? 'White' : 'Black'} wins!</div>
          <button onClick={reset} className="mt-3 px-6 py-2 rounded-full text-white font-black"
            style={{ backgroundColor: '#f59e0b' }}>Play Again!</button>
        </motion.div>
      )}

      <p className="text-xs text-gray-500 font-semibold text-center max-w-xs">
        Click a piece to select → highlighted squares show valid moves → click to move. Pawn reaches end = Queen! ♛
      </p>
    </div>
  );
};
