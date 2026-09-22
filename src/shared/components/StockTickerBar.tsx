interface StockTickerBarProps {
  title: string;
}

export function StockTickerBar({ title }: StockTickerBarProps) {
  return (
    <div className="flex items-center gap-3 px-5 py-3">
      <span className="title-1">{title}</span>
      <span className="body-2-medium text-text-neutral-secondary">
        KOSPI 3,142 −0.4%
      </span>
    </div>
  );
}
