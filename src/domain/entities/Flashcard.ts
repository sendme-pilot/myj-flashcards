import type { CardStatus } from '../value-objects/CardStatus';
import type { CollectionName } from '../value-objects/CollectionName';

export interface Flashcard {
  id: string;
  collection: CollectionName;
  itemName: string;
  front: string;
  back: string;
  status: CardStatus;
  createdAt: Date;
  updatedAt: Date;
}
