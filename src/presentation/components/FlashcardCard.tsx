import { useState } from 'react';
import type { Flashcard } from '../../domain/entities/Flashcard';
import type { Tag } from '../../domain/entities/Tag';

interface Props {
  card: Flashcard;
  tags?: Tag[];
  onCorrect?: () => void;
  onReview?: () => void;
}

function ImageGallery({ images }: { images: string[] }) {
  if (images.length === 0) return null;
  return (
    <div className="flex gap-2 mt-2 justify-center flex-wrap">
      {images.map((url, i) => (
        <img key={i} src={url} alt="" className="w-20 h-20 object-cover rounded-lg border border-gold/20" />
      ))}
    </div>
  );
}

export function FlashcardCard({ card, tags = [], onCorrect, onReview }: Props) {
  const [flipped, setFlipped] = useState(false);

  const cardTags = tags.filter((t) => card.tags.includes(t.id));

  return (
    <div className="w-full max-w-sm mx-auto">
      <div
        onClick={() => setFlipped(!flipped)}
        className="relative min-h-56 cursor-pointer perspective-1000"
      >
        <div
          className={`rounded-2xl shadow-lg transition-transform duration-500 transform-style-3d ${
            flipped ? '[transform:rotateY(180deg)]' : ''
          }`}
        >
          {/* Front */}
          <div className={`flex flex-col items-center justify-center rounded-2xl bg-cream border-2 border-gold/30 p-6 backface-hidden ${flipped ? 'hidden' : ''}`}>
            {cardTags.length > 0 && (
              <div className="flex gap-1 flex-wrap justify-center mb-2">
                {cardTags.map((t) => (
                  <span key={t.id} className="px-2 py-0.5 text-[10px] rounded-full bg-gold/10 text-gold/80">
                    {t.name}
                  </span>
                ))}
              </div>
            )}
            <p className="text-xl font-semibold text-stone-800 text-center">{card.front}</p>
            <ImageGallery images={card.frontImages} />
            <p className="text-xs text-stone-400 mt-4">點擊翻轉</p>
          </div>
          {/* Back */}
          <div className={`flex flex-col items-center justify-center rounded-2xl bg-gold/10 border-2 border-gold/40 p-6 backface-hidden [transform:rotateY(180deg)] ${!flipped ? 'hidden' : ''}`}>
            <p className="text-xs text-gold/60 mb-2">答案</p>
            <p className="text-xl font-semibold text-stone-800 text-center">{card.back}</p>
            <ImageGallery images={card.backImages} />
          </div>
        </div>
      </div>

      {flipped && onCorrect && onReview && (
        <div className="flex gap-3 mt-4 justify-center">
          <button
            onClick={() => { onCorrect(); setFlipped(false); }}
            className="px-6 py-2 rounded-full bg-green-600 text-white font-medium hover:bg-green-700 transition"
          >
            記住了
          </button>
          <button
            onClick={() => { onReview(); setFlipped(false); }}
            className="px-6 py-2 rounded-full bg-amber-500 text-white font-medium hover:bg-amber-600 transition"
          >
            再複習
          </button>
        </div>
      )}
    </div>
  );
}
