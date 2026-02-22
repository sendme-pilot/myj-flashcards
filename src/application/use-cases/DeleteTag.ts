import type { ITagRepository } from '../../domain/repositories/ITagRepository';

export class DeleteTag {
  private tagRepo: ITagRepository;
  constructor(tagRepo: ITagRepository) {
    this.tagRepo = tagRepo;
  }

  async execute(id: string): Promise<void> {
    return this.tagRepo.delete(id);
  }
}
