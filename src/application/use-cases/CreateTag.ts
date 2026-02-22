import type { Tag } from '../../domain/entities/Tag';
import type { ITagRepository } from '../../domain/repositories/ITagRepository';

export class CreateTag {
  private tagRepo: ITagRepository;
  constructor(tagRepo: ITagRepository) {
    this.tagRepo = tagRepo;
  }

  async execute(name: string, category: string): Promise<Tag> {
    return this.tagRepo.create({ name, category });
  }
}
