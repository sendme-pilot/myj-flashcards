import type { UserProgress } from '../entities/UserProgress';

export interface IProgressRepository {
  getByUser(userId: string): Promise<UserProgress[]>;
  getByFlashcard(flashcardId: string): Promise<UserProgress[]>;
  record(progress: UserProgress): Promise<void>;
}
