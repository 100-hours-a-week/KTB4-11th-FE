import { AiTradeCard } from "@/features/ai/components/AiTradeCard";
import type { AiTrade } from "@/features/ai/types/aiTrade";
import ChevronForwardIcon from "@/assets/icons/fill/chevron-forward.svg";

interface RecentAiTradeSectionProps {
  trades: AiTrade[];
}

export function RecentAiTradeSection({ trades }: RecentAiTradeSectionProps) {
  const [firstTrade] = trades;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="body-1-bold">최근 AI 매매 현황</span>
        <div className="flex items-center gap-1">
          {trades.map((trade, index) => (
            <span
              key={trade.stockName + trade.tradeDate}
              className={
                index === 0
                  ? "bg-bg-neutral-primary size-1.5 rounded-full"
                  : "bg-bg-neutral-tertiary size-1.5 rounded-full"
              }
            />
          ))}
        </div>
      </div>
      {firstTrade && <AiTradeCard {...firstTrade} />}
      <button
        type="button"
        className="text-text-neutral-secondary caption-1-regular flex items-center justify-center gap-0.5 py-1"
      >
        AI 매매 내역 전체 보기
        <ChevronForwardIcon width={12} height={12} />
      </button>
    </div>
  );
}
