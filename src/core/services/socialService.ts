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

/**
 * Firestore rejects `undefined` anywhere in a written document (and in
 * arrays). Deep-walk the payload: drop undefined object keys, map undefined
 * array items to null. Plain objects only — FieldValue sentinels
 * (serverTimestamp etc.) and class instances pass through untouched.
 */
const stripUndefined = <T>(value: T): T => {
  if (value === undefined) return null as unknown as T;
  if (Array.isArray(value)) return value.map(stripUndefined) as unknown as T;
  if (typeof value === 'object' && value !== null && value.constructor === Object) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (v !== undefined) out[k] = stripUndefined(v);
    }
    return out as unknown as T;
  }
  return value;
};

const requireUid = (uid: unknown, name: string): string => {
  if (typeof uid !== 'string' || uid.length === 0) {
    throw new Error(`[social] missing or invalid ${name}`);
  }
  return uid;
};

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
    const uid = requireUid(fromUser?.uid, 'fromUser.uid');
    const to = requireUid(toUserId, 'toUserId');
    const requestId = `${uid}_${to}`;
    const requestRef = doc(db, "friend_requests", requestId);

    // Check if request already exists
    const existing = await getDoc(requestRef);
    if (existing.exists()) return;

    await setDoc(requestRef, stripUndefined({
      from: fromUser.uid,
      to,
      fromName: fromUser.displayName ?? 'PixelCoder',
      fromPhoto: fromUser.photoURL ?? null,
      status: 'pending',
      timestamp: serverTimestamp()
    }));

    // Also create a notification
    await socialService.createNotification(to, stripUndefined({
      type: 'friend_request',
      from: {
        uid: fromUser.uid,
        displayName: fromUser.displayName ?? 'PixelCoder',
        photoURL: fromUser.photoURL ?? null
      },
      requestId
    }));
  },

  // Accept a friend request
  acceptFriendRequest: async (requestId: string, currentUserId: string, otherUserId: string) => {
    const uid = requireUid(currentUserId, 'currentUserId');
    const other = requireUid(otherUserId, 'otherUserId');
    const requestRef = doc(db, "friend_requests", requestId);
    await updateDoc(requestRef, { status: 'accepted' });

    // Create friendship entries (two-way)
    const friendshipId = [uid, other].sort().join('_');
    await setDoc(doc(db, "friendships", friendshipId), stripUndefined({
      users: [uid, other],
      createdAt: serverTimestamp()
    }));
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
    const uid = requireUid(toUserId, 'toUserId');
    await setDoc(doc(collection(db, "notifications")), stripUndefined({
      ...data,
      userId: uid,
      read: false,
      timestamp: serverTimestamp()
    }));
  },

  // Send a duel invite
  sendDuelInvite: async (fromUser: UserProfile, toUserId: string, roomId: string) => {
    requireUid(fromUser?.uid, 'fromUser.uid');
    await socialService.createNotification(toUserId, stripUndefined({
      type: 'duel_invite',
      from: {
        uid: fromUser.uid,
        displayName: fromUser.displayName ?? 'PixelCoder',
        photoURL: fromUser.photoURL ?? null
      },
      roomId
    }));
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
