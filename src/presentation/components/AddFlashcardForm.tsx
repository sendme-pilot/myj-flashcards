import { useState, useEffect, type FormEvent } from 'react';
import type { AddFlashcardDTO } from '../../application/dtos/AddFlashcardDTO';
import type { Tag } from '../../domain/entities/Tag';
import { GetTags } from '../../application/use-cases/GetTags';
import { FirebaseTagRepository } from '../../infrastructure/repositories/FirebaseTagRepository';
import { ImageUploader } from './ImageUploader';

const tagRepo = new FirebaseTagRepository();
const getTags = new GetTags(tagRepo);

interface Props {
  onSubmit: (dto: AddFlashcardDTO) => Promise<void>;
}

export function AddFlashcardForm({ onSubmit }: Props) {
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [frontImages, setFrontImages] = useState<string[]>([]);
  const [backImages, setBackImages] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);

  useEffect(() => {
    getTags.execute().then(setAvailableTags);
  }, []);

  const toggleTag = (id: string) => {
    setSelectedTags((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!front || !back) return;
    setSubmitting(true);
    await onSubmit({ front, back, tags: selectedTags, frontImages, backImages });
    setFront('');
    setBack('');
    setSelectedTags([]);
    setFrontImages([]);
    setBackImages([]);
    setSubmitting(false);
  };

  const inputClass =
    'w-full px-4 py-2 border border-gold/30 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gold/50 text-stone-800 placeholder:text-stone-400';

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-cream/50 p-6 rounded-2xl border border-gold/20">
      <h3 className="text-lg font-semibold text-stone-800">新增卡片</h3>

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

      {/* Tag selector */}
      <div>
        <p className="text-sm font-medium text-stone-700 mb-2">標籤</p>
        <div className="flex flex-wrap gap-2">
          {availableTags.length === 0 && (
            <p className="text-xs text-stone-400">尚無標籤，請先在標籤管理中新增</p>
          )}
          {availableTags.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => toggleTag(tag.id)}
              className={`px-3 py-1 text-xs rounded-full border transition ${
                selectedTags.includes(tag.id)
                  ? 'bg-gold text-white border-gold'
                  : 'bg-white text-stone-600 border-gold/30 hover:border-gold/60'
              }`}
            >
              {tag.name}
            </button>
          ))}
        </div>
      </div>

      {/* Front images */}
      <div>
        <p className="text-sm font-medium text-stone-700 mb-2">正面圖片</p>
        <ImageUploader folder="flashcards/front" onUpload={(url) => setFrontImages((prev) => [...prev, url])} />
        {frontImages.length > 0 && (
          <div className="flex gap-2 mt-2 flex-wrap">
            {frontImages.map((url, i) => (
              <div key={i} className="relative">
                <img src={url} alt="" className="w-16 h-16 object-cover rounded-lg border border-gold/20" />
                <button
                  type="button"
                  onClick={() => setFrontImages((prev) => prev.filter((_, j) => j !== i))}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
                >
                  x
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Back images */}
      <div>
        <p className="text-sm font-medium text-stone-700 mb-2">背面圖片</p>
        <ImageUploader folder="flashcards/back" onUpload={(url) => setBackImages((prev) => [...prev, url])} />
        {backImages.length > 0 && (
          <div className="flex gap-2 mt-2 flex-wrap">
            {backImages.map((url, i) => (
              <div key={i} className="relative">
                <img src={url} alt="" className="w-16 h-16 object-cover rounded-lg border border-gold/20" />
                <button
                  type="button"
                  onClick={() => setBackImages((prev) => prev.filter((_, j) => j !== i))}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
                >
                  x
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

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
