import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  query,
  where,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase/initFirebase';
import type { Flashcard } from '../../domain/entities/Flashcard';
import type { IFlashcardRepository } from '../../domain/repositories/IFlashcardRepository';
import type { CardStatus } from '../../domain/value-objects/CardStatus';

const COLLECTION = 'flashcards';

function toFlashcard(id: string, data: Record<string, unknown>): Flashcard {
  return {
    id,
    front: data.front as string,
    back: data.back as string,
    tags: (data.tags as string[]) ?? [],
    frontImages: (data.frontImages as string[]) ?? [],
    backImages: (data.backImages as string[]) ?? [],
    status: data.status as CardStatus,
    createdAt: (data.createdAt as Timestamp).toDate(),
    updatedAt: (data.updatedAt as Timestamp).toDate(),
  };
}

export class FirebaseFlashcardRepository implements IFlashcardRepository {
  async getAll(): Promise<Flashcard[]> {
    const snap = await getDocs(collection(db, COLLECTION));
    return snap.docs.map((d) => toFlashcard(d.id, d.data()));
  }

  async getByStatus(status: CardStatus): Promise<Flashcard[]> {
    const q = query(collection(db, COLLECTION), where('status', '==', status));
    const snap = await getDocs(q);
    return snap.docs.map((d) => toFlashcard(d.id, d.data()));
  }

  async getByTags(tagIds: string[]): Promise<Flashcard[]> {
    if (tagIds.length === 0) return this.getAll();
    const q = query(collection(db, COLLECTION), where('tags', 'array-contains-any', tagIds));
    const snap = await getDocs(q);
    return snap.docs.map((d) => toFlashcard(d.id, d.data()));
  }

  async add(flashcard: Omit<Flashcard, 'id' | 'createdAt' | 'updatedAt'>): Promise<Flashcard> {
    const now = Timestamp.now();
    const docRef = await addDoc(collection(db, COLLECTION), {
      ...flashcard,
      createdAt: now,
      updatedAt: now,
    });
    return {
      ...flashcard,
      id: docRef.id,
      createdAt: now.toDate(),
      updatedAt: now.toDate(),
    };
  }

  async updateStatus(id: string, status: CardStatus): Promise<void> {
    await updateDoc(doc(db, COLLECTION, id), {
      status,
      updatedAt: Timestamp.now(),
    });
  }
}
