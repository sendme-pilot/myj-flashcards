import type { CardStatus } from '../value-objects/CardStatus';

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  tags: string[];
  frontImages: string[];
  backImages: string[];
  status: CardStatus;
  createdAt: Date;
  updatedAt: Date;
}
