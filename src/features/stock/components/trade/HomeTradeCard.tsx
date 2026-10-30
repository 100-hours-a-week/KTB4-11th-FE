import CartIcon from "@/assets/icons/fill/cart.svg";
import type { Trade } from "@/shared/types/trade";
import { cn } from "@/shared/utils/cn";
import { getReturnRateInfo } from "@/shared/utils/getReturnRateInfo";

type HomeTradeCardProps = Trade;

export function HomeTradeCard({
  stockName,
  tradeSide,
  tradeDate,
  quantity,
  price,
  realizedProfit,
  profitRate,
}: HomeTradeCardProps) {
  const hasRealizedProfit = realizedProfit !== undefined;
  const { sign, colorClass } = getReturnRateInfo(realizedProfit ?? 0);
  const isBuy = tradeSide === "매수";

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
          {tradeSide}
        </span>
      </div>
      <span className="body-2-regular text-text-neutral-secondary">
        {tradeDate} | {quantity}주 · {price.toLocaleString()}원
      </span>
      {hasRealizedProfit ? (
        <div className="mt-1 flex items-center gap-2">
          <span className={cn("body-2-semibold", colorClass)}>
            실현손익 {sign}
            {realizedProfit.toLocaleString()}원
          </span>
          {profitRate !== undefined && (
            <span
              className={cn(
                "caption-1-semibold rounded border border-current px-[5px] py-px",
                colorClass,
              )}
            >
              {sign}
              {profitRate}%
            </span>
          )}
        </div>
      ) : (
        <span className="body-2-semibold mt-1 flex items-center gap-1">
          <CartIcon width={16} height={16} className="text-icon-accent" />총{" "}
          {(quantity * price).toLocaleString()}원 {tradeSide}했어요
        </span>
      )}
    </div>
  );
}
