import type { CardStatus } from '../../domain/value-objects/CardStatus';

const styles: Record<CardStatus, string> = {
  draft: 'bg-amber-100 text-amber-800',
  approved: 'bg-green-100 text-green-800',
};

const labels: Record<CardStatus, string> = {
  draft: '草稿',
  approved: '已核准',
};

export function CardStatusBadge({ status }: { status: CardStatus }) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}
