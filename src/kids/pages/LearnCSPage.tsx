'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, CheckCircle2, XCircle } from "lucide-react";

interface Lesson {
  id: string;
  emoji: string;
  title: string;
  color: string;
  bg: string;
  border: string;
  content: string;
  quiz: { question: string; options: string[]; correct: number };
}

const LESSONS: Lesson[] = [
  {
    id: "computer",
    emoji: "🖥️",
    title: "What is a Computer?",
    color: "#4f46e5",
    bg: "#eef2ff",
    border: "#818cf8",
    content: `A computer is a super-smart machine that can follow instructions very fast! 🚀\n\nIt has 4 main parts:\n🧠 CPU (Brain) — thinks and calculates\n💾 Memory (RAM) — remembers things while working\n💿 Storage — saves things forever\n🖥️ Screen — shows you what's happening\n\nComputers can do millions of calculations in one second!`,
    quiz: {
      question: 'What is the "brain" of a computer called?',
      options: ["RAM", "CPU", "Screen", "Keyboard"],
      correct: 1,
    },
  },
  {
    id: "program",
    emoji: "📝",
    title: "What is a Program?",
    color: "#059669",
    bg: "#ecfdf5",
    border: "#6ee7b7",
    content: `A program is a list of instructions that tells the computer what to do! 📋\n\nThink of it like a recipe:\n1. Get flour 🌾\n2. Add sugar 🍬\n3. Mix together 🥣\n4. Bake in oven 🔥\n5. Enjoy! 🍪\n\nProgrammers write these instructions in special languages!`,
    quiz: {
      question: "A program is like a _____ for the computer.",
      options: ["Toy", "Recipe", "Movie", "Song"],
      correct: 1,
    },
  },
  {
    id: "algorithm",
    emoji: "🗺️",
    title: "What is an Algorithm?",
    color: "#d97706",
    bg: "#fffbeb",
    border: "#fbbf24",
    content: `An algorithm is step-by-step instructions to solve a problem! 🧩\n\nExample — How to make a sandwich:\n1. Get two slices of bread 🍞\n2. Add your favorite filling 🥪\n3. Put the slices together\n4. Cut in half ✂️\n5. Eat! 😋\n\nThe same steps always give the same result — that's an algorithm!`,
    quiz: {
      question: "An algorithm is a set of _____ to solve a problem.",
      options: ["Colors", "Steps", "Games", "Numbers"],
      correct: 1,
    },
  },
  {
    id: "binary",
    emoji: "0️⃣",
    title: "Binary — Computer Language",
    color: "#7c3aed",
    bg: "#f5f3ff",
    border: "#a78bfa",
    content: `Computers only understand two things: ON (1) and OFF (0)! 💡\n\nThis is called BINARY. Everything on your computer — photos, music, games — is secretly just lots of 1s and 0s!\n\nThe letter "A" in binary is: 01000001\n\nCount in binary:\n0 = 0, 1 = 1, 2 = 10, 3 = 11, 4 = 100\n\nIt's a secret code! 🔐`,
    quiz: {
      question: "Computers understand which two digits?",
      options: ["1 and 2", "0 and 9", "0 and 1", "A and B"],
      correct: 2,
    },
  },
  {
    id: "loops",
    emoji: "🔄",
    title: "Loops — Do It Again!",
    color: "#db2777",
    bg: "#fdf2f8",
    border: "#f9a8d4",
    content: `A loop tells the computer to repeat something many times! 🔁\n\nWithout a loop (boring way):\n• Print "Hello"\n• Print "Hello"\n• Print "Hello"\n\nWith a loop (smart way):\n• Repeat 3 times: Print "Hello" 👏\n\nLoops save programmers from writing the same thing over and over!`,
    quiz: {
      question: "What does a loop do in programming?",
      options: [
        "Draws circles",
        "Repeats instructions",
        "Deletes files",
        "Makes music",
      ],
      correct: 1,
    },
  },
  {
    id: "variables",
    emoji: "📦",
    title: "Variables — Storage Boxes",
    color: "#0891b2",
    bg: "#ecfeff",
    border: "#67e8f9",
    content: `A variable is like a labeled box where you store information! 📦\n\nExamples:\n• name = "Alex" 👤\n• age = 10 🎂\n• score = 100 🏆\n\nThe computer remembers what's in each box. You can change what's inside:\n• score = score + 10  →  now score is 110!\n\nVariables let programs remember things!`,
    quiz: {
      question: "A variable is like a _____ that stores information.",
      options: ["Color", "Box", "Screen", "Button"],
      correct: 1,
    },
  },
  {
    id: "functions",
    emoji: "🎯",
    title: "Functions — Reusable Recipes",
    color: "#7c3aed",
    bg: "#f5f3ff",
    border: "#a78bfa",
    content: `A function is a mini-program inside your program! 🎯\n\nInstead of writing the same steps again and again, you give them a name:\n\nfunction makeSandwich() {\n  getbread()\n  addFilling()\n  cut()\n}\n\nNow whenever you want a sandwich, you just write:\nmakeSandwich()\n\nFunctions save time and keep your code tidy! 🧹`,
    quiz: {
      question: "What is the main benefit of using functions?",
      options: ["They make colors", "They reuse code", "They delete files", "They draw shapes"],
      correct: 1,
    },
  },
  {
    id: "ifelse",
    emoji: "🤔",
    title: "If/Else — Making Decisions",
    color: "#d97706",
    bg: "#fffbeb",
    border: "#fbbf24",
    content: `Programs can make decisions just like you do! 🤔\n\nIf/Else lets your program choose:\n\nif (raining) {\n  bring umbrella ☂️\n} else {\n  wear sunglasses 😎\n}\n\nMore examples:\n• if (score > 100) → show "You Win!" 🏆\n• if (password is wrong) → show "Try Again!" 🔐\n\nThis is how games know when you've won or lost!`,
    quiz: {
      question: "What does an 'if/else' do in a program?",
      options: ["Repeats code", "Makes a decision", "Stores data", "Draws graphics"],
      correct: 1,
    },
  },
  {
    id: "internet",
    emoji: "🌐",
    title: "How the Internet Works",
    color: "#0891b2",
    bg: "#ecfeff",
    border: "#67e8f9",
    content: `The Internet is like a giant postal system for data! 📮\n\nWhen you visit a website:\n1. Your computer sends a REQUEST 📨\n2. A server computer receives it 🖥️\n3. The server sends back the webpage 📩\n4. Your browser shows it to you! 🌐\n\nData travels as tiny packets — like cutting a letter into puzzle pieces and sending them separately!\n\nThe Internet connects billions of computers worldwide! 🌍`,
    quiz: {
      question: "What does a server do on the internet?",
      options: ["Plays games", "Sends data back to you", "Takes photos", "Makes sound"],
      correct: 1,
    },
  },
  {
    id: "debugging",
    emoji: "🐛",
    title: "Debugging — Fixing Mistakes",
    color: "#dc2626",
    bg: "#fef2f2",
    border: "#fca5a5",
    content: `Bugs are mistakes in code that make programs go wrong! 🐛\n\nWhy do we call them bugs? In 1947, a real moth got stuck in a computer and broke it! The engineers wrote "First actual case of bug being found" 😄\n\nDebugging means finding and fixing those mistakes:\n1. Run the program 🚀\n2. See what goes wrong ❌\n3. Find the mistake 🔍\n4. Fix it ✅\n5. Test again! 🔄\n\nEven expert programmers debug code every day!`,
    quiz: {
      question: "What does 'debugging' mean in programming?",
      options: ["Adding insects", "Finding and fixing errors", "Writing new code", "Deleting programs"],
      correct: 1,
    },
  },
  {
    id: "datatypes",
    emoji: "🏷️",
    title: "Data Types — Kinds of Information",
    color: "#059669",
    bg: "#ecfdf5",
    border: "#6ee7b7",
    content: `Computers store different KINDS of information! 🏷️\n\nMain data types:\n• Number: 42, 3.14, -7 🔢\n• Text (String): "Hello", "Cat" 📝\n• True/False (Boolean): true, false ✅❌\n• List (Array): [1, 2, 3, 4, 5] 📋\n\nWhy does it matter? You can add numbers but not words:\n• 5 + 3 = 8 ✅\n• "Hello" + 3 = Error! ❌\n\nPicking the right data type keeps your program working!`,
    quiz: {
      question: "Which data type stores True or False values?",
      options: ["Number", "String", "Boolean", "Array"],
      correct: 2,
    },
  },
  {
    id: "sorting",
    emoji: "🔢",
    title: "Sorting — Putting Things in Order",
    color: "#db2777",
    bg: "#fdf2f8",
    border: "#f9a8d4",
    content: `Sorting means putting things in order — and computers do it millions of times a day! 🔢\n\nImagine sorting playing cards:\n1. Look at two cards 👀\n2. Swap them if they're in the wrong order 🔄\n3. Repeat until all cards are sorted! ✅\n\nThis is called Bubble Sort!\n\nComputers use sorting to:\n• Show search results by relevance 🔍\n• Display prices from low to high 💰\n• Arrange your music playlist 🎵\n\nFaster sorting = faster apps!`,
    quiz: {
      question: "What does a sorting algorithm do?",
      options: ["Deletes data", "Puts data in order", "Copies files", "Creates graphics"],
      correct: 1,
    },
  },
];

