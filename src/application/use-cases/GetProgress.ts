import type { UserProgress } from '../../domain/entities/UserProgress';
import type { IProgressRepository } from '../../domain/repositories/IProgressRepository';

export class GetProgress {
  private progressRepo: IProgressRepository;
  constructor(progressRepo: IProgressRepository) {
    this.progressRepo = progressRepo;
  }

  async byUser(userId: string): Promise<UserProgress[]> {
    return this.progressRepo.getByUser(userId);
  }

  async byFlashcard(flashcardId: string): Promise<UserProgress[]> {
    return this.progressRepo.getByFlashcard(flashcardId);
  }
}
