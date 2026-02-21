import { useState, type FormEvent } from 'react';
import type { AddFlashcardDTO } from '../../application/dtos/AddFlashcardDTO';

interface Props {
  onSubmit: (dto: AddFlashcardDTO) => Promise<void>;
}

export function AddFlashcardForm({ onSubmit }: Props) {
  const [collection, setCollection] = useState('');
  const [itemName, setItemName] = useState('');
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!collection || !itemName || !front || !back) return;
    setSubmitting(true);
    await onSubmit({ collection, itemName, front, back });
    setCollection('');
    setItemName('');
    setFront('');
    setBack('');
    setSubmitting(false);
  };

  const inputClass =
    'w-full px-4 py-2 border border-gold/30 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gold/50 text-stone-800 placeholder:text-stone-400';

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-cream/50 p-6 rounded-2xl border border-gold/20">
      <h3 className="text-lg font-semibold text-stone-800">新增卡片</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          className={inputClass}
          placeholder="系列名稱"
          value={collection}
          onChange={(e) => setCollection(e.target.value)}
        />
        <input
          className={inputClass}
          placeholder="品項名稱"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
        />
      </div>
      <input
        className={inputClass}
        placeholder="正面（問題）"
        value={front}
        onChange={(e) => setFront(e.target.value)}
      />
      <input
        className={inputClass}
        placeholder="背面（答案）"
        value={back}
        onChange={(e) => setBack(e.target.value)}
      />
      <button
        type="submit"
        disabled={submitting}
        className="w-full py-2 rounded-lg bg-gold text-white font-medium hover:bg-gold/90 transition disabled:opacity-50"
      >
        {submitting ? '新增中…' : '新增卡片'}
      </button>
    </form>
  );
}
