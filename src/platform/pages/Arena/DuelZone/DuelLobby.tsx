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
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black flex items-center gap-3">
            <Sword className="w-8 h-8 text-red-500" /> Duel Zone
          </h1>
          <p className="text-gray-500 font-medium">Join an open lobby or challenge someone to a code race.</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-6 py-3 rounded-2xl bg-indigo-600 text-white font-black shadow-lg shadow-indigo-500/20 hover:scale-105 transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Create New Duel
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Lobbies List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <Users className="w-4 h-4" /> Open Lobbies ({rooms.length})
            </h2>
            <div className="flex items-center gap-2 text-[10px] font-black text-green-500 uppercase tracking-tighter bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full border border-green-200 dark:border-green-800">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Live Updates
            </div>
          </div>

          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="card p-6 h-32 animate-pulse bg-gray-100 dark:bg-gray-800 border-none" />
                ))
              ) : rooms.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="card p-12 text-center border-dashed border-2 flex flex-col items-center gap-4"
                >
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-2xl">🌵</div>
                  <div className="space-y-1">
                    <p className="font-bold text-gray-800 dark:text-white">The arena is quiet...</p>
                    <p className="text-xs text-gray-500">No open duels found. Why not start one yourself?</p>
                  </div>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="btn-primary py-2 text-xs"
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
                    className="card p-5 group hover:border-indigo-500 transition-all cursor-pointer"
                    onClick={() => room.creatorId !== user?.uid && handleJoinRoom(room.id)}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                          ⚔️
                        </div>
                        <div>
                          <div className="text-xs font-black text-indigo-500 uppercase tracking-tighter mb-0.5">
                            {room.challengeTitle}
                          </div>
                          <h3 className="font-bold text-gray-800 dark:text-white">
                            {room.creatorName}'s Duel
                          </h3>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <div className="hidden sm:block text-right">
                          <div className="text-[10px] font-black text-gray-400 uppercase">Wait Time</div>
                          <div className="text-xs font-bold text-gray-700 dark:text-gray-300">
                            {Math.floor((Date.now() - (room.createdAt?.toMillis?.() || Date.now())) / 1000 / 60)}m ago
                          </div>
                        </div>
                        {room.creatorId === user?.uid ? (
                          <span className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-400 text-xs font-black">
                            Waiting...
                          </span>
                        ) : (
                          <button className="px-6 py-2 rounded-xl bg-indigo-600 text-white font-black text-sm shadow-md group-hover:bg-indigo-500 transition-all flex items-center gap-2">
                            Enter Arena <Zap className="w-3.5 h-3.5 fill-current" />
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
        <div className="space-y-6">
          <section className="card p-6 bg-gradient-to-br from-indigo-600 to-purple-700 text-white border-none">
            <h2 className="text-lg font-black mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" /> Your Standing
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div className="text-3xl font-black">1,000</div>
                <div className="text-[10px] font-black opacity-60 uppercase tracking-widest">Rating</div>
              </div>
              <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="w-1/3 h-full bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <div className="text-lg font-black">0</div>
                  <div className="text-[10px] font-black opacity-60 uppercase">Matches</div>
                </div>
                <div>
                  <div className="text-lg font-black">0%</div>
                  <div className="text-[10px] font-black opacity-60 uppercase">Win Rate</div>
                </div>
              </div>
            </div>
          </section>

          <section className="card p-5 space-y-4">
            <h3 className="font-black text-sm flex items-center gap-2">
              <Play className="w-4 h-4 text-green-500 fill-current" /> Pro Tips
            </h3>
            <ul className="space-y-3">
              {[
                'The timer starts immediately after someone joins.',
                'A single mistake can cost you the match.',
                'Use hints wisely—they add a 5s time penalty!',
              ].map((tip, i) => (
                <li key={i} className="text-xs font-medium text-gray-500 dark:text-gray-400 flex gap-2">
                  <span className="text-indigo-500">•</span> {tip}
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
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl bg-white dark:bg-gray-950 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b flex items-center justify-between">
                <h2 className="text-xl font-black">Select a Challenge</h2>
                <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 border-b">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by title or language..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-xl pl-10 pr-4 py-2 text-sm font-medium focus:ring-2 ring-indigo-500 transition-all"
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
                      className="w-full p-4 rounded-2xl border-2 border-transparent hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 text-left transition-all group flex items-center justify-between"
                    >
                      <div>
                        <div className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{challenge.language} • {challenge.difficulty}</div>
                        <div className="font-bold text-gray-800 dark:text-white group-hover:text-indigo-600 transition-colors">{challenge.title}</div>
                      </div>
                      <div className="text-xs font-black text-gray-400">+{challenge.xp} XP</div>
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
