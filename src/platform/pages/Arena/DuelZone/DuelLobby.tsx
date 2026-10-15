'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sword, Users, Plus, Zap, Trophy, X, Search, Play } from 'lucide-react';
import { useRouter } from "next/navigation";
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../../core/firebase/config';
import { useAuth } from '../../../../core/context/AuthContext';
import { duelService, type DuelRoom } from './duelService';

export default function DuelLobby() {
  const { user, profile } = useAuth();
  const navigate = useRouter();
  const [rooms, setRooms] = useState<DuelRoom[]>([]);
  const [challenges, setChallenges] = useState<any[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to open rooms
    const unsubscribe = duelService.subscribeToOpenRooms((updatedRooms) => {
      setRooms(updatedRooms);
      setLoading(false);
    });

    // Load available challenges for room creation
    const loadChallenges = async () => {
      const snap = await getDocs(collection(db, 'challenges'));
      setChallenges(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    loadChallenges();

    return () => unsubscribe();
  }, []);

  const handleCreateRoom = async (challengeId: string, challengeTitle: string) => {
    if (!user) return;
    try {
      const roomId = await duelService.createRoom(
        challengeId, 
        challengeTitle, 
        user.uid, 
        profile?.displayName || 'Anonymous Gladiator'
      );
      setShowCreateModal(false);
      navigate.push(`/app/arena/duels/${roomId}`);
    } catch (e) {
      console.error('Failed to create room:', e);
    }
  };

  const handleJoinRoom = async (roomId: string) => {
    if (!user) return;
    try {
      await duelService.joinRoom(
        roomId, 
        user.uid, 
        profile?.displayName || 'Anonymous Challenger'
      );
      navigate.push(`/app/arena/duels/${roomId}`);
    } catch (e) {
      console.error('Failed to join room:', e);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1
            className="flex items-center gap-3 mb-2"
            style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 20, color: 'var(--fg)' }}
          >
            <Sword style={{ width: 26, height: 26, color: 'var(--orange)' }} /> Duel Zone
          </h1>
          <p className="mono text-[11px] font-bold" style={{ color: 'var(--muted)' }}>Join an open lobby or challenge someone to a code race.</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="big-btn inline-flex items-center gap-2 !w-auto px-6"
          style={{ backgroundColor: 'var(--border)', color: 'var(--phosphor)' }}
        >
          <Plus style={{ width: 14, height: 14 }} /> Create New Duel
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Lobbies List */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="section-label !mb-0">
              <span className="inline-flex items-center gap-2">
                <Users style={{ width: 12, height: 12 }} /> Open Lobbies ({rooms.length})
              </span>
            </span>
            <div className="badge">
              <span className="dot" style={{ backgroundColor: '#22c55e', borderColor: 'var(--border)' }} /> Live Updates
            </div>
          </div>

          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="panel p-6 h-28 animate-pulse" style={{ backgroundColor: 'var(--surface-2)' }} />
                ))
              ) : rooms.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="panel p-12 text-center flex flex-col items-center gap-4"
                  style={{ borderStyle: 'dashed' }}
                >
                  <div
                    className="grid place-items-center text-2xl"
                    style={{ width: 64, height: 64, backgroundColor: 'var(--surface-2)', border: '3px solid var(--border)' }}
                  >
                    🌵
                  </div>
                  <div className="space-y-1">
                    <p className="font-black" style={{ color: 'var(--fg)' }}>The arena is quiet...</p>
                    <p className="mono text-[11px] font-bold" style={{ color: 'var(--muted)' }}>No open duels found. Why not start one yourself?</p>
                  </div>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="big-btn green !w-auto px-5 text-xs"
                  >
                    Host a Duel
                  </button>
                </motion.div>
              ) : (
                rooms.map((room) => (
                  <motion.div
                    key={room.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="panel p-4 cursor-pointer group"
                    onClick={() => room.creatorId !== user?.uid && handleJoinRoom(room.id)}
                  >
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      <div className="flex items-center gap-3">
                        <div
                          className="grid place-items-center text-xl group-hover:-rotate-6 transition-transform"
                          style={{ width: 46, height: 46, backgroundColor: 'var(--border)', border: '3px solid var(--border)', flexShrink: 0 }}
                        >
                          <span style={{ color: 'var(--phosphor)', fontSize: 20 }}>⚔</span>
                        </div>
                        <div>
                          <div className="mono text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--phosphor-dark)' }}>
                            {room.challengeTitle}
                          </div>
                          <h3 className="font-black" style={{ color: 'var(--fg)' }}>
                            {room.creatorName}&apos;s Duel
                          </h3>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="hidden sm:block text-right">
                          <div className="mono text-[9px] font-black uppercase" style={{ color: 'var(--muted)' }}>Wait Time</div>
                          <div className="mono text-xs font-bold" style={{ color: 'var(--fg)' }}>
                            {Math.floor((Date.now() - (room.createdAt?.toMillis?.() || Date.now())) / 1000 / 60)}m ago
                          </div>
                        </div>
                        {room.creatorId === user?.uid ? (
                          <span className="badge">Waiting...</span>
                        ) : (
                          <button className="big-btn yellow !w-auto px-5 inline-flex items-center gap-2 text-xs">
                            Enter Arena <Zap style={{ width: 13, height: 13 }} />
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Sidebar: Personal Stats & Tips */}
        <div className="space-y-4">
          <section className="mini" style={{ backgroundColor: 'var(--phosphor)' }}>
            <div className="w-full z-[1]">
              <h2 className="font-black mb-4 flex items-center gap-2" style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 10, color: '#000' }}>
                <Trophy style={{ width: 14, height: 14 }} /> Your Standing
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 22, color: '#000' }}>1,000</div>
                  <div className="mono text-[10px] font-black uppercase tracking-widest" style={{ color: '#000', opacity: 0.6 }}>Rating</div>
                </div>
                <div style={{ height: 14, border: '3px solid #000', backgroundColor: 'var(--surface-2)', padding: 2, display: 'flex' }}>
                  <div style={{ width: '33%', backgroundColor: '#000' }} />
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 14, color: '#000' }}>0</div>
                    <div className="mono text-[10px] font-black uppercase" style={{ color: '#000', opacity: 0.6 }}>Matches</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 14, color: '#000' }}>0%</div>
                    <div className="mono text-[10px] font-black uppercase" style={{ color: '#000', opacity: 0.6 }}>Win Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="panel p-5">
            <div className="panel-head -m-5 mb-4">
              <span className="inline-flex items-center gap-2">
                <Play style={{ width: 12, height: 12 }} /> Pro Tips
              </span>
            </div>
            <ul className="space-y-3">
              {[
                'The timer starts immediately after someone joins.',
                'A single mistake can cost you the match.',
                'Use hints wisely—they add a 5s time penalty!',
              ].map((tip, i) => (
                <li key={i} className="mono text-[11px] font-bold flex gap-2" style={{ color: 'var(--muted)' }}>
                  <span style={{ color: 'var(--phosphor-dark)' }}>▪</span> {tip}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      {/* Create Room Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreateModal(false)}
              className="absolute inset-0"
              style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]"
              style={{ backgroundColor: 'var(--surface)', border: '4px solid var(--border)', boxShadow: 'var(--shadow)' }}
            >
              <div className="p-5 flex items-center justify-between" style={{ borderBottom: '4px solid var(--border)' }}>
                <h2 style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 12, color: 'var(--fg)' }}>Select a Challenge</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="grid place-items-center"
                  style={{ width: 32, height: 32, border: '3px solid var(--border)', backgroundColor: 'var(--surface-2)' }}
                >
                  <X style={{ width: 15, height: 15 }} />
                </button>
              </div>

              <div className="p-4" style={{ borderBottom: '3px solid var(--border)' }}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2" style={{ width: 15, height: 15, color: 'var(--muted)' }} />
                  <input
                    type="text"
                    placeholder="Search by title or language..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 mono text-xs font-bold"
                    style={{ backgroundColor: 'var(--surface-2)', border: '3px solid var(--border)', color: 'var(--fg)', outline: 'none' }}
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                {challenges
                  .filter(c => c.title.toLowerCase().includes(search.toLowerCase()) || c.language.toLowerCase().includes(search.toLowerCase()))
                  .map((challenge) => (
                    <button
                      key={challenge.id}
                      onClick={() => handleCreateRoom(challenge.id, challenge.title)}
                      className="w-full p-3 text-left transition-all group flex items-center justify-between"
                      style={{ border: '3px solid transparent', backgroundColor: 'var(--surface)' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.backgroundColor = 'var(--surface-2)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.backgroundColor = 'var(--surface)'; }}
                    >
                      <div>
                        <div className="mono text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--phosphor-dark)' }}>{challenge.language} • {challenge.difficulty}</div>
                        <div className="font-bold" style={{ color: 'var(--fg)' }}>{challenge.title}</div>
                      </div>
                      <div className="mono text-xs font-black" style={{ color: 'var(--muted)' }}>+{challenge.xp} XP</div>
                    </button>
                  ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