const QuizCard = ({ quiz }: { quiz: Lesson["quiz"] }) => {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div
      className="mt-4 p-4 rounded-2xl"
      style={{ backgroundColor: "rgba(255,255,255,0.7)" }}
    >
      <p className="font-black text-gray-800 mb-3">🧠 Quiz: {quiz.question}</p>
      <div className="grid grid-cols-2 gap-2">
        {quiz.options.map((opt, i) => {
          const isCorrect = i === quiz.correct;
          const isSelected = i === selected;
          const answered = selected !== null;
          let bg = "white";
          let border = "#e5e7eb";
          let textColor = "#374151";
          if (answered) {
            if (isCorrect) {
              bg = "#dcfce7";
              border = "#22c55e";
              textColor = "#166534";
            } else if (isSelected) {
              bg = "#fee2e2";
              border = "#ef4444";
              textColor = "#991b1b";
            } else {
              bg = "#f9fafb";
              textColor = "#9ca3af";
            }
          }
          return (
            <motion.button
              key={i}
              whileHover={!answered ? { scale: 1.03 } : {}}
              whileTap={!answered ? { scale: 0.97 } : {}}
              onClick={() => !answered && setSelected(i)}
              className="p-3 rounded-xl text-sm font-bold text-left border-2 transition-all"
              style={{
                backgroundColor: bg,
                borderColor: border,
                color: textColor,
                cursor: answered ? "default" : "pointer",
              }}
            >
              {answered && isCorrect && (
                <CheckCircle2 className="inline w-4 h-4 mr-1" />
              )}
              {answered && isSelected && !isCorrect && (
                <XCircle className="inline w-4 h-4 mr-1" />
              )}
              {opt}
            </motion.button>
          );
        })}
      </div>
      {selected !== null && (
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 text-sm font-bold text-center"
          style={{ color: selected === quiz.correct ? "#166534" : "#991b1b" }}
        >
          {selected === quiz.correct
            ? "🎉 Correct! Great job!"
            : `❌ Not quite — the answer is: ${quiz.options[quiz.correct]}`}
        </motion.p>
      )}
    </div>
  );
};

