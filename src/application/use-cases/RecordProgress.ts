import type { IProgressRepository } from '../../domain/repositories/IProgressRepository';
import type { RecordProgressDTO } from '../dtos/RecordProgressDTO';

export class RecordProgress {
  private progressRepo: IProgressRepository;
  constructor(progressRepo: IProgressRepository) {
    this.progressRepo = progressRepo;
  }

  async execute(dto: RecordProgressDTO): Promise<void> {
    const existing = await this.progressRepo.getByUser(dto.userId);
    const current = existing.find((p) => p.flashcardId === dto.flashcardId);

    await this.progressRepo.record({
      userId: dto.userId,
      flashcardId: dto.flashcardId,
      seen: (current?.seen ?? 0) + 1,
      correct: (current?.correct ?? 0) + (dto.correct ? 1 : 0),
      lastSeenAt: new Date(),
    });
  }
}
