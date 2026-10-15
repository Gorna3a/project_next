'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Timer, CheckCircle2, XCircle, 
  Lightbulb, User, Ghost, Hourglass, Trophy, Skull
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
      <div
        className="grid place-items-center animate-pulse"
        style={{ width: 72, height: 72, backgroundColor: 'var(--border)', border: '4px solid var(--border)' }}
      >
        <Timer style={{ width: 30, height: 30, color: 'var(--phosphor)' }} className="animate-spin" />
      </div>
      <p style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 11, color: 'var(--muted)' }}>PREPARING ARENA...</p>
    </div>
  );

  const opponentName = isCreator ? (room.opponentName || 'Waiting...') : room.creatorName;
  const opponentStatus = isCreator ? room.opponentStatus : room.creatorStatus;
  const myStatus = isCreator ? room.creatorStatus : room.opponentStatus;
  const isWinner = room.winnerId === user?.uid;
  const isGameOver = room.status === 'finished';

  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-20">
      {/* Duel Header / Status Bar */}
      <div
        className="sticky top-[120px] z-30 p-4"
        style={{ backgroundColor: 'var(--surface)', border: '4px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}
      >
        <div className="flex items-center justify-between gap-4">
          {/* My Stats */}
          <div className="flex items-center gap-3">
            <div
              className="grid place-items-center"
              style={{ width: 42, height: 42, backgroundColor: 'var(--phosphor)', border: '3px solid var(--border)', flexShrink: 0 }}
            >
              <User style={{ width: 20, height: 20, color: '#000' }} />
            </div>
            <div>
              <div className="mono text-[10px] font-black uppercase" style={{ color: 'var(--phosphor-dark)' }}>You</div>
              <div className="text-sm font-black truncate max-w-[100px]" style={{ color: 'var(--fg)' }}>{profile?.displayName}</div>
            </div>
          </div>

          {/* VS & Timer */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-3 flex-wrap justify-center">
              <span
                className="mono text-[10px] font-black uppercase tracking-widest px-2 py-1"
                style={{
                  backgroundColor: myStatus === 'finished' ? '#22c55e' : 'var(--surface-2)',
                  color: myStatus === 'finished' ? '#000' : 'var(--muted)',
                  border: '3px solid var(--border)',
                }}
              >
                {myStatus === 'finished' ? 'DONE!' : 'Racing'}
              </span>
              <div className="text-2xl font-black tabular-nums flex items-center gap-2" style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 16, color: 'var(--fg)' }}>
                <Timer style={{ width: 16, height: 16, color: duelTime > 30 ? 'var(--orange)' : 'var(--phosphor-dark)' }} className={duelTime > 30 ? 'animate-pulse' : ''} />
                {Math.floor(duelTime / 60)}:{(duelTime % 60).toString().padStart(2, '0')}
              </div>
              <span
                className="mono text-[10px] font-black uppercase tracking-widest px-2 py-1"
                style={{
                  backgroundColor: opponentStatus === 'finished' ? 'var(--orange)' : 'var(--surface-2)',
                  color: '#000',
                  border: '3px solid var(--border)',
                }}
              >
                {opponentStatus === 'finished' ? 'FINISHED' : 'Thinking'}
              </span>
            </div>
            {isGameOver && (
              <div className="mt-2 animate-bounce" style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 10, color: 'var(--amber)' }}>
                {isWinner ? 'YOU WON!' : 'DEFEAT'}
              </div>
            )}
          </div>

          {/* Opponent Stats */}
          <div className="flex items-center gap-3 text-right">
            <div>
              <div className="mono text-[10px] font-black uppercase" style={{ color: 'var(--orange)' }}>Opponent</div>
              <div className="text-sm font-black truncate max-w-[100px]" style={{ color: 'var(--fg)' }}>{opponentName}</div>
            </div>
            <div
              className="grid place-items-center"
              style={{ width: 42, height: 42, backgroundColor: 'var(--orange)', border: '3px solid var(--border)', flexShrink: 0 }}
            >
              <Ghost style={{ width: 20, height: 20, color: '#000' }} />
            </div>
          </div>
        </div>

        {/* Progress Bars */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div style={{ height: 12, backgroundColor: 'var(--surface-2)', border: '3px solid var(--border)', padding: 2, display: 'flex' }}>
            <motion.div 
              className="h-full"
              style={{ backgroundColor: 'var(--phosphor)' }}
              initial={{ width: 0 }}
              animate={{ width: myStatus === 'finished' ? '100%' : '50%' }}
            />
          </div>
          <div style={{ height: 12, backgroundColor: 'var(--surface-2)', border: '3px solid var(--border)', padding: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <motion.div 
              className="h-full"
              style={{ backgroundColor: 'var(--orange)' }}
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
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}
          >
            <div className="text-center">
              <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 100, color: 'var(--phosphor)', lineHeight: 1 }}>{countdown}</div>
              <div className="mono text-sm font-black uppercase tracking-widest mt-4" style={{ color: 'var(--surface)' }}>Get Ready!</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {room.status === 'waiting' && (
        <div className="panel p-12 text-center space-y-6">
          <div
            className="mx-auto grid place-items-center animate-bounce"
            style={{ width: 80, height: 80, backgroundColor: 'var(--surface-2)', border: '4px solid var(--border)' }}
          >
            <Hourglass style={{ width: 34, height: 34, color: 'var(--phosphor-dark)' }} />
          </div>
          <div className="space-y-2">
            <h2 style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 16, color: 'var(--fg)' }}>Waiting for Opponent...</h2>
            <p className="mono text-xs font-bold max-w-sm mx-auto" style={{ color: 'var(--muted)' }}>
              You are the host of this duel. Once a challenger joins, the race will begin automatically!
            </p>
          </div>
          <div className="flex justify-center gap-3 flex-wrap">
            <button onClick={() => navigate.push('/app/arena/duels')} className="big-btn !w-auto px-5">Cancel Duel</button>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert('Room link copied!');
              }} 
              className="big-btn yellow !w-auto px-5"
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
          className="space-y-4"
        >
          {/* Challenge Player */}
          <div className="panel">
            <div className="panel-head">
              <span>{challenge.difficulty} • {challenge.language}</span>
              <span>+{challenge.xp} XP</span>
            </div>
            <div className="p-5 space-y-3" style={{ backgroundColor: 'var(--surface)' }}>
              <h1 className="text-xl font-black" style={{ color: 'var(--fg)' }}>{challenge.title}</h1>
              <p className="text-sm font-medium leading-relaxed" style={{ color: 'var(--muted)' }}>{challenge.description}</p>
            </div>
          </div>

          <div className="grid gap-3">
            {Object.entries(challenge.options).map(([key, value]) => {
              const isSelected = selected === key;
              const isCorrect = key === challenge.correctAnswer;
              
              let bg: string = 'var(--surface)';
              let border = 'var(--border)';
              let textColor = 'var(--fg)';
              let shadow = 'var(--shadow-sm)';
              if (answered) {
                if (isCorrect) { bg = 'rgba(34,197,94,0.12)'; border = '#22c55e'; textColor = '#22c55e'; }
                else if (isSelected) { bg = 'rgba(239,68,68,0.12)'; border = '#ef4444'; textColor = '#ef4444'; }
                else { textColor = 'var(--muted)'; shadow = 'none'; }
              }

              return (
                <button
                  key={key}
                  disabled={answered || isGameOver}
                  onClick={() => handleSelect(key)}
                  className="w-full p-4 text-left transition-all flex items-center gap-4"
                  style={{ backgroundColor: bg, border: `4px solid ${border}`, boxShadow: shadow, color: textColor }}
                >
                  <span
                    className="grid place-items-center font-black text-sm mono"
                    style={{ width: 32, height: 32, border: `3px solid ${border}`, flexShrink: 0 }}
                  >
                    {String.fromCharCode(65 + parseInt(key))}
                  </span>
                  <pre className="font-mono text-sm whitespace-pre-wrap flex-1">{value as string}</pre>
                  <div className="ml-auto flex-shrink-0">
                    {answered && isCorrect && <CheckCircle2 style={{ width: 22, height: 22, color: '#22c55e' }} />}
                    {answered && isSelected && !isCorrect && <XCircle style={{ width: 22, height: 22, color: '#ef4444' }} />}
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
                className="badge !py-2 !px-4"
              >
                <Lightbulb style={{ width: 14, height: 14, color: 'var(--amber)' }} />
                {loadingHint ? 'Thinking...' : 'Get Hint (+5s Penalty)'}
              </button>
            </div>
          )}

          {showHint && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-4 mono text-xs font-bold"
              style={{ backgroundColor: 'var(--surface)', border: '4px solid var(--amber)', boxShadow: 'var(--shadow-sm)', color: 'var(--fg)' }}
            >
              HINT: {hint}
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="panel p-10 max-w-sm w-full text-center space-y-6"
            >
              <div className="flex justify-center">
                {isWinner
                  ? <Trophy style={{ width: 56, height: 56, color: 'var(--amber)' }} />
                  : <Skull style={{ width: 56, height: 56, color: 'var(--muted)' }} />}
              </div>
              <div>
                <h2 style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 20, color: 'var(--fg)', marginBottom: 8 }}>{isWinner ? 'VICTORY!' : 'DEFEAT'}</h2>
                <p className="mono text-xs font-bold" style={{ color: 'var(--muted)' }}>
                  {isWinner 
                    ? `You outcoded ${opponentName} in ${duelTime} seconds!` 
                    : `${opponentName} was faster this time...`}
                </p>
              </div>
              
              <div className="grid grid-cols-2" style={{ border: '4px solid var(--border)' }}>
                <div className="p-4" style={{ borderRight: '4px solid var(--border)' }}>
                  <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 18, color: 'var(--phosphor-dark)' }}>+{isWinner ? '25' : '0'}</div>
                  <div className="mono text-[10px] font-black uppercase" style={{ color: 'var(--muted)' }}>Rating</div>
                </div>
                <div className="p-4" style={{ backgroundColor: 'var(--surface-2)' }}>
                  <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 18, color: 'var(--amber)' }}>+{isWinner ? challenge.xp : '10'}</div>
                  <div className="mono text-[10px] font-black uppercase" style={{ color: 'var(--muted)' }}>XP</div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button onClick={() => navigate.push('/app/arena/duels')} className="big-btn green w-full justify-center">Back to Lobby</button>
                <button onClick={() => navigate.push('/app/arena/rankings')} className="big-btn w-full justify-center">View Leaderboard</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
