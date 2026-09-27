interface AccountPerformanceCardProps {
  returnPercent: number;
  tradeCount: number;
}

export function AccountPerformanceCard({
  returnPercent,
  tradeCount,
}: AccountPerformanceCardProps) {
  const isRise = returnPercent > 0;

  return (
    <div className="bg-bg-layer-default divide-border-neutral-muted grid grid-cols-2 divide-x rounded-2xl p-4">
      <div className="flex flex-col items-center gap-1">
        <span className="body-2-medium text-text-neutral-secondary">
          누적 수익률
        </span>
        <span className="heading-1-bold text-text-accent">
          {isRise ? "+" : ""}
          {returnPercent}%
        </span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <span className="body-2-medium text-text-neutral-secondary">거래</span>
        <span className="heading-1-bold">{tradeCount}회</span>
      </div>
    </div>
  );
}
