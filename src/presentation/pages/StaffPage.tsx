import { useMemo, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useFlashcards } from '../hooks/useFlashcards';
import { useProgress } from '../hooks/useProgress';
import { FlashcardCard } from '../components/FlashcardCard';
import { ProgressBar } from '../components/ProgressBar';

export function StaffPage() {
  const { user, logout } = useAuth();
  const { grouped, loading: cardsLoading } = useFlashcards({ status: 'approved' });
  const { progress, record } = useProgress(user?.uid);

  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const collections = Object.keys(grouped);
  const currentCards = selectedCollection ? grouped[selectedCollection] ?? [] : [];

  const seenIds = useMemo(
    () => new Set(progress.filter((p) => p.correct > 0).map((p) => p.flashcardId)),
    [progress],
  );

  const handleCorrect = async () => {
    const card = currentCards[currentIndex];
    if (!card) return;
    await record(card.id, true);
    if (currentIndex < currentCards.length - 1) {
      setCurrentIndex((i) => i + 1);
    }
  };

  const handleReview = async () => {
    const card = currentCards[currentIndex];
    if (!card) return;
    await record(card.id, false);
    if (currentIndex < currentCards.length - 1) {
      setCurrentIndex((i) => i + 1);
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-white border-b border-gold/20 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div>
          <h1 className="text-lg font-bold text-gold">MYJ 培訓卡</h1>
          <p className="text-xs text-stone-400">{user?.displayName ?? user?.email}</p>
        </div>
        <button onClick={logout} className="text-sm text-stone-500 hover:text-stone-800 transition">
          登出
        </button>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {cardsLoading ? (
          <p className="text-center text-stone-400">載入中…</p>
        ) : !selectedCollection ? (
          <>
            <h2 className="text-lg font-semibold text-stone-700">選擇系列</h2>
            <div className="space-y-3">
              {collections.length === 0 ? (
                <p className="text-stone-400 text-center">目前沒有可學習的卡片</p>
              ) : (
                collections.map((col) => {
                  const cards = grouped[col];
                  const done = cards.filter((c) => seenIds.has(c.id)).length;
                  return (
                    <button
                      key={col}
                      onClick={() => { setSelectedCollection(col); setCurrentIndex(0); }}
                      className="w-full text-left p-4 bg-white rounded-xl border border-gold/20 hover:border-gold/40 transition"
                    >
                      <p className="font-medium text-stone-800">{col}</p>
                      <ProgressBar label="完成進度" current={done} total={cards.length} />
                    </button>
                  );
                })
              )}
            </div>
          </>
        ) : (
          <>
            <button
              onClick={() => setSelectedCollection(null)}
              className="text-sm text-gold hover:text-gold/80 transition"
            >
              ← 返回系列列表
            </button>

            <ProgressBar
              label={selectedCollection}
              current={currentCards.filter((c) => seenIds.has(c.id)).length}
              total={currentCards.length}
            />

            {currentCards.length === 0 ? (
              <p className="text-center text-stone-400">此系列沒有卡片</p>
            ) : currentIndex >= currentCards.length ? (
              <div className="text-center py-12">
                <p className="text-xl font-semibold text-stone-700">恭喜完成！</p>
                <p className="text-stone-500 mt-2">您已複習完此系列所有卡片</p>
                <button
                  onClick={() => setCurrentIndex(0)}
                  className="mt-4 px-6 py-2 rounded-full bg-gold text-white font-medium hover:bg-gold/90 transition"
                >
                  重新開始
                </button>
              </div>
            ) : (
              <>
                <p className="text-center text-sm text-stone-400">
                  第 {currentIndex + 1} / {currentCards.length} 張
                </p>
                <FlashcardCard
                  card={currentCards[currentIndex]}
                  onCorrect={handleCorrect}
                  onReview={handleReview}
                />
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}
