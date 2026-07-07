import { motion } from 'framer-motion';
import Link from 'next/link';

const SECTIONS = [
  { to: '/kids/cs',    emoji: '💻', title: 'Learn CS',    desc: 'How do computers work? What is coding? Start here!', color: '#4f46e5', bg: '#eef2ff', border: '#818cf8' },
  { to: '/kids/math',  emoji: '🔢', title: 'Math Fun',    desc: 'Practice addition, subtraction, multiplication and more!', color: '#059669', bg: '#ecfdf5', border: '#6ee7b7' },
  { to: '/kids/games', emoji: '🎮', title: 'Brain Games', desc: 'Puzzles and memory games to train your brain!', color: '#d97706', bg: '#fffbeb', border: '#fbbf24' },
];

const floatingEmojis = ['🌟','🎨','🚀','🦄','🎯','💡','🌈','🎪'];

const FUN_FACTS = [
  '💡 The first computer programmer was a woman named Ada Lovelace in 1843! 👩‍💻',
  '🐛 The word "bug" in coding comes from a real moth found inside a computer in 1947!',
  '🌍 There are over 700 different programming languages in the world!',
  '⚡ A modern computer can do over 1 billion calculations per second!',
];

export default function KidsHomePage() {
  const fact = FUN_FACTS[Math.floor(Date.now() / 86400000) % FUN_FACTS.length];

  return (
    <div className="space-y-10">
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        className="text-center relative py-14 rounded-3xl overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)' }}>
        {floatingEmojis.map((emoji, i) => (
          <motion.span key={i} className="absolute text-2xl select-none pointer-events-none"
            style={{ left: `${8 + i * 11}%`, top: `${15 + (i % 3) * 28}%` }}
            animate={{ y: [0, -14, 0], rotate: [0, 8, -8, 0] }}
            transition={{ duration: 3 + i * 0.4, repeat: Infinity, delay: i * 0.3 }}>
            {emoji}
          </motion.span>
        ))}
        <div className="relative z-10 space-y-4">
          <motion.div className="text-7xl" animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}>🚀</motion.div>
          <h1 className="text-4xl md:text-5xl font-black text-white drop-shadow-lg">Welcome to PixelCode!</h1>
          <p className="text-xl text-purple-100 font-bold max-w-md mx-auto">
            Learn coding, math, and play brain games! 🧠✨
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/kids/cs"
              className="inline-block mt-2 px-8 py-3 rounded-full text-lg font-black shadow-xl"
              style={{ backgroundColor: '#fbbf24', color: '#1e1b4b' }}>
              Start Learning! ⭐
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Section cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {SECTIONS.map((s, i) => (
          <motion.div key={s.to}
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15, duration: 0.5 }}
            whileHover={{ y: -6, scale: 1.02 }}>
            <Link href={s.to} className="block rounded-3xl p-6 text-center shadow-lg border-4 space-y-3 transition-all"
              style={{ backgroundColor: s.bg, borderColor: s.border }}>
              <div className="text-6xl">{s.emoji}</div>
              <h2 className="text-2xl font-black" style={{ color: s.color }}>{s.title}</h2>
              <p className="text-gray-600 font-semibold text-sm leading-relaxed">{s.desc}</p>
              <div className="inline-block px-5 py-2 rounded-full font-black text-white text-sm shadow"
                style={{ backgroundColor: s.color }}>Let's Go! →</div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Fun fact */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
        className="rounded-2xl p-5 text-center shadow border-4"
        style={{ backgroundColor: '#fef3c7', borderColor: '#fbbf24' }}>
        <p className="text-base font-bold" style={{ color: '#92400e' }}>{fact}</p>
      </motion.div>
    </div>
  );
}
