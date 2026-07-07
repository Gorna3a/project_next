'use client';

import { motion } from 'framer-motion';
import { Terminal, BookOpen, Trophy, AlertCircle, Sparkles } from 'lucide-react';

export default function SeedPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight">Seed / Migrate</h1>
        <p className="text-sm text-gray-500 font-medium mt-1">
          Seed starter content from the codebase into Sanity CMS via CLI.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="card p-6 space-y-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Courses & Lessons</h3>
              <p className="text-xs text-gray-500 font-medium">5 courses · 18 lessons</p>
            </div>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">
            Seeds Python, JavaScript, TypeScript, HTML/CSS, and SQL courses with all
            lessons, exercise content, and quizzes into Sanity.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="card p-6 space-y-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Challenges</h3>
              <p className="text-xs text-gray-500 font-medium">6 code · 6 quiz</p>
            </div>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">
            Seeds code challenges (Hello World, FizzBuzz, Two Sum, etc.) and quiz
            challenges (JavaScript, Python, SQL JOINs, Big O, HTTP, React Hooks).
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="card p-6 space-y-4"
      >
        <div className="flex items-center gap-3">
          <Terminal className="w-5 h-5 text-brand-500" />
          <h3 className="font-bold text-sm">Run from the terminal</h3>
        </div>

        <p className="text-sm text-gray-500">
          Tokens cannot be used from the browser. Run the seed script from the project root:
        </p>

        <div className="bg-gray-950 dark:bg-gray-900 rounded-xl p-4 space-y-2 font-mono text-sm">
          <div className="flex items-center gap-2 text-gray-400">
            <Sparkles className="w-3.5 h-3.5 text-brand-500" />
            <span># Seed everything (courses + challenges)</span>
          </div>
          <code className="block text-green-400">npm run seed</code>

          <div className="flex items-center gap-2 text-gray-400 pt-2">
            <Sparkles className="w-3.5 h-3.5 text-brand-500" />
            <span># Seed only courses</span>
          </div>
          <code className="block text-green-400">npx tsx scripts/seed.ts courses</code>

          <div className="flex items-center gap-2 text-gray-400 pt-2">
            <Sparkles className="w-3.5 h-3.5 text-brand-500" />
            <span># Seed only challenges</span>
          </div>
          <code className="block text-green-400">npx tsx scripts/seed.ts challenges</code>
        </div>
      </motion.div>

      <div className="card p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-gray-500 leading-relaxed">
          <strong className="text-gray-700 dark:text-gray-300">Idempotent:</strong> Uses{' '}
          <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">createIfNotExists</code>,
          so running multiple times will not create duplicates. Existing documents are
          preserved. To update, delete the document in Sanity Studio first.
        </div>
      </div>
    </div>
  );
}
