import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  onSnapshot, 
  query, 
  where, 
  serverTimestamp,
  getDoc,
  Timestamp,
  increment
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
    const update: any = {};
    if (isCreator) update.creatorStatus = status;
    else update.opponentStatus = status;
    await updateDoc(roomRef, update);
  },

  // Finish duel and set winner if not already set
  finishDuel: async (roomId: string, userId: string) => {
    const roomRef = doc(db, "duel_rooms", roomId);
    const roomSnap = await getDoc(roomRef);
    if (!roomSnap.exists()) return;

    const data = roomSnap.data();
    if (!data.winnerId) {
      // First one to finish is the winner
      await updateDoc(roomRef, {
        winnerId: userId,
        status: 'finished'
      });
      
      // Update winner's leaderboard stats
      await updateLeaderboard(userId, true);
      // Update loser's stats if possible (later)
    }
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

const updateLeaderboard = async (userId: string, isWin: boolean) => {
  const lbRef = doc(db, "competitive_leaderboard", userId);
  const lbSnap = await getDoc(lbRef);
  
  if (lbSnap.exists()) {
    await updateDoc(lbRef, {
      wins: isWin ? increment(1) : increment(0),
      matchesPlayed: increment(1),
      rating: isWin ? increment(25) : increment(-10),
    });
  } else {
    // Initial entry
    await addDoc(collection(db, "competitive_leaderboard"), {
      uid: userId,
      wins: isWin ? 1 : 0,
      matchesPlayed: 1,
      rating: isWin ? 1025 : 990,
    });
  }
};
