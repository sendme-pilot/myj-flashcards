import type { Tag } from '../entities/Tag';

export interface ITagRepository {
  getAll(): Promise<Tag[]>;
  create(tag: Omit<Tag, 'id' | 'createdAt'>): Promise<Tag>;
  update(id: string, data: Partial<Pick<Tag, 'name' | 'category'>>): Promise<void>;
  delete(id: string): Promise<void>;
}
