interface StockTickerBarProps {
  title: string;
}

export function StockTickerBar({ title }: StockTickerBarProps) {
  return (
    <div className="bg-bg-layer-default flex items-end gap-3 px-6 py-3">
      <span className="title-1">{title}</span>
      <span className="body-2-medium text-text-neutral-secondary">
        KOSPI 3,142 −0.4%
      </span>
    </div>
  );
}
