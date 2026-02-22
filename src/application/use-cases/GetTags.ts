import type { Tag } from '../../domain/entities/Tag';
import type { ITagRepository } from '../../domain/repositories/ITagRepository';

export class GetTags {
  private tagRepo: ITagRepository;
  constructor(tagRepo: ITagRepository) {
    this.tagRepo = tagRepo;
  }

  async execute(): Promise<Tag[]> {
    return this.tagRepo.getAll();
  }
}
