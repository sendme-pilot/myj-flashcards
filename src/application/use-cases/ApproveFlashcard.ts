import type { IFlashcardRepository } from '../../domain/repositories/IFlashcardRepository';
import type { CardStatus } from '../../domain/value-objects/CardStatus';

export class ApproveFlashcard {
  private flashcardRepo: IFlashcardRepository;
  constructor(flashcardRepo: IFlashcardRepository) {
    this.flashcardRepo = flashcardRepo;
  }

  async execute(id: string, status: CardStatus): Promise<void> {
    return this.flashcardRepo.updateStatus(id, status);
  }
}
