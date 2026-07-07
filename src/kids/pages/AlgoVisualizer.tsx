'use client';

import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, Info, BarChart2, Search } from "lucide-react";

type AlgoType = "bubble" | "binary";

export const AlgoVisualizer = () => {
  const [algo, setAlgo] = useState<AlgoType>("bubble");
  const [array, setArray] = useState<number[]>([]);
  const [comparing, setComparing] = useState<number[]>([]);
  const [sorted, setSorted] = useState<number[]>([]);
  const [found, setFound] = useState<number | null>(null);
  const [target, setTarget] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(500);
  const isRunningRef = useRef(false);

  const generateArray = useCallback(() => {
    const newArr = Array.from({ length: 12 }, () => Math.floor(Math.random() * 50) + 10);
    setArray(newArr);
    setComparing([]);
    setSorted([]);
    setFound(null);
    setTarget(null);
    setIsRunning(false);
    isRunningRef.current = false;
  }, []);

  const generateSortedArray = useCallback(() => {
    const newArr = Array.from({ length: 15 }, () => Math.floor(Math.random() * 90) + 10).sort((a, b) => a - b);
    setArray(newArr);
    const newTarget = newArr[Math.floor(Math.random() * newArr.length)];
    setTarget(newTarget);
    setComparing([]);
    setFound(null);
    setIsRunning(false);
    isRunningRef.current = false;
  }, []);

  useEffect(() => {
    if (algo === "bubble") generateArray();
    else generateSortedArray();
  }, [algo, generateArray, generateSortedArray]);

  const bubbleSort = async () => {
    const arr = [...array];
    const n = arr.length;
    setIsRunning(true);
    isRunningRef.current = true;

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (!isRunningRef.current) return;
        setComparing([j, j + 1]);
        await new Promise(resolve => setTimeout(resolve, speed));

        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setArray([...arr]);
        }
      }
      setSorted(prev => [...prev, n - i - 1]);
    }
    setSorted(Array.from({ length: n }, (_, i) => i));
    setComparing([]);
    setIsRunning(false);
    isRunningRef.current = false;
  };

  const binarySearch = async () => {
    if (target === null) return;
    const arr = [...array];
    let left = 0;
    let right = arr.length - 1;
    setIsRunning(true);
    isRunningRef.current = true;

    while (left <= right) {
      if (!isRunningRef.current) return;
      const mid = Math.floor((left + right) / 2);
      setComparing([left, right, mid]);
      await new Promise(resolve => setTimeout(resolve, speed * 1.5));

      if (arr[mid] === target) {
        setFound(mid);
        setIsRunning(false);
        isRunningRef.current = false;
        return;
      }

      if (arr[mid] < target) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
    setIsRunning(false);
    isRunningRef.current = false;
  };

  const toggleRun = () => {
    if (isRunning) {
      setIsRunning(false);
      isRunningRef.current = false;
    } else {
      if (algo === "bubble") bubbleSort();
      else binarySearch();
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
            {algo === "bubble" ? <BarChart2 className="w-6 h-6" /> : <Search className="w-6 h-6" />}
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-800 dark:text-white">Algo Visualizer</h2>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">See how computers think!</p>
          </div>
        </div>

        <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-2xl w-fit">
          <button
            onClick={() => { setAlgo("bubble"); setIsRunning(false); isRunningRef.current = false; }}
            className={`px-4 py-2 rounded-xl text-sm font-black transition-all ${algo === "bubble" ? "bg-white dark:bg-gray-700 text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            Bubble Sort
          </button>
          <button
            onClick={() => { setAlgo("binary"); setIsRunning(false); isRunningRef.current = false; }}
            className={`px-4 py-2 rounded-xl text-sm font-black transition-all ${algo === "binary" ? "bg-white dark:bg-gray-700 text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            Binary Search
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-xl border-4 border-gray-100 dark:border-gray-800 space-y-12">
        {/* Visualization Area */}
        <div className="h-64 flex items-end justify-center gap-2 relative">
          {algo === "bubble" ? (
            array.map((val, idx) => {
              const isComp = comparing.includes(idx);
              const isSorted = sorted.includes(idx);
              return (
                <motion.div
                  key={idx}
                  layout
                  className="w-12 rounded-t-xl transition-colors relative group"
                  style={{
                    height: `${val * 3}px`,
                    backgroundColor: isComp ? "#f59e0b" : isSorted ? "#10b981" : "#6366f1",
                  }}
                >
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-black text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    {val}
                  </span>
                </motion.div>
              )
            })
          ) : (
            <div className="w-full flex flex-wrap justify-center gap-1">
              {array.map((val, idx) => {
                // Unused vars removed
                const isMid = idx === comparing[2];
                const isFound = idx === found;
                const isSearching = comparing.length > 0 && idx >= comparing[0] && idx <= comparing[1];

                return (
                  <motion.div
                    key={idx}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-black transition-all border-2
                      ${isFound ? "bg-green-500 text-white border-green-600 scale-125 z-10 shadow-lg" : 
                        isMid ? "bg-amber-500 text-white border-amber-600 scale-110 z-10" : 
                        isSearching ? "bg-blue-100 dark:bg-blue-900/30 border-blue-500 text-blue-700 dark:text-blue-300" : 
                        "bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-400"}`}
                  >
                    {val}
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => algo === "bubble" ? generateArray() : generateSortedArray()}
              className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 hover:bg-gray-200 transition-all"
              title="Shuffle"
            >
              <RotateCcw className="w-6 h-6" />
            </button>
            <button
              onClick={toggleRun}
              className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95
                ${isRunning ? "bg-red-100 text-red-600" : "bg-blue-600 text-white"}`}
            >
              {isRunning ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
            </button>
            <div className="flex flex-col gap-1 w-32">
              <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <span>Speed</span>
                <span>{speed === 1000 ? "Slow" : speed === 500 ? "Med" : "Fast"}</span>
              </div>
              <input
                type="range"
                min="50"
                max="1000"
                step="50"
                value={1050 - speed}
                onChange={(e) => setSpeed(1050 - parseInt(e.target.value))}
                className="accent-blue-600"
              />
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-3xl border-2 border-blue-100 dark:border-blue-900/30 w-full">
            <h4 className="font-black text-blue-700 dark:text-blue-400 text-sm mb-2 flex items-center gap-2">
              <Info className="w-5 h-5" /> What's happening?
            </h4>
            <p className="text-sm text-blue-600 dark:text-blue-300 font-medium leading-relaxed">
              {algo === "bubble" 
                ? "Bubble Sort compares neighbors and 'bubbles' the largest numbers to the end. Watch the yellow bars swap!" 
                : `We are searching for the number ${target}. Binary Search splits the sorted list in half over and over until it finds it!`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