export default function LearnCSPage() {
  const [open, setOpen] = useState<string | null>("computer");

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <h1 className="text-4xl font-black" style={{ color: "#4f46e5" }}>
          💻 Learn Computer Science
        </h1>
        <p className="text-lg font-bold text-gray-600">
          Click on a topic to learn and take a quiz! 🎯
        </p>
      </motion.div>

      <div className="space-y-4">
        {LESSONS.map((lesson, i) => (
          <motion.div
            key={lesson.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="rounded-2xl border-4 overflow-hidden shadow-md"
            style={{ borderColor: lesson.border }}
          >
            <button
              onClick={() => setOpen(open === lesson.id ? null : lesson.id)}
              className="w-full flex items-center justify-between p-5 text-left font-black text-xl"
              style={{ backgroundColor: lesson.bg, color: lesson.color }}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{lesson.emoji}</span>
                {lesson.title}
              </div>
              {open === lesson.id ? (
                <ChevronUp className="w-6 h-6 flex-shrink-0" />
              ) : (
                <ChevronDown className="w-6 h-6 flex-shrink-0" />
              )}
            </button>

            <AnimatePresence>
              {open === lesson.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                  style={{ backgroundColor: lesson.bg }}
                >
                  <div className="px-6 pb-6">
                    <pre className="text-gray-700 font-bold text-sm leading-7 whitespace-pre-wrap font-sans">
                      {lesson.content}
                    </pre>
                    <QuizCard quiz={lesson.quiz} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center p-6 rounded-2xl border-4 font-black text-lg"
        style={{
          backgroundColor: "#fef3c7",
          borderColor: "#fbbf24",
          color: "#92400e",
        }}
      >
        🏆 Complete all lessons to become a Computer Science Champion! 🏆
      </motion.div>
    </div>
  );
}
