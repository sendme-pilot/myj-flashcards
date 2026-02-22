import type { Flashcard } from '../entities/Flashcard';
import type { CardStatus } from '../value-objects/CardStatus';

export interface IFlashcardRepository {
  getAll(): Promise<Flashcard[]>;
  getByStatus(status: CardStatus): Promise<Flashcard[]>;
  getByTags(tagIds: string[]): Promise<Flashcard[]>;
  add(flashcard: Omit<Flashcard, 'id' | 'createdAt' | 'updatedAt'>): Promise<Flashcard>;
  updateStatus(id: string, status: CardStatus): Promise<void>;
}
