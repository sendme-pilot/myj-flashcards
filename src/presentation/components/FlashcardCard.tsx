import { useState } from 'react';
import type { Flashcard } from '../../domain/entities/Flashcard';

interface Props {
  card: Flashcard;
  onCorrect?: () => void;
  onReview?: () => void;
}

export function FlashcardCard({ card, onCorrect, onReview }: Props) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="w-full max-w-sm mx-auto">
      <div
        onClick={() => setFlipped(!flipped)}
        className="relative h-56 cursor-pointer perspective-1000"
      >
        <div
          className={`absolute inset-0 rounded-2xl shadow-lg transition-transform duration-500 transform-style-3d ${
            flipped ? '[transform:rotateY(180deg)]' : ''
          }`}
        >
          {/* Front */}
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-cream border-2 border-gold/30 p-6 backface-hidden">
            <p className="text-xs text-gold/60 mb-2">{card.collection} · {card.itemName}</p>
            <p className="text-xl font-semibold text-stone-800 text-center">{card.front}</p>
            <p className="text-xs text-stone-400 mt-4">點擊翻轉</p>
          </div>
          {/* Back */}
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-gold/10 border-2 border-gold/40 p-6 backface-hidden [transform:rotateY(180deg)]">
            <p className="text-xs text-gold/60 mb-2">答案</p>
            <p className="text-xl font-semibold text-stone-800 text-center">{card.back}</p>
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
