import type { Flashcard } from '../../domain/entities/Flashcard';
import type { IFlashcardRepository } from '../../domain/repositories/IFlashcardRepository';
import type { CardStatus } from '../../domain/value-objects/CardStatus';

export class GetFlashcards {
  private flashcardRepo: IFlashcardRepository;
  constructor(flashcardRepo: IFlashcardRepository) {
    this.flashcardRepo = flashcardRepo;
  }

  async all(): Promise<Flashcard[]> {
    return this.flashcardRepo.getAll();
  }

  async byStatus(status: CardStatus): Promise<Flashcard[]> {
    return this.flashcardRepo.getByStatus(status);
  }

  async byCollection(collection: string): Promise<Flashcard[]> {
    return this.flashcardRepo.getByCollection(collection);
  }
}
