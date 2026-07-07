'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../core/firebase/config';
import { 
  Trophy, Trash2, Plus, 
  Zap, Loader2, RefreshCw 
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { seedInitialChallenges } from '../../../core/utils/seedChallenges';

export default function ChallengeManager() {
  const [challenges, setChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    fetchChallenges();
  }, []);

  async function fetchChallenges() {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'challenges'));
      setChallenges(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      toast.error('Failed to load challenges');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this challenge?')) return;
    try {
      await deleteDoc(doc(db, 'challenges', id));
      setChallenges(prev => prev.filter(c => c.id !== id));
      toast.success('Challenge deleted');
    } catch (err) {
      toast.error('Failed to delete challenge');
    }
  }

  async function handleSeed() {
    setSeeding(true);
    try {
      const count = await seedInitialChallenges();
      toast.success(`Successfully seeded ${count} challenges!`);
      fetchChallenges();
    } catch (err) {
      toast.error('Failed to seed challenges');
      console.error(err);
    } finally {
      setSeeding(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-black">Challenge Manager</h1>
          <p className="text-gray-500 font-medium">Create and manage Arena & Training challenges.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleSeed}
            disabled={seeding}
            className="btn-secondary gap-2 border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100"
          >
            {seeding ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            Seed Starter Pack
          </button>
          <button className="btn-primary gap-2">
            <Plus className="w-4 h-4" /> New Challenge
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <div className="card p-20 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
            <p className="font-black text-gray-400 uppercase tracking-widest">Scanning Database...</p>
          </div>
        ) : challenges.length === 0 ? (
          <div className="card p-20 text-center space-y-4">
            <Trophy className="w-12 h-12 mx-auto text-gray-200" />
            <div className="space-y-1">
              <h3 className="font-black">No challenges found</h3>
              <p className="text-gray-500 text-sm font-medium">Use the buttons above to add or seed challenges.</p>
            </div>
          </div>
        ) : (
          challenges.map((c) => (
            <div key={c.id} className="card p-6 flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg shadow-inner
                  ${c.difficulty === 'easy' ? 'bg-green-50 text-green-600' : 
                    c.difficulty === 'medium' ? 'bg-amber-50 text-amber-600' : 
                    'bg-red-50 text-red-600'}`}>
                  {c.language === 'python' ? '🐍' : c.language === 'javascript' ? '⚡' : '📘'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black">{c.title}</h3>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{c.difficulty} • {c.xp} XP</span>
                  </div>
                  <p className="text-xs text-gray-400 font-medium truncate max-w-md">{c.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleDelete(c.id)}
                  className="p-3 rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
