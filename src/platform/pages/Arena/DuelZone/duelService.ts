import {
  collection,
  addDoc,
  updateDoc,
  onSnapshot,
  query,
  where,
  serverTimestamp,
  doc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../../../core/firebase/config";

export type DuelRoom = {
  id: string;
  challengeId: string;
  challengeTitle: string;
  creatorId: string;
  creatorName: string;
  creatorStatus: 'thinking' | 'answered' | 'finished';
  opponentId: string | null;
  opponentName: string | null;
  opponentStatus: 'thinking' | 'answered' | 'finished';
  status: 'waiting' | 'ongoing' | 'finished';
  startTime: Timestamp | null;
  winnerId: string | null;
  createdAt: Timestamp;
};

// Duel *finishing* (winner determination, XP awards, leaderboard) happens in
// POST /api/xp/award — server-authoritative. This file only covers room
// lifecycle: create, join, in-progress status, and subscriptions.

export const duelService = {
  // Create a new duel room
  createRoom: async (challengeId: string, challengeTitle: string, userId: string, userName: string) => {
    const roomData: Omit<DuelRoom, 'id'> = {
      challengeId,
      challengeTitle,
      creatorId: userId,
      creatorName: userName,
      creatorStatus: 'thinking',
      opponentId: null,
      opponentName: null,
      opponentStatus: 'thinking',
      status: 'waiting',
      startTime: null,
      winnerId: null,
      createdAt: serverTimestamp() as Timestamp,
    };

    const docRef = await addDoc(collection(db, "duel_rooms"), roomData);
    return docRef.id;
  },

  // Join an existing room
  joinRoom: async (roomId: string, userId: string, userName: string) => {
    const roomRef = doc(db, "duel_rooms", roomId);
    await updateDoc(roomRef, {
      opponentId: userId,
      opponentName: userName,
      status: 'ongoing',
      startTime: serverTimestamp(),
    });
  },

  // Update status during duel
  updateStatus: async (roomId: string, isCreator: boolean, status: 'thinking' | 'answered' | 'finished') => {
    const roomRef = doc(db, "duel_rooms", roomId);
    const update: Record<string, string> = {};
    if (isCreator) update.creatorStatus = status;
    else update.opponentStatus = status;
    await updateDoc(roomRef, update);
  },

  // Listen to open rooms
  subscribeToOpenRooms: (callback: (rooms: DuelRoom[]) => void) => {
    const q = query(
      collection(db, "duel_rooms"),
      where("status", "==", "waiting")
    );
    return onSnapshot(q, (snap) => {
      const rooms = snap.docs.map(d => ({ id: d.id, ...d.data() } as DuelRoom));
      callback(rooms);
    });
  },

  // Listen to a specific room
  subscribeToRoom: (roomId: string, callback: (room: DuelRoom) => void) => {
    return onSnapshot(doc(db, "duel_rooms", roomId), (doc) => {
      if (doc.exists()) {
        callback({ id: doc.id, ...doc.data() } as DuelRoom);
      }
    });
  }
};
