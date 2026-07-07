'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Brain, Code, Target, Grid } from 'lucide-react';

// Game Components
import { TicTacToe }           from './TicTacToe';
import { ChessGame }            from './ChessGame';
import { WordScramble }         from './WordScramble';
import { PatternQuizAdvanced }  from './PatternQuiz';
import { MastermindGame }       from './MastermindGame';
import { SudokuGame }           from './SudokuGame';
import { CodingGame }           from './CodingGame';
import { MathArena }            from './MathArena';
import { SequenceMemory }       from './SequenceMemory';
import { LogicPuzzles }         from './LogicPuzzles';
import { AlgoVisualizer }       from './AlgoVisualizer';

// ─── Memory Card Game ─────────────────────────────────────────────────────────
const CARD_EMOJIS = ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼'];
interface MemoryCard { id: number; emoji: string; flipped: boolean; matched: boolean; }

const MemoryGame = () => {
  const [cards, setCards]     = useState<MemoryCard[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves]     = useState(0);
  const [matches, setMatches] = useState(0);
  // won state removed

  const init = () => {
    const deck = [...CARD_EMOJIS, ...CARD_EMOJIS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, i) => ({ id: i, emoji, flipped: false, matched: false }));
    setCards(deck); setFlipped([]); setMoves(0); setMatches(0);
  };

  useState(() => { init(); return undefined; });

  const handleFlip = (id: number) => {
    const card = cards[id];
    if (card.flipped || card.matched || flipped.length === 2) return;
    const nf = [...flipped, id];
    setCards(prev => prev.map(c => c.id === id ? { ...c, flipped: true } : c));
    setFlipped(nf);
    if (nf.length === 2) {
      setMoves(m => m + 1);
      const [a, b] = nf.map(i => cards[i]);
      if (a.emoji === b.emoji) {
        setTimeout(() => {
          setCards(prev => prev.map(c => nf.includes(c.id) ? { ...c, matched: true } : c));
          setFlipped([]);
          setMatches(m => m+1);
        }, 500);
      } else {
        setTimeout(() => {
          setCards(prev => prev.map(c => nf.includes(c.id) ? { ...c, flipped: false } : c));
          setFlipped([]);
        }, 900);
      }
    }
  };

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex gap-4 text-sm font-black">
          <span className="px-3 py-1 rounded-full" style={{ backgroundColor: '#eef2ff', color: '#4f46e5' }}>Moves: {moves}</span>
          <span className="px-3 py-1 rounded-full" style={{ backgroundColor: '#ecfdf5', color: '#059669' }}>Matches: {matches}/{CARD_EMOJIS.length}</span>
        </div>
        <button onClick={init} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-sm"
          style={{ backgroundColor: '#f5f3ff', color: '#7c3aed' }}>
          <RotateCcw className="w-4 h-4" /> Reset
        </button>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {cards.map(card => (
          <motion.button key={card.id} onClick={() => handleFlip(card.id)}
            whileHover={!card.flipped && !card.matched ? { scale: 1.05 } : {}}
            className="aspect-square rounded-2xl text-3xl font-black flex items-center justify-center border-4 shadow"
            style={{
              backgroundColor: card.flipped || card.matched ? '#fef3c7' : '#667eea',
              borderColor: card.matched ? '#22c55e' : card.flipped ? '#fbbf24' : '#764ba2',
              cursor: card.flipped || card.matched ? 'default' : 'pointer',
            }}>
            <AnimatePresence mode="wait">
              {card.flipped || card.matched
                ? <motion.span key="e" initial={{ scale: 0 }} animate={{ scale: 1 }}>{card.emoji}</motion.span>
                : <motion.span key="b" className="text-white text-2xl">❓</motion.span>}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

// ─── Games registry ───────────────────────────────────────────────────────────
type Category = 'Brain' | 'Coding' | 'Math' | 'Board';

interface Game {
  id: string;
  emoji: string;
  title: string;
  desc: string;
  color: string;
  bg: string;
  border: string;
  category: Category;
  component: React.ComponentType<any>;
  tag?: string;
}

const GAMES: Game[] = [
  // Coding
  { id: 'coding',    emoji: '💻', title: 'Coding Logic',   desc: 'Solve logic puzzles inspired by coding!', category: 'Coding', component: CodingGame, color: '#4f46e5', bg: '#eef2ff', border: '#c7d2fe', tag: 'NEW' },
  { id: 'visualizer',emoji: '📊', title: 'Algo Vision',    desc: 'See how sorting and searching works!', category: 'Coding', component: AlgoVisualizer, color: '#0891b2', bg: '#ecfeff', border: '#a5f3fc', tag: 'Visual' },
  { id: 'words',    emoji: '🔤', title: 'Word Scramble',   desc: 'Unscramble letters to spell words!', category: 'Coding', component: WordScramble, color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe' },
  
  // Math & Brain
  { id: 'arena',    emoji: '⚡', title: 'Math Arena',     desc: '60s blitz! How many can you solve?', category: 'Math', component: MathArena, color: '#d97706', bg: '#fffbeb', border: '#fde68a', tag: 'Blitz' },
  { id: 'memory-seq',emoji: '🧠', title: 'Brain Memory',   desc: 'Repeat the pattern as it grows longer!', category: 'Brain', component: SequenceMemory, color: '#db2777', bg: '#fdf2f8', border: '#fbcfe8', tag: 'Expert' },
  { id: 'memory',    emoji: '🃏', title: 'Memory Match',   desc: 'Flip cards and find the pairs!', category: 'Brain', component: MemoryGame, color: '#6366f1', bg: '#eef2ff', border: '#c7d2fe' },
  
  // Puzzles
  { id: 'mastermind',emoji: '🕵️', title: 'Mastermind',    desc: 'Can you crack the secret color code?', category: 'Brain', component: MastermindGame, color: '#10b981', bg: '#ecfdf5', border: '#a7f3d0', tag: 'Logic' },
  { id: 'sudoku',    emoji: '🧩', title: 'Sudoku',         desc: 'Classic numbers puzzle for kids!', category: 'Brain', component: SudokuGame, color: '#f59e0b', bg: '#fffbeb', border: '#fef3c7', tag: 'Smart' },
  { id: 'logic',     emoji: '💡', title: 'Logic Puzzles',  desc: 'Finish patterns and number sequences!', category: 'Brain', component: LogicPuzzles, color: '#ea580c', bg: '#fff7ed', border: '#ffedd5' },
  { id: 'pattern',   emoji: '🔮', title: 'Pattern Quest',  desc: '6 difficulty levels of patterns!', category: 'Brain', component: PatternQuizAdvanced, color: '#8b5cf6', bg: '#f5f3ff', border: '#ddd6fe' },
  
  // Board Games
  { id: 'chess',    emoji: '♟️', title: 'Chess',           desc: 'Strategy game for grandmasters!', category: 'Board', component: ChessGame, color: '#4b5563', bg: '#f3f4f6', border: '#e5e7eb' },
  { id: 'tictactoe',emoji: '✕○', title: 'Tic-Tac-Toe',    desc: 'Classic 3-in-a-row against a friend!', category: 'Board', component: TicTacToe, color: '#ef4444', bg: '#fef2f2', border: '#fee2e2' },
];

const CATEGORIES: { id: Category; emoji: string; icon: any }[] = [
  { id: 'Coding', emoji: '💻', icon: Code },
  { id: 'Math',   emoji: '🔢', icon: Target },
  { id: 'Brain',  emoji: '🧠', icon: Brain },
  { id: 'Board',  emoji: '♟️', icon: Grid },
];

export default function GamesPage() {
  const [activeGameId, setActiveGameId] = useState<string | null>(null);
  const [category, setCategory] = useState<Category | 'All'>('All');

  const filteredGames = category === 'All' ? GAMES : GAMES.filter(g => g.category === category);
  const activeGame = GAMES.find(g => g.id === activeGameId);

  if (activeGameId && activeGame) {
    const GameComp = activeGame.component;
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={() => setActiveGameId(null)}
            className="px-6 py-2 rounded-full font-black text-sm bg-white dark:bg-gray-800 shadow-md hover:scale-105 transition-all"
            style={{ color: activeGame.color }}>← Back</button>
          <div className="flex items-center gap-2">
            <span className="text-3xl">{activeGame.emoji}</span>
            <h1 className="text-3xl font-black text-gray-800 dark:text-white">{activeGame.title}</h1>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-3xl p-6 md:p-10 border-4 border-white dark:border-gray-800"
        >
          <GameComp />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-2">
        <h1 className="text-5xl font-black text-gray-800 dark:text-white tracking-tight">
          Brain <span className="text-purple-600">Games</span> 🎮
        </h1>
        <p className="text-lg font-bold text-gray-500">Pick a challenge and level up your skills!</p>
      </motion.div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2">
        <button
          onClick={() => setCategory('All')}
          className={`px-6 py-2 rounded-full font-black text-sm transition-all
            ${category === 'All' ? 'bg-purple-600 text-white shadow-lg scale-110' : 'bg-white dark:bg-gray-800 text-gray-500 hover:bg-gray-50'}`}
        >
          All Games
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={`flex items-center gap-2 px-6 py-2 rounded-full font-black text-sm transition-all
              ${category === cat.id ? 'bg-purple-600 text-white shadow-lg scale-110' : 'bg-white dark:bg-gray-800 text-gray-500 hover:bg-gray-50'}`}
          >
            <cat.icon className="w-4 h-4" />
            {cat.id}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGames.map((game, i) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -8, scale: 1.02 }}
          >
            <button
              onClick={() => setActiveGameId(game.id)}
              className="w-full relative rounded-[2rem] p-8 text-center shadow-xl border-4 transition-all overflow-hidden group"
              style={{ backgroundColor: game.bg, borderColor: game.border }}
            >
              {game.tag && (
                <span className="absolute top-4 right-4 text-[10px] font-black px-2.5 py-1 rounded-full text-white uppercase tracking-widest"
                  style={{ backgroundColor: game.color }}>{game.tag}</span>
              )}
              
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">{game.emoji}</div>
              <h2 className="text-2xl font-black mb-2" style={{ color: game.color }}>{game.title}</h2>
              <p className="text-gray-600 dark:text-gray-400 font-bold text-sm mb-6 leading-tight">{game.desc}</p>
              
              <div className="inline-block px-8 py-2.5 rounded-2xl font-black text-white shadow-md transition-all group-hover:shadow-lg active:scale-95"
                style={{ backgroundColor: game.color }}>
                Play Game 🎮
              </div>
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
