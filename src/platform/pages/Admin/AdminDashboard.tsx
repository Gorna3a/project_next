'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../../../core/firebase/config';
import { 
  Users, Trophy, BookOpen, 
  Activity, ArrowUpRight, Zap
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    challenges: 0,
    classrooms: 0,
    duels: 0
  });
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const usersSnap = await getDocs(collection(db, 'users'));
        const challengesSnap = await getDocs(collection(db, 'challenges'));
        const classroomsSnap = await getDocs(collection(db, 'classrooms'));
        const duelsSnap = await getDocs(collection(db, 'duelRooms'));

        setStats({
          users: usersSnap.size,
          challenges: challengesSnap.size,
          classrooms: classroomsSnap.size,
          duels: duelsSnap.size
        });

        const recentQ = query(collection(db, 'users'), orderBy('createdAt', 'desc'), limit(5));
        const recentSnap = await getDocs(recentQ);
        setRecentUsers(recentSnap.docs.map(d => d.data()));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const cards = [
    { label: 'Total Users', value: stats.users, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/10' },
    { label: 'Challenges', value: stats.challenges, icon: Trophy, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/10' },
    { label: 'Classrooms', value: stats.classrooms, icon: BookOpen, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-900/10' },
    { label: 'Active Duels', value: stats.duels, icon: Zap, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/10' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black">Dashboard</h1>
          <p className="text-gray-500 font-medium">Welcome back, Commander.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm">
          <Activity className="w-4 h-4 text-green-500" />
          <span className="text-xs font-black uppercase tracking-widest">System Online</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div key={i} className="card p-6 flex items-start justify-between">
            <div>
              <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{card.label}</div>
              <div className="text-3xl font-black">{loading ? '...' : card.value}</div>
            </div>
            <div className={`p-3 rounded-2xl ${card.bg} ${card.color}`}>
              <card.icon className="w-6 h-6" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Users */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black">Recent Users</h2>
            <button className="text-xs font-bold text-indigo-600 flex items-center gap-1 hover:underline">
              View all <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="card divide-y divide-gray-100 dark:divide-gray-800">
            {loading ? (
              <div className="p-8 text-center text-gray-400 font-medium">Loading users...</div>
            ) : recentUsers.length === 0 ? (
              <div className="p-8 text-center text-gray-400 font-medium">No users found.</div>
            ) : (
              recentUsers.map((user, i) => (
                <div key={i} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-lg">
                      {user.photoURL ? <img src={user.photoURL} alt="" className="w-full h-full rounded-full" /> : '👤'}
                    </div>
                    <div>
                      <div className="font-bold text-sm">{user.displayName}</div>
                      <div className="text-xs text-gray-400">{user.email}</div>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${user.role === 'admin' ? 'bg-red-100 text-red-600' : user.role === 'teacher' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                    {user.role}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Platform Status */}
        <section className="space-y-4">
          <h2 className="text-xl font-black">Platform Health</h2>
          <div className="card p-6 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-gray-400 uppercase tracking-widest">Database Storage</span>
                <span>45%</span>
              </div>
              <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 w-[45%]" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-gray-400 uppercase tracking-widest">CPU Load</span>
                <span>12%</span>
              </div>
              <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 w-[12%]" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-gray-400 uppercase tracking-widest">Daily Active Users</span>
                <span>+8% vs yesterday</span>
              </div>
              <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-[68%]" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
