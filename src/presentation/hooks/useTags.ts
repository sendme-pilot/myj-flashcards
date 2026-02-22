import { useCallback, useEffect, useState } from 'react';
import type { Tag } from '../../domain/entities/Tag';
import { GetTags } from '../../application/use-cases/GetTags';
import { CreateTag } from '../../application/use-cases/CreateTag';
import { DeleteTag } from '../../application/use-cases/DeleteTag';
import { FirebaseTagRepository } from '../../infrastructure/repositories/FirebaseTagRepository';

const repo = new FirebaseTagRepository();
const getTags = new GetTags(repo);
const createTag = new CreateTag(repo);
const deleteTag = new DeleteTag(repo);

export function useTags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const result = await getTags.execute();
    setTags(result);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const add = async (name: string, category: string) => {
    await createTag.execute(name, category);
    await load();
  };

  const remove = async (id: string) => {
    await deleteTag.execute(id);
    await load();
  };

  const grouped = tags.reduce<Record<string, Tag[]>>((acc, tag) => {
    if (!acc[tag.category]) acc[tag.category] = [];
    acc[tag.category].push(tag);
    return acc;
  }, {});

  return { tags, grouped, loading, add, remove, reload: load };
}
