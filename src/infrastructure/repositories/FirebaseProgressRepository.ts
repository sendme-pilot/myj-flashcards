import {
  collection,
  getDocs,
  setDoc,
  doc,
  query,
  where,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase/initFirebase';
import type { UserProgress } from '../../domain/entities/UserProgress';
import type { IProgressRepository } from '../../domain/repositories/IProgressRepository';

const COLLECTION = 'userProgress';

function toProgress(data: Record<string, unknown>): UserProgress {
  return {
    userId: data.userId as string,
    flashcardId: data.flashcardId as string,
    seen: data.seen as number,
    correct: data.correct as number,
    lastSeenAt: (data.lastSeenAt as Timestamp).toDate(),
  };
}

export class FirebaseProgressRepository implements IProgressRepository {
  async getByUser(userId: string): Promise<UserProgress[]> {
    const q = query(collection(db, COLLECTION), where('userId', '==', userId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => toProgress(d.data()));
  }

  async getByFlashcard(flashcardId: string): Promise<UserProgress[]> {
    const q = query(collection(db, COLLECTION), where('flashcardId', '==', flashcardId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => toProgress(d.data()));
  }

  async record(progress: UserProgress): Promise<void> {
    const id = `${progress.userId}_${progress.flashcardId}`;
    await setDoc(doc(db, COLLECTION, id), {
      ...progress,
      lastSeenAt: Timestamp.fromDate(progress.lastSeenAt),
    });
  }
}
