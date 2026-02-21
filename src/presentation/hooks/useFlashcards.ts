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

export function useFlashcards(filter?: { status?: CardStatus }) {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const result = filter?.status
      ? await getFlashcards.byStatus(filter.status)
      : await getFlashcards.all();
    setCards(result);
    setLoading(false);
  }, [filter?.status]);

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

  const grouped = cards.reduce<Record<string, Flashcard[]>>((acc, card) => {
    if (!acc[card.collection]) acc[card.collection] = [];
    acc[card.collection].push(card);
    return acc;
  }, {});

  return { cards, grouped, loading, add, setStatus, reload: load };
}
