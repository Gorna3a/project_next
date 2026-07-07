'use client';

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Trophy, Sword, Zap, Flame, Star, 
  ChevronLeft, ChevronRight, Share2, Calendar, Mail,
  UserPlus, UserCheck, Clock, Users, Brain
} from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../core/firebase";
import { useAuth } from "../../../core/context/AuthContext";
import { useNotifications } from "../../../core/context/NotificationContext";
import { socialService } from "../../../core/services/socialService";
import { duelService } from "../Arena/DuelZone/duelService";
import { useLanguage } from "../../../core/context/LanguageContext";
import type { UserProfile } from "../../../core/types";

export default function PublicProfile() {
  const params = useParams();
  const uid = params.uid as string;
  const navigate = useRouter();
  const { profile: currentProfile } = useAuth();
  const { addNotification } = useNotifications();
  const { t, isRTL } = useLanguage();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [inviting, setInviting] = useState(false);
  const [relationship, setRelationship] = useState<'friends' | 'pending' | 'none'>('none');
  const [friends, setFriends] = useState<UserProfile[]>([]);
  const [activeTab, setActiveTab] = useState<'stats' | 'friends'>('stats');

  useEffect(() => {
    const fetchUser = async () => {
      if (!uid) return;
      setLoading(true);
      try {
        const snap = await getDoc(doc(db, "users", uid));
        if (snap.exists()) {
          const userData = { ...snap.data(), uid: snap.id } as UserProfile;
          setProfile(userData);
          
          if (currentProfile) {
            const rel = await socialService.getRelationship(currentProfile.uid, uid);
            setRelationship(rel);
          }

          const friendList = await socialService.getFriends(uid);
          setFriends(friendList);
        }
      } catch (e) {
        console.error("Error fetching profile:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [uid, currentProfile]);

  const handleDuel = async () => {
    if (!currentProfile || !profile) return;
    setInviting(true);
    try {
      const roomId = await duelService.createRoom(
        'quick-duel', 
        'Quick Duel Challenge', 
        currentProfile.uid, 
        currentProfile.displayName || 'PixelCoder'
      );
      await socialService.sendDuelInvite(currentProfile, profile.uid, roomId);
      addNotification('success', t('profile.duelSent'), t('profile.duelSentDesc').replace('{name}', profile.displayName));
      navigate.push(`/arena/duels/${roomId}`);
    } catch (err) {
      addNotification('error', t('common.failed'), t('profile.failedUpdateProfile'));
    } finally {
      setInviting(false);
    }
  };

  const handleAddFriend = async () => {
    if (!profile || !currentProfile) return;
    try {
      await socialService.sendFriendRequest(currentProfile, profile.uid);
      setRelationship('pending');
      addNotification('success', t('social.requestSent'), t('social.friendRequestSent').replace('{name}', profile.displayName));
    } catch (err) {
      addNotification('error', t('common.failed'), t('social.failedRequest'));
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-500 animate-pulse">{t('profile.loadingProfile')}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-20 space-y-6">
        <div className="w-20 h-20 bg-gray-50 dark:bg-gray-900 rounded-[2.5rem] flex items-center justify-center mx-auto text-gray-300">
          <User className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white">{t('profile.userNotFound')}</h2>
        <button onClick={() => navigate.back()} className="btn-secondary px-6">{t('profile.goBack')}</button>
      </div>
    );
  }

  const statsList = [
    { label: t('dashboard.totalXP'), value: profile.totalXP.toLocaleString(), icon: Star, color: "text-yellow-500", bg: "bg-yellow-50 dark:bg-yellow-900/20" },
    { label: t('profile.level'), value: profile.level, icon: Trophy, color: "text-brand-500", bg: "bg-brand-50 dark:bg-brand-900/20" },
    { label: t('profile.dayStreak'), value: `${profile.streak}${isRTL ? '🔥' : '🔥'}`, icon: Flame, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-900/20" },
    { label: t('profile.friends'), value: friends.length, icon: Users, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
  ];

  const isOwnProfile = currentProfile?.uid === uid;

  return (
    <div className={`max-w-5xl mx-auto space-y-8 pb-20 ${isRTL ? 'text-right' : 'text-left'}`}>
      {/* Header / Cover */}
      <div className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-brand-600 to-brand-800 p-8 sm:p-12 text-white">
        <div className={`absolute top-6 flex gap-2 ${isRTL ? 'right-6' : 'left-6'}`}>
           <button onClick={() => navigate.back()} className="p-3 rounded-2xl bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all">
              {isRTL ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
           </button>
        </div>
        <div className={`absolute top-6 ${isRTL ? 'left-6' : 'right-6'}`}>
           <button className="p-3 rounded-2xl bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all">
              <Share2 className="w-5 h-5" />
           </button>
        </div>

        <div className={`relative flex flex-col items-center gap-8 ${isRTL ? 'md:flex-row-reverse md:items-end' : 'md:flex-row md:items-end'}`}>
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-32 h-32 sm:w-40 sm:h-40 rounded-[2.5rem] bg-white p-1 shadow-2xl overflow-hidden"
          >
            {profile.photoURL ? (
              <img src={profile.photoURL} alt="" className="w-full h-full rounded-[2.2rem] object-cover" />
            ) : (
              <div className="w-full h-full rounded-[2.2rem] bg-brand-500 flex items-center justify-center text-white">
                <User className="w-16 h-16" />
              </div>
            )}
          </motion.div>

          <div className={`flex-1 text-center space-y-2 ${isRTL ? 'md:text-right' : 'md:text-left'}`}>
            <div className={`flex flex-col gap-3 ${isRTL ? 'md:flex-row-reverse md:items-center' : 'md:flex-row md:items-center'}`}>
              <h1 className="text-4xl font-black tracking-tight">{profile.displayName}</h1>
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-black uppercase tracking-widest">
                {profile.role === 'student' ? t('common.student') : profile.role === 'teacher' ? t('common.teacher') : t('common.admin')}
              </span>
            </div>
            <p className={`text-brand-100 font-medium opacity-80 flex items-center justify-center gap-2 ${isRTL ? 'md:justify-end' : 'md:justify-start'}`}>
              <Mail className="w-4 h-4" /> {profile.email}
            </p>
            <p className={`text-brand-200 text-xs flex items-center justify-center gap-2 ${isRTL ? 'md:justify-end' : 'md:justify-start'}`}>
               <Calendar className="w-4 h-4" /> {t('profile.joinedIn').replace('{year}', new Date(profile.createdAt).getFullYear().toString())}
            </p>
          </div>

          <div className="flex flex-col gap-3 w-full md:w-auto">
            {!isOwnProfile && (
              <>
                <button 
                  onClick={handleDuel}
                  disabled={inviting}
                  className="btn-primary bg-white text-brand-700 hover:bg-brand-50 px-8 py-4 rounded-[1.5rem] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-black/20 transition-all active:scale-95"
                >
                  {inviting ? (
                    <div className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Sword className="w-5 h-5" />
                  )}
                  {t('profile.challengeDuel')}
                </button>

                {relationship === 'friends' ? (
                  <div className="px-8 py-4 rounded-[1.5rem] bg-green-500/20 backdrop-blur-md font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 border border-green-500/30 text-green-400">
                    <UserCheck className="w-5 h-5" /> {t('profile.friends')}
                  </div>
                ) : relationship === 'pending' ? (
                  <div className="px-8 py-4 rounded-[1.5rem] bg-orange-500/20 backdrop-blur-md font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 border border-orange-500/30 text-orange-400">
                    <Clock className="w-5 h-5" /> {t('social.requestSent')}
                  </div>
                ) : (
                  <button 
                    onClick={handleAddFriend}
                    className="px-8 py-4 rounded-[1.5rem] bg-white/10 backdrop-blur-md hover:bg-white/20 font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all border border-white/10"
                  >
                    <UserPlus className="w-5 h-5" /> {t('profile.addFriend')}
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Decorative elements */}
        <div className={`absolute -bottom-12 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none ${isRTL ? '-left-12' : '-right-12'}`} />
      </div>

      {/* Stats Grid */}
      <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${isRTL ? 'direction-rtl' : ''}`}>
        {statsList.map((s, i) => (
          <motion.div 
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card p-6 flex flex-col items-center text-center gap-3"
          >
            <div className={`w-12 h-12 rounded-2xl ${s.bg} flex items-center justify-center`}>
              <s.icon className={`w-6 h-6 ${s.color}`} />
            </div>
            <div className="space-y-0.5">
              <p className="text-2xl font-black text-gray-900 dark:text-white">{s.value}</p>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{s.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className={`flex border-b border-gray-100 dark:border-gray-800 ${isRTL ? 'flex-row-reverse' : ''}`}>
        {[
          { id: 'stats', label: t('profile.statsActivity'), icon: Zap },
          { id: 'friends', label: `${t('profile.friends')} (${friends.length})`, icon: Users },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-8 py-4 text-xs font-black uppercase tracking-widest border-b-2 transition-all
              ${activeTab === tab.id 
                ? 'border-brand-500 text-brand-600' 
                : 'border-transparent text-gray-400 hover:text-gray-600'}`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'stats' ? (
          <motion.div 
            key="stats"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`grid md:grid-cols-3 gap-8 ${isRTL ? 'direction-rtl' : ''}`}
          >
            {/* Achievements Placeholder */}
            <div className="md:col-span-2 card p-8 space-y-6">
               <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white">{t('profile.recentAchievements')}</h3>
                  <button className="text-xs font-black text-brand-600 uppercase tracking-widest hover:underline">{t('common.viewAll')}</button>
               </div>
               
               <div className={`grid grid-cols-3 sm:grid-cols-4 gap-4 ${isRTL ? 'direction-rtl' : ''}`}>
                  {[Zap, Star, Trophy, Brain, Flame].map((Icon, i) => (
                    <div key={i} className="aspect-square rounded-3xl bg-gray-50 dark:bg-gray-800/50 flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-800 group relative">
                       <Icon className="w-8 h-8 text-gray-300 dark:text-gray-700 transition-colors" />
                       <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-gray-900 text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                          {t('profile.lockedAchievement')}
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            {/* Activity Placeholder */}
            <div className={`card p-8 space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
               <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white">{t('profile.activity')}</h3>
               <div className={`space-y-6 relative before:absolute before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100 dark:before:bg-gray-800 ${isRTL ? 'before:right-[11px]' : 'before:left-[11px]'}`}>
                  {[
                    { type: "Challenge", text: "Solved 'Palindrome Checker'", time: "2h ago", timeKey: 'ago_h', count: 2 },
                    { type: "Duel", text: "Won a duel against Alex", time: "5h ago", timeKey: 'ago_h', count: 5 },
                    { type: "Course", text: "Started 'Advanced React'", time: "1d ago", timeKey: 'ago_d', count: 1 },
                  ].map((item, i) => (
                    <div key={i} className={`relative space-y-1 ${isRTL ? 'pr-8' : 'pl-8'}`}>
                       <div className={`absolute top-1 w-6 h-6 rounded-full bg-white dark:bg-gray-900 border-2 border-brand-500 flex items-center justify-center ${isRTL ? 'right-0' : 'left-0'}`}>
                          <div className="w-2 h-2 rounded-full bg-brand-500" />
                       </div>
                       <p className="text-xs font-bold text-gray-900 dark:text-white">{item.text}</p>
                       <p className="text-[10px] text-gray-400">
                         {t(`profile.${item.timeKey}`).replace('{count}', item.count.toString())} &middot; {item.type}
                       </p>
                    </div>
                  ))}
               </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="friends"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`grid sm:grid-cols-2 lg:grid-cols-3 gap-4 ${isRTL ? 'direction-rtl' : ''}`}
          >
            {friends.length === 0 ? (
              <div className="col-span-full py-20 text-center space-y-4">
                <Users className="w-12 h-12 text-gray-200 mx-auto" />
                <p className="text-gray-400 font-bold">{t('profile.noFriends')}</p>
              </div>
            ) : (
              friends.map(friend => (
                <button
                  key={friend.uid}
                  onClick={() => navigate.push(`/app/profile/${friend.uid}`)}
                  className={`card p-4 flex items-center gap-4 hover:border-brand-500 transition-all group ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}
                >
                  <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-gray-100 dark:border-gray-800">
                    <img 
                      src={friend.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${friend.displayName}`} 
                      className="w-full h-full object-cover"
                      alt=""
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-black text-gray-900 dark:text-white group-hover:text-brand-600 transition-colors">{friend.displayName}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">
                      {t('profile.level')} {friend.level} &middot; {friend.totalXP} {t('common.xp')}
                    </p>
                  </div>
                </button>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
