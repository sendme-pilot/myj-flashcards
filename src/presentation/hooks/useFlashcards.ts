import { useCallback, useEffect, useState } from 'react';
import type { Flashcard } from '../../domain/entities/Flashcard';
import type { CardStatus } from '../../domain/value-objects/CardStatus';
import { GetFlashcards } from '../../application/use-cases/GetFlashcards';
import { AddFlashcard } from '../../application/use-cases/AddFlashcard';
import { ApproveFlashcard } from '../../application/use-cases/ApproveFlashcard';
import { FirebaseFlashcardRepository } from '../../infrastructure/repositories/FirebaseFlashcardRepository';
import type { AddFlashcardDTO } from '../../application/dtos/AddFlashcardDTO';

const repo = new FirebaseFlashcardRepository();
const getFlashcards = new GetFlashcards(repo);
const addFlashcard = new AddFlashcard(repo);
const approveFlashcard = new ApproveFlashcard(repo);

export function useFlashcards(filter?: { status?: CardStatus; tagIds?: string[] }) {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);

  const tagKey = filter?.tagIds?.join(',') ?? '';

  const load = useCallback(async () => {
    setLoading(true);
    let result: Flashcard[];
    if (filter?.tagIds && filter.tagIds.length > 0) {
      result = await getFlashcards.byTags(filter.tagIds);
      if (filter.status) {
        result = result.filter((c) => c.status === filter.status);
      }
    } else if (filter?.status) {
      result = await getFlashcards.byStatus(filter.status);
    } else {
      result = await getFlashcards.all();
    }
    setCards(result);
    setLoading(false);
  }, [filter?.status, tagKey]);

  useEffect(() => {
    load();
  }, [load]);

  const add = async (dto: AddFlashcardDTO) => {
    await addFlashcard.execute(dto);
    await load();
  };

  const setStatus = async (id: string, status: CardStatus) => {
    await approveFlashcard.execute(id, status);
    await load();
  };

  return { cards, loading, add, setStatus, reload: load };
}
