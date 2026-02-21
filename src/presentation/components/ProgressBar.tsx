interface Props {
  label: string;
  current: number;
  total: number;
}

export function ProgressBar({ label, current, total }: Props) {
  const pct = total === 0 ? 0 : Math.round((current / total) * 100);

  return (
    <div className="w-full">
      <div className="flex justify-between text-sm text-stone-600 mb-1">
        <span>{label}</span>
        <span>{current}/{total} ({pct}%)</span>
      </div>
      <div className="w-full bg-stone-200 rounded-full h-3 overflow-hidden">
        <div
          className="h-full bg-gold rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
