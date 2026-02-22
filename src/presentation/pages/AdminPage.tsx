import { useAuth } from '../hooks/useAuth';
import { useFlashcards } from '../hooks/useFlashcards';
import { useTags } from '../hooks/useTags';
import { useCardProgress } from '../hooks/useProgress';
import { AddFlashcardForm } from '../components/AddFlashcardForm';
import { CardStatusBadge } from '../components/CardStatusBadge';
import type { Flashcard } from '../../domain/entities/Flashcard';
import type { Tag } from '../../domain/entities/Tag';
import { Link } from 'react-router-dom';

function CardProgressSummary({ cardId }: { cardId: string }) {
  const progress = useCardProgress(cardId);
  if (progress.length === 0) return <span className="text-xs text-stone-400">尚無學習紀錄</span>;

  const totalSeen = progress.reduce((s, p) => s + p.seen, 0);
  const totalCorrect = progress.reduce((s, p) => s + p.correct, 0);

  return (
    <span className="text-xs text-stone-500">
      {progress.length} 位同工 · 共看 {totalSeen} 次 · 正確 {totalCorrect} 次
    </span>
  );
}

function AdminCardRow({
  card,
  tags,
  onApprove,
  onReject,
}: {
  card: Flashcard;
  tags: Tag[];
  onApprove: () => void;
  onReject: () => void;
}) {
  const cardTags = tags.filter((t) => card.tags.includes(t.id));

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 bg-white rounded-xl border border-gold/15">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <CardStatusBadge status={card.status} />
          {cardTags.map((t) => (
            <span key={t.id} className="px-2 py-0.5 text-[10px] rounded-full bg-gold/10 text-gold/80">
              {t.name}
            </span>
          ))}
        </div>
        <p className="text-sm text-stone-500 truncate">正面：{card.front}</p>
        <p className="text-sm text-stone-500 truncate">背面：{card.back}</p>
        {(card.frontImages.length > 0 || card.backImages.length > 0) && (
          <p className="text-xs text-stone-400">
            圖片：正面 {card.frontImages.length} 張 / 背面 {card.backImages.length} 張
          </p>
        )}
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
  const { cards, loading, add, setStatus } = useFlashcards();
  const { tags } = useTags();

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-white border-b border-gold/20 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div>
          <h1 className="text-lg font-bold text-gold">MYJ 管理後台</h1>
          <p className="text-xs text-stone-400">{user?.displayName ?? user?.email}</p>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/admin/tags" className="text-sm text-gold hover:text-gold/80 transition">
            標籤管理
          </Link>
          <button onClick={logout} className="text-sm text-stone-500 hover:text-stone-800 transition">
            登出
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-8">
        <AddFlashcardForm onSubmit={add} />

        {loading ? (
          <p className="text-center text-stone-400">載入中…</p>
        ) : cards.length === 0 ? (
          <p className="text-center text-stone-400">尚無卡片，請新增第一張卡片</p>
        ) : (
          <section>
            <h2 className="text-md font-semibold text-stone-700 mb-3 border-b border-gold/20 pb-1">
              所有卡片
              <span className="text-xs text-stone-400 ml-2">({cards.length} 張)</span>
            </h2>
            <div className="space-y-3">
              {cards.map((card) => (
                <AdminCardRow
                  key={card.id}
                  card={card}
                  tags={tags}
                  onApprove={() => setStatus(card.id, 'approved')}
                  onReject={() => setStatus(card.id, 'draft')}
                />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
