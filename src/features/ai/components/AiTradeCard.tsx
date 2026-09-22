import ChevronForwardIcon from "@/assets/icons/fill/chevron-forward.svg";
import type { AiTrade } from "@/features/ai/types/aiTrade";
import { cn } from "@/shared/utils/cn";

type AiTradeCardProps = AiTrade;

export function AiTradeCard({
  stockName,
  tradeType,
  tradeDate,
  quantity,
  price,
  reasoning,
  realizedProfit,
  profitRate,
}: AiTradeCardProps) {
  const isProfit = realizedProfit > 0;
  const isLoss = realizedProfit < 0;
  const isBuy = tradeType === "매수";

  return (
    <div className="bg-bg-layer-default flex flex-col gap-1 rounded-2xl p-4">
      <div className="mb-1 flex items-center gap-2">
        <span className="body-1-semibold">{stockName}</span>
        <span
          className={cn(
            "caption-1-semibold rounded px-[5px] py-px",
            isBuy
              ? "bg-bg-accent text-text-neutral-inverse"
              : "bg-sky-blue-50 text-text-accent",
          )}
        >
          {tradeType}
        </span>
      </div>
      <span className="body-2-regular text-text-neutral-secondary">
        {tradeDate} | {quantity}주 · {price.toLocaleString()}원
      </span>
      <p className="body-2-regular">{reasoning}</p>
      <div className="mt-1 flex items-center gap-2">
        <span
          className={cn(
            "body-2-semibold",
            isProfit && "text-text-price-rise",
            isLoss && "text-text-price-fall",
            !isProfit && !isLoss && "text-text-price-flat",
          )}
        >
          실현손익 {isProfit ? "+" : ""}
          {realizedProfit.toLocaleString()}원
        </span>
        <span
          className={cn(
            "caption-1-semibold rounded border border-current px-[5px] py-px",
            isProfit && "text-text-price-rise",
            isLoss && "text-text-price-fall",
            !isProfit && !isLoss && "text-text-price-flat",
          )}
        >
          {isProfit ? "+" : ""}
          {profitRate}%
        </span>
      </div>
      <hr className="border-border-neutral-muted my-2" />
      <button
        type="button"
        className="text-text-neutral-primary body-2-semibold flex w-full items-center justify-between"
      >
        판단 근거 보기
        <ChevronForwardIcon
          width={16}
          height={16}
          className="text-icon-neutral-secondary"
        />
      </button>
    </div>
  );
}
