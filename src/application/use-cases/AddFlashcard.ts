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
      front: dto.front,
      back: dto.back,
      tags: dto.tags,
      frontImages: dto.frontImages,
      backImages: dto.backImages,
      status: 'draft',
    });
  }
}
