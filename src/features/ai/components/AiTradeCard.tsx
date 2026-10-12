import Link from "next/link";
import ChevronForwardIcon from "@/assets/icons/fill/chevron-forward.svg";
import type { AiTrade } from "@/features/ai/types/aiTrade";
import { cn } from "@/shared/utils/cn";
import { getReturnRateInfo } from "@/shared/utils/getReturnRateInfo";

type AiTradeCardProps = AiTrade;

export function AiTradeCard({
  orderId,
  stockName,
  tradeType,
  tradeDate,
  quantity,
  price,
  reasoning,
  realizedProfit,
  profitRate,
}: AiTradeCardProps) {
  const { sign, colorClass } = getReturnRateInfo(realizedProfit);
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
      <p className="body-2-regular truncate">{reasoning}</p>
      <div className="mt-1 flex items-center gap-2">
        <span className={cn("body-2-semibold", colorClass)}>
          실현손익 {sign}
          {realizedProfit.toLocaleString()}원
        </span>
        <span
          className={cn(
            "caption-1-semibold rounded border border-current px-[5px] py-px",
            colorClass,
          )}
        >
          {sign}
          {profitRate}%
        </span>
      </div>
      <hr className="border-border-neutral-muted my-2" />
      <Link
        href={`/ai/trades/${orderId}`}
        className="text-text-neutral-primary body-2-semibold flex w-full items-center justify-between"
      >
        판단 근거 보기
        <ChevronForwardIcon
          width={16}
          height={16}
          className="text-icon-neutral-secondary"
        />
      </Link>
    </div>
  );
}
