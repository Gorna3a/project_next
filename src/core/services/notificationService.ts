import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  orderBy, 
  doc, 
  updateDoc, 
  deleteDoc 
} from "firebase/firestore";
import { db } from "../firebase";

export interface Notification {
  id: string;
  userId: string;
  type: 'friend_request' | 'duel_invite' | 'duel_accepted' | 'system';
  from: {
    uid: string;
    displayName: string;
    photoURL: string | null;
  };
  data?: any;
  roomId?: string;
  requestId?: string;
  read: boolean;
  timestamp: any;
}

export const notificationService = {
  // Listen for real-time notifications
  subscribe: (userId: string, callback: (notifs: Notification[]) => void) => {
    const q = query(
      collection(db, "notifications"),
      where("userId", "==", userId),
      orderBy("timestamp", "desc")
    );

    return onSnapshot(q,
      (snap) => {
        const notifs = snap.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        } as Notification));
        callback(notifs);
      },
      (error) => {
        console.error('Failed to subscribe to notifications:', error);
      }
    );
  },

  // Mark a notification as read
  markAsRead: async (notificationId: string) => {
    const ref = doc(db, "notifications", notificationId);
    await updateDoc(ref, { read: true });
  },

  // Delete a notification
  deleteNotification: async (notificationId: string) => {
    const ref = doc(db, "notifications", notificationId);
    await deleteDoc(ref);
  }
};
