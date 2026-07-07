import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp, 
  limit,
  getDoc
} from "firebase/firestore";
import { db } from "../firebase";
import type { UserProfile } from "../types";

export interface FriendRequest {
  id: string;
  from: string;
  to: string;
  fromName: string;
  fromPhoto: string | null;
  status: 'pending' | 'accepted' | 'declined';
  timestamp: any;
}

export const socialService = {
  // Search for users by display name
  searchUsers: async (searchTerm: string, limitCount: number = 10): Promise<UserProfile[]> => {
    if (!searchTerm.trim()) return [];
    
    // Firestore doesn't support full-text search easily, 
    // so we'll do a simple prefix match using \uf8ff trick
    const usersRef = collection(db, "users");
    const q = query(
      usersRef,
      where("displayName", ">=", searchTerm),
      where("displayName", "<=", searchTerm + "\uf8ff"),
      limit(limitCount)
    );
    
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({
      ...doc.data(),
      uid: doc.id
    } as UserProfile));
  },

  // Send a friend request
  sendFriendRequest: async (fromUser: UserProfile, toUserId: string) => {
    const requestId = `${fromUser.uid}_${toUserId}`;
    const requestRef = doc(db, "friend_requests", requestId);
    
    // Check if request already exists
    const existing = await getDoc(requestRef);
    if (existing.exists()) return;

    await setDoc(requestRef, {
      from: fromUser.uid,
      to: toUserId,
      fromName: fromUser.displayName,
      fromPhoto: fromUser.photoURL,
      status: 'pending',
      timestamp: serverTimestamp()
    });

    // Also create a notification
    await socialService.createNotification(toUserId, {
      type: 'friend_request',
      from: {
        uid: fromUser.uid,
        displayName: fromUser.displayName,
        photoURL: fromUser.photoURL
      },
      requestId
    });
  },

  // Accept a friend request
  acceptFriendRequest: async (requestId: string, currentUserId: string, otherUserId: string) => {
    const requestRef = doc(db, "friend_requests", requestId);
    await updateDoc(requestRef, { status: 'accepted' });

    // Create friendship entries (two-way)
    const friendshipId = [currentUserId, otherUserId].sort().join('_');
    await setDoc(doc(db, "friendships", friendshipId), {
      users: [currentUserId, otherUserId],
      createdAt: serverTimestamp()
    });
  },

  // Decline a friend request
  declineFriendRequest: async (requestId: string) => {
    const requestRef = doc(db, "friend_requests", requestId);
    await deleteDoc(requestRef);
  },

  // Get friend list for a user
  getFriends: async (userId: string): Promise<UserProfile[]> => {
    const q = query(
      collection(db, "friendships"),
      where("users", "array-contains", userId)
    );
    
    const snap = await getDocs(q);
    const friendIds = snap.docs.map(doc => {
      const users = doc.data().users as string[];
      return users.find(id => id !== userId);
    }).filter(Boolean) as string[];

    if (friendIds.length === 0) return [];

    // Fetch full profiles for friends
    const profiles: UserProfile[] = [];
    for (const id of friendIds) {
      const p = await socialService.getUserProfile(id);
      if (p) profiles.push(p);
    }
    return profiles;
  },

  // Helper to fetch single profile
  getUserProfile: async (uid: string): Promise<UserProfile | null> => {
    const snap = await getDoc(doc(db, "users", uid));
    if (!snap.exists()) return null;
    return { ...snap.data(), uid: snap.id } as UserProfile;
  },

  // Create a notification
  createNotification: async (toUserId: string, data: any) => {
    await setDoc(doc(collection(db, "notifications")), {
      ...data,
      userId: toUserId,
      read: false,
      timestamp: serverTimestamp()
    });
  },

  // Send a duel invite
  sendDuelInvite: async (fromUser: UserProfile, toUserId: string, roomId: string) => {
    await socialService.createNotification(toUserId, {
      type: 'duel_invite',
      from: {
        uid: fromUser.uid,
        displayName: fromUser.displayName,
        photoURL: fromUser.photoURL
      },
      roomId
    });
  },

  // Check relationship status between two users
  getRelationship: async (uid1: string, uid2: string): Promise<'friends' | 'pending' | 'none'> => {
    // Check friendships
    const friendshipId = [uid1, uid2].sort().join('_');
    const friendSnap = await getDoc(doc(db, "friendships", friendshipId));
    if (friendSnap.exists()) return 'friends';

    // Check pending requests (either way)
    const req1 = await getDoc(doc(db, "friend_requests", `${uid1}_${uid2}`));
    const req2 = await getDoc(doc(db, "friend_requests", `${uid2}_${uid1}`));
    if (req1.exists() || req2.exists()) return 'pending';

    return 'none';
  },

  // Get pending requests for a user
  getFriendRequests: async (userId: string): Promise<FriendRequest[]> => {
    const q = query(
      collection(db, "friend_requests"),
      where("to", "==", userId),
      where("status", "==", "pending")
    );
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ ...doc.data(), id: doc.id } as FriendRequest));
  }
};
