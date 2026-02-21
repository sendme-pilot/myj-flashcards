import { useCallback, useEffect, useState } from 'react';
import type { UserProgress } from '../../domain/entities/UserProgress';
import { GetProgress } from '../../application/use-cases/GetProgress';
import { RecordProgress } from '../../application/use-cases/RecordProgress';
import { FirebaseProgressRepository } from '../../infrastructure/repositories/FirebaseProgressRepository';

const repo = new FirebaseProgressRepository();
const getProgress = new GetProgress(repo);
const recordProgress = new RecordProgress(repo);

export function useProgress(userId: string | undefined) {
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const result = await getProgress.byUser(userId);
    setProgress(result);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  const record = async (flashcardId: string, correct: boolean) => {
    if (!userId) return;
    await recordProgress.execute({ userId, flashcardId, correct });
    await load();
  };

  return { progress, loading, record, reload: load };
}

export function useCardProgress(flashcardId: string) {
  const [progress, setProgress] = useState<UserProgress[]>([]);

  useEffect(() => {
    const prog = new GetProgress(repo);
    prog.byFlashcard(flashcardId).then(setProgress);
  }, [flashcardId]);

  return progress;
}
