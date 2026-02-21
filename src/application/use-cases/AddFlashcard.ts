import type { Flashcard } from '../../domain/entities/Flashcard';
import type { IFlashcardRepository } from '../../domain/repositories/IFlashcardRepository';
import type { AddFlashcardDTO } from '../dtos/AddFlashcardDTO';

export class AddFlashcard {
  private flashcardRepo: IFlashcardRepository;
  constructor(flashcardRepo: IFlashcardRepository) {
    this.flashcardRepo = flashcardRepo;
  }

  async execute(dto: AddFlashcardDTO): Promise<Flashcard> {
    return this.flashcardRepo.add({
      collection: dto.collection,
      itemName: dto.itemName,
      front: dto.front,
      back: dto.back,
      status: 'draft',
    });
  }
}
