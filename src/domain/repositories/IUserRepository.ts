import type { User } from '../entities/User';

export interface IUserRepository {
  getByUid(uid: string): Promise<User | null>;
  create(user: User): Promise<void>;
}
