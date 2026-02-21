export interface UserProgress {
  userId: string;
  flashcardId: string;
  seen: number;
  correct: number;
  lastSeenAt: Date;
}
