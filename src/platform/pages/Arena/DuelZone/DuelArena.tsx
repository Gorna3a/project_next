'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Timer, CheckCircle2, XCircle, 
  Lightbulb 
} from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../core/firebase/config';
import { useAuth } from '../../../../core/context/AuthContext';
import { duelService, type DuelRoom } from './duelService';
import { generateHint } from '../../../../core/services/ai';

export default function DuelArena() {
  const params = useParams();
  const roomId = params.roomId as string;
  const { user, profile } = useAuth();
  const navigate = useRouter();

  const [room, setRoom] = useState<DuelRoom | null>(null);
  const [challenge, setChallenge] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [duelTime, setDuelTime] = useState(0);
  const [, setShowResult] = useState(false);
  
  const [hint, setHint] = useState('');
  const [loadingHint, setLoadingHint] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const isCreator = room?.creatorId === user?.uid;

  // ── Sync Duel Room ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!roomId) return;
    const unsubscribe = duelService.subscribeToRoom(roomId, (updatedRoom) => {
      setRoom(updatedRoom);
      
      // Handle Start Countdown
      if (updatedRoom.status === 'ongoing' && !updatedRoom.startTime && countdown === null) {
        setCountdown(3);
      }
    });
    return () => unsubscribe();
  }, [roomId]);

  // ── Fetch Challenge ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!room?.challengeId) return;
    const loadChallenge = async () => {
      const snap = await getDoc(doc(db, 'challenges', room.challengeId));
      if (snap.exists()) {
        setChallenge(snap.data());
      }
      setLoading(false);
    };
    loadChallenge();
  }, [room?.challengeId]);

  // ── Countdown Timer ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (countdown === null) return;
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // ── Duel Clock ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (room?.status === 'ongoing' && countdown === 0) {
      const timer = setInterval(() => setDuelTime(prev => prev + 1), 1000);
      return () => clearInterval(timer);
    }
  }, [room?.status, countdown]);

  const handleSelect = async (key: string) => {
    if (answered || !challenge || !roomId || !user) return;
    setSelected(key);
    setAnswered(true);

    if (key === challenge.correctAnswer) {
      // Finished correctly!
      await duelService.updateStatus(roomId, isCreator, 'finished');
      await duelService.finishDuel(roomId, user.uid);
      setShowResult(true);
    } else {
      // Wrong answer
      await duelService.updateStatus(roomId, isCreator, 'answered');
    }
  };

  const handleGetHint = async () => {
    if (!challenge || loadingHint || !roomId || !user) return;
    setLoadingHint(true);
    setShowHint(true);
    // Add time penalty for hints
    setDuelTime(prev => prev + 5); 
    try {
      const aiHint = challenge.hint || await generateHint(challenge.title, Object.values(challenge.options));
      setHint(aiHint);
    } catch {
      setHint('Think carefully!');
    } finally {
      setLoadingHint(false);
    }
  };

  if (loading || !room || !challenge) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      <p className="font-black text-gray-500 animate-pulse">PREPARING ARENA...</p>
    </div>
  );

  const opponentName = isCreator ? (room.opponentName || 'Waiting...') : room.creatorName;
  const opponentStatus = isCreator ? room.opponentStatus : room.creatorStatus;
  const myStatus = isCreator ? room.creatorStatus : room.opponentStatus;
  const isWinner = room.winnerId === user?.uid;
  const isGameOver = room.status === 'finished';

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Duel Header / Status Bar */}
      <div className="sticky top-[120px] z-30 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md rounded-2xl border-2 border-gray-100 dark:border-gray-800 p-4 shadow-xl">
        <div className="flex items-center justify-between gap-4">
          {/* My Stats */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-lg">👤</div>
            <div>
              <div className="text-[10px] font-black text-indigo-500 uppercase">You</div>
              <div className="text-sm font-bold truncate max-w-[100px]">{profile?.displayName}</div>
            </div>
          </div>

          {/* VS & Timer */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-4">
              <div className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest transition-all ${myStatus === 'finished' ? 'bg-green-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                {myStatus === 'finished' ? 'DONE!' : 'Racing'}
              </div>
              <div className="text-2xl font-black text-gray-800 dark:text-white tabular-nums flex items-center gap-2">
                <Timer className={`w-5 h-5 ${duelTime > 30 ? 'text-red-500 animate-pulse' : 'text-indigo-500'}`} />
                {Math.floor(duelTime / 60)}:{(duelTime % 60).toString().padStart(2, '0')}
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest transition-all ${opponentStatus === 'finished' ? 'bg-red-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                {opponentStatus === 'finished' ? 'FINISHED' : 'Thinking'}
              </div>
            </div>
            {isGameOver && (
              <div className="mt-2 text-xs font-black text-amber-500 uppercase animate-bounce">
                {isWinner ? '🎉 YOU WON!' : '💀 DEFEAT'}
              </div>
            )}
          </div>

          {/* Opponent Stats */}
          <div className="flex items-center gap-3 text-right">
            <div>
              <div className="text-[10px] font-black text-red-500 uppercase">Opponent</div>
              <div className="text-sm font-bold truncate max-w-[100px]">{opponentName}</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-lg">👺</div>
          </div>
        </div>

        {/* Progress Bars */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-indigo-500"
              initial={{ width: 0 }}
              animate={{ width: myStatus === 'finished' ? '100%' : '50%' }}
            />
          </div>
          <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden flex justify-end">
            <motion.div 
              className="h-full bg-red-500"
              initial={{ width: 0 }}
              animate={{ width: opponentStatus === 'finished' ? '100%' : '50%' }}
            />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {countdown !== null && countdown > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 2 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/80 backdrop-blur-xl"
          >
            <div className="text-center">
              <div className="text-[100px] font-black text-white leading-none">{countdown}</div>
              <div className="text-xl font-black text-indigo-400 uppercase tracking-widest mt-4">Get Ready!</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {room.status === 'waiting' && (
        <div className="card p-12 text-center space-y-6">
          <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-4xl mx-auto animate-bounce">⏳</div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black">Waiting for Opponent...</h2>
            <p className="text-gray-500 font-medium max-w-sm mx-auto">
              You are the host of this duel. Once a challenger joins, the race will begin automatically!
            </p>
          </div>
          <div className="flex justify-center gap-3">
            <button onClick={() => navigate.push('/app/arena/duels')} className="btn-secondary">Cancel Duel</button>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert('Room link copied!');
              }} 
              className="btn-primary"
            >
              Copy Invite Link
            </button>
          </div>
        </div>
      )}

      {(room.status === 'ongoing' || room.status === 'finished') && (countdown === 0 || countdown === null) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Challenge Player */}
          <div className="card p-6 space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-black border border-indigo-100 uppercase">
                {challenge.difficulty}
              </span>
              <span className="text-xs font-bold text-gray-400">{challenge.language}</span>
            </div>
            <h1 className="text-2xl font-black">{challenge.title}</h1>
            <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed">{challenge.description}</p>
          </div>

          <div className="grid gap-3">
            {Object.entries(challenge.options).map(([key, value]) => {
              const isSelected = selected === key;
              const isCorrect = key === challenge.correctAnswer;
              
              let styles = "border-gray-100 dark:border-gray-800 hover:border-indigo-500";
              if (answered) {
                if (isCorrect) styles = "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 ring-2 ring-green-500";
                else if (isSelected) styles = "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700";
                else styles = "opacity-50 border-gray-100";
              }

              return (
                <button
                  key={key}
                  disabled={answered || isGameOver}
                  onClick={() => handleSelect(key)}
                  className={`w-full p-5 rounded-2xl border-2 text-left transition-all flex items-center gap-4 ${styles}`}
                >
                  <span className="w-8 h-8 rounded-full border-2 flex items-center justify-center font-black text-sm">
                    {String.fromCharCode(65 + parseInt(key))}
                  </span>
                  <pre className="font-mono text-sm whitespace-pre-wrap">{value as string}</pre>
                  <div className="ml-auto">
                    {answered && isCorrect && <CheckCircle2 className="w-6 h-6 text-green-500" />}
                    {answered && isSelected && !isCorrect && <XCircle className="w-6 h-6 text-red-500" />}
                  </div>
                </button>
              );
            })}
          </div>

          {!answered && !isGameOver && (
            <div className="flex justify-center">
               <button
                onClick={handleGetHint}
                disabled={loadingHint}
                className="btn-ghost text-xs flex items-center gap-2"
              >
                <Lightbulb className="w-4 h-4 text-yellow-500" />
                {loadingHint ? 'Thinking...' : 'Get Hint (+5s Penalty)'}
              </button>
            </div>
          )}

          {showHint && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 text-sm font-medium text-amber-700">
              💡 {hint}
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Result Modal */}
      <AnimatePresence>
        {isGameOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="card p-10 max-w-sm w-full text-center space-y-6 shadow-2xl"
            >
              <div className="text-7xl">{isWinner ? '🏆' : '💀'}</div>
              <div>
                <h2 className="text-3xl font-black mb-2">{isWinner ? 'VICTORY!' : 'DEFEAT'}</h2>
                <p className="text-gray-500 font-bold">
                  {isWinner 
                    ? `You outcoded ${opponentName} in ${duelTime} seconds!` 
                    : `${opponentName} was faster this time...`}
                </p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-4 flex justify-around">
                <div>
                  <div className="text-2xl font-black text-indigo-500">+{isWinner ? '25' : '0'}</div>
                  <div className="text-[10px] font-black text-gray-400 uppercase">Rating</div>
                </div>
                <div className="w-px bg-gray-200 dark:bg-gray-800" />
                <div>
                  <div className="text-2xl font-black text-amber-500">+{isWinner ? challenge.xp : '10'}</div>
                  <div className="text-[10px] font-black text-gray-400 uppercase">XP</div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button onClick={() => navigate.push('/app/arena/duels')} className="btn-primary w-full justify-center">Back to Lobby</button>
                <button onClick={() => navigate.push('/app/arena/rankings')} className="btn-secondary w-full justify-center">View Leaderboard</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
