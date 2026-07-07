'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, UserPlus, Sword, X, Check, Trash2, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../core/context/AuthContext';
import { useLanguage } from '../../core/context/LanguageContext';
import { notificationService, type Notification } from '../../core/services/notificationService';
import { socialService } from '../../core/services/socialService';

interface NotificationTrayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationTray = ({ isOpen, onClose }: NotificationTrayProps) => {
  const { user, profile } = useAuth();
  const { t, isRTL } = useLanguage();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const trayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    const unsub = notificationService.subscribe(user.uid, setNotifications);
    return unsub;
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (trayRef.current && !trayRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  const handleAcceptFriend = async (notif: Notification) => {
    if (!notif.requestId || !profile) return;
    try {
      await socialService.acceptFriendRequest(notif.requestId, profile.uid, notif.from.uid);
      await notificationService.deleteNotification(notif.id);
    } catch (err) {
      console.error("Failed to accept friend:", err);
    }
  };

  const handleJoinDuel = async (notif: Notification) => {
    if (!notif.roomId) return;
    await notificationService.markAsRead(notif.id);
    onClose();
    router.push(`/app/arena/duels/${notif.roomId}`);
  };

  const handleMarkRead = (id: string) => {
    notificationService.markAsRead(id);
  };

  const handleDelete = (id: string) => {
    notificationService.deleteNotification(id);
  };

  return (
    <div ref={trayRef}>
      {/* Dropdown Tray */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-3 w-80 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border-2 border-gray-100 dark:border-gray-800 overflow-hidden z-50`}
          >
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
              <h3 className="font-black text-gray-800 dark:text-white">{t('common.notifications')}</h3>
              {notifications.length > 0 && (
                <button 
                  onClick={() => notifications.forEach(n => handleDelete(n.id))}
                  className="text-xs font-bold text-gray-400 hover:text-red-500"
                >
                  {t('common.clearAll')}
                </button>
              )}
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-10 text-center space-y-3">
                  <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto">
                    <Bell className="w-6 h-6 text-gray-300" />
                  </div>
                  <p className="text-sm font-bold text-gray-400">{t('common.allCaughtUp')}</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div 
                    key={notif.id}
                    className={`p-4 border-b border-gray-50 dark:border-gray-800 transition-colors ${notif.read ? 'opacity-60' : 'bg-indigo-50/30 dark:bg-indigo-900/10'}`}
                  >
                    <div className="flex gap-3">
                      <div className="relative">
                        <img 
                          src={notif.from.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${notif.from.displayName}`} 
                          className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                          alt=""
                        />
                        <div className={`absolute -bottom-1 ${isRTL ? '-left-1' : '-right-1'} p-1 bg-white dark:bg-gray-800 rounded-full shadow-sm`}>
                          {notif.type === 'friend_request' ? <UserPlus className="w-3 h-3 text-blue-500" /> : <Sword className="w-3 h-3 text-red-500" />}
                        </div>
                      </div>

                      <div className="flex-1 space-y-1">
                        <p className={`text-xs font-bold leading-tight text-gray-800 dark:text-gray-200 ${isRTL ? 'text-right' : 'text-left'}`}>
                          <span className="font-black text-indigo-600">{notif.from.displayName}</span>
                          {notif.type === 'friend_request' 
                            ? t('notifications.friendRequestSent') 
                            : t('notifications.duelInviteSent')}
                        </p>
                        
                        <div className="flex gap-2 pt-1">
                          {notif.type === 'friend_request' ? (
                            <>
                              <button 
                                onClick={() => handleAcceptFriend(notif)}
                                className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-black rounded-lg flex items-center gap-1 hover:bg-indigo-700 transition-colors"
                              >
                                <Check className="w-3 h-3" /> {t('common.accept')}
                              </button>
                              <button 
                                onClick={() => handleDelete(notif.id)}
                                className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-500 text-[10px] font-black rounded-lg flex items-center gap-1 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                              >
                                <X className="w-3 h-3" /> {t('common.decline')}
                              </button>
                            </>
                          ) : (
                            <>
                              <button 
                                onClick={() => handleJoinDuel(notif)}
                                className="px-3 py-1 bg-red-600 text-white text-[10px] font-black rounded-lg flex items-center gap-1 hover:bg-red-700 transition-colors"
                              >
                                <Sword className="w-3 h-3" /> {t('notifications.joinDuel')}
                              </button>
                              <button 
                                onClick={() => handleDelete(notif.id)}
                                className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-500 text-[10px] font-black rounded-lg flex items-center gap-1 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                              >
                                {t('common.ignore')}
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        {!notif.read && (
                          <button 
                            onClick={() => handleMarkRead(notif.id)}
                            className="w-2 h-2 bg-indigo-600 rounded-full"
                            title="Mark as read"
                          />
                        )}
                        <button 
                          onClick={() => handleDelete(notif.id)}
                          className="text-gray-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-3 bg-gray-50 dark:bg-gray-800/50 text-center">
              <button 
                onClick={() => { onClose(); router.push('/app/profile'); }}
                className="text-[10px] font-black text-gray-400 hover:text-indigo-600 flex items-center justify-center gap-1 mx-auto"
              >
                {t('notifications.viewSocialHub')} <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
