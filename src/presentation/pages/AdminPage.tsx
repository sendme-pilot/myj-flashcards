import { useAuth } from '../hooks/useAuth';
import { useFlashcards } from '../hooks/useFlashcards';
import { useCardProgress } from '../hooks/useProgress';
import { AddFlashcardForm } from '../components/AddFlashcardForm';
import { CardStatusBadge } from '../components/CardStatusBadge';
import type { Flashcard } from '../../domain/entities/Flashcard';

function CardProgressSummary({ cardId }: { cardId: string }) {
  const progress = useCardProgress(cardId);
  if (progress.length === 0) return <span className="text-xs text-stone-400">尚無學習紀錄</span>;

  const totalSeen = progress.reduce((s, p) => s + p.seen, 0);
  const totalCorrect = progress.reduce((s, p) => s + p.correct, 0);

  return (
    <span className="text-xs text-stone-500">
      {progress.length} 位員工 · 共看 {totalSeen} 次 · 正確 {totalCorrect} 次
    </span>
  );
}

function AdminCardRow({
  card,
  onApprove,
  onReject,
}: {
  card: Flashcard;
  onApprove: () => void;
  onReject: () => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 bg-white rounded-xl border border-gold/15">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-stone-800 truncate">{card.itemName}</span>
          <CardStatusBadge status={card.status} />
        </div>
        <p className="text-sm text-stone-500 truncate">正面：{card.front}</p>
        <p className="text-sm text-stone-500 truncate">背面：{card.back}</p>
        <CardProgressSummary cardId={card.id} />
      </div>
      <div className="flex gap-2 shrink-0">
        {card.status === 'draft' && (
          <button
            onClick={onApprove}
            className="px-3 py-1 text-sm rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
          >
            核准
          </button>
        )}
        {card.status === 'approved' && (
          <button
            onClick={onReject}
            className="px-3 py-1 text-sm rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition"
          >
            退回草稿
          </button>
        )}
      </div>
    </div>
  );
}

export function AdminPage() {
  const { user, logout } = useAuth();
  const { grouped, loading, add, setStatus } = useFlashcards();

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-white border-b border-gold/20 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div>
          <h1 className="text-lg font-bold text-gold">MYJ 管理後台</h1>
          <p className="text-xs text-stone-400">{user?.displayName ?? user?.email}</p>
        </div>
        <button onClick={logout} className="text-sm text-stone-500 hover:text-stone-800 transition">
          登出
        </button>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-8">
        <AddFlashcardForm onSubmit={add} />

        {loading ? (
          <p className="text-center text-stone-400">載入中…</p>
        ) : Object.keys(grouped).length === 0 ? (
          <p className="text-center text-stone-400">尚無卡片，請新增第一張卡片</p>
        ) : (
          Object.entries(grouped).map(([col, cards]) => (
            <section key={col}>
              <h2 className="text-md font-semibold text-stone-700 mb-3 border-b border-gold/20 pb-1">
                {col}
                <span className="text-xs text-stone-400 ml-2">({cards.length} 張)</span>
              </h2>
              <div className="space-y-3">
                {cards.map((card) => (
                  <AdminCardRow
                    key={card.id}
                    card={card}
                    onApprove={() => setStatus(card.id, 'approved')}
                    onReject={() => setStatus(card.id, 'draft')}
                  />
                ))}
              </div>
            </section>
          ))
        )}
      </main>
    </div>
  );
}
