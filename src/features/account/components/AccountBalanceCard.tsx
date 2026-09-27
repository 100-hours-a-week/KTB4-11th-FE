interface AccountBalanceCardProps {
  cashBalance: number;
  valuation: number;
}

export function AccountBalanceCard({
  cashBalance,
  valuation,
}: AccountBalanceCardProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="bg-bg-layer-default flex flex-col gap-1 rounded-2xl p-4">
        <span className="body-2-medium text-text-neutral-secondary">원화</span>
        <span className="heading-1-bold">{cashBalance.toLocaleString()}원</span>
      </div>
      <div className="bg-bg-layer-default flex flex-col gap-1 rounded-2xl p-4">
        <span className="body-2-medium text-text-neutral-secondary">
          평가금
        </span>
        <span className="heading-1-bold">{valuation.toLocaleString()}원</span>
      </div>
    </div>
  );
}
