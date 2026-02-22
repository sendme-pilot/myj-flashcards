import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase/initFirebase';
import type { Tag } from '../../domain/entities/Tag';
import type { ITagRepository } from '../../domain/repositories/ITagRepository';

const COLLECTION = 'tags';

function toTag(id: string, data: Record<string, unknown>): Tag {
  return {
    id,
    name: data.name as string,
    category: data.category as string,
    createdAt: (data.createdAt as Timestamp).toDate(),
  };
}

export class FirebaseTagRepository implements ITagRepository {
  async getAll(): Promise<Tag[]> {
    const snap = await getDocs(collection(db, COLLECTION));
    return snap.docs.map((d) => toTag(d.id, d.data()));
  }

  async create(tag: Omit<Tag, 'id' | 'createdAt'>): Promise<Tag> {
    const now = Timestamp.now();
    const docRef = await addDoc(collection(db, COLLECTION), {
      ...tag,
      createdAt: now,
    });
    return {
      ...tag,
      id: docRef.id,
      createdAt: now.toDate(),
    };
  }

  async update(id: string, data: Partial<Pick<Tag, 'name' | 'category'>>): Promise<void> {
    await updateDoc(doc(db, COLLECTION, id), data);
  }

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTION, id));
  }
}
