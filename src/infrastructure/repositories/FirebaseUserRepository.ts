import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/initFirebase';
import type { User } from '../../domain/entities/User';
import type { IUserRepository } from '../../domain/repositories/IUserRepository';

const COLLECTION = 'users';

export class FirebaseUserRepository implements IUserRepository {
  async getByUid(uid: string): Promise<User | null> {
    const snap = await getDoc(doc(db, COLLECTION, uid));
    if (!snap.exists()) return null;
    return snap.data() as User;
  }

  async create(user: User): Promise<void> {
    await setDoc(doc(db, COLLECTION, user.uid), user);
  }
}
