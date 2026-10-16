import CalendarClockIcon from "@/assets/icons/fill/calendar-clock.svg";
import CheckCircleIcon from "@/assets/icons/fill/check-circle.svg";
import CurrencyKrwIcon from "@/assets/icons/fill/currency-krw.svg";
import TradePendingIcon from "@/assets/icons/fill/trade-pending.svg";
import BasketFlusteredIcon from "@/assets/icons/stockspoon/basket-flustered.svg";
import CartHappyIcon from "@/assets/icons/stockspoon/cart-happy.svg";
import WalletSadIcon from "@/assets/icons/stockspoon/wallet-sad.svg";
import { useState, type ReactNode } from "react";
import type {
  StockTradeResult,
  StockTradeSide,
} from "@/features/stock/types/stockTrade";
import { STOCK_PRICE_MODE_LABELS } from "@/features/stock/types/stockTrade";
import { Button } from "@/shared/components/Button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetPortal,
  SheetTitle,
} from "@/shared/components/Sheet";

interface StockTradeResultSheetProps {
  result: StockTradeResult | null;
  stockName: string;
  side: StockTradeSide;
  onClose: () => void;
  onViewHolding: () => void;
}

export function StockTradeResultSheet({
  result,
  stockName,
  side,
  onClose,
  onViewHolding,
}: StockTradeResultSheetProps) {
  const [displayResult, setDisplayResult] = useState(result);
  if (result !== null && result !== displayResult) {
    setDisplayResult(result);
  }

  let title = "";
  let description: ReactNode = "";
  let icon: ReactNode = null;
  const isSuccess = displayResult?.type === "success";
  if (displayResult?.type === "success") {
    const result = displayResult;
    const isFilled = result.priceMode === "market";
    title = `${stockName} ${result.quantity.toLocaleString()}주 ${isFilled ? (side === "buy" ? "구매" : "판매") : "주문"} 완료`;
    icon = <CartHappyIcon width={60} height={60} />;
    description = (
      <>
        <span className="inline-flex items-center gap-2">
          <span className="inline-flex items-center gap-1">
            <CurrencyKrwIcon
              width={14}
              height={14}
              aria-hidden="true"
              className="text-icon-accent shrink-0"
            />
            {result.priceMode === "limit"
              ? "지정가"
              : STOCK_PRICE_MODE_LABELS[result.priceMode]}{" "}
            {result.price.toLocaleString()}원
          </span>
          <span
            aria-hidden="true"
            className="bg-border-neutral-tertiary h-3 w-px shrink-0"
          />
          <span className="inline-flex items-center gap-1">
            {isFilled ? (
              <CheckCircleIcon
                width={14}
                height={14}
                aria-hidden="true"
                className="text-icon-accent shrink-0"
              />
            ) : (
              <TradePendingIcon
                width={14}
                height={14}
                aria-hidden="true"
                className="text-icon-accent shrink-0"
              />
            )}
            {isFilled ? "체결 완료" : "체결 대기"}
          </span>
        </span>
        {result.pendingNextSession && (
          <span className="text-text-neutral-secondary mt-1.5 block">
            장 마감 시간이라 다음 정규장(09:00)에 체결돼요
          </span>
        )}
      </>
    );
  } else if (displayResult?.type === "insufficient-cash") {
    title = "계좌에 잔액이 부족해요";
    description = `구매를 위해 ${displayResult.shortfall.toLocaleString()}원이 더 필요해요`;
    icon = <WalletSadIcon width={60} height={60} />;
  } else if (displayResult?.type === "insufficient-shares") {
    title = "판매할 수 있는 주식이 부족해요";
    description = "판매 대기 중인 주식을 제외한 보유 수량을 확인해 주세요";
    icon = <BasketFlusteredIcon width={60} height={60} />;
  } else if (displayResult?.type === "market-closed") {
    title = "지금은 지정가 주문만 가능해요";
    description = "시장가 주문 가능 시간 : 09:00 ~ 15:30";
    icon = (
      <CalendarClockIcon width={60} height={60} className="text-icon-accent" />
    );
  }
  return (
    <Sheet
      open={result !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <SheetPortal>
        <SheetContent className="flex flex-col gap-4 p-5 pb-[max(20px,env(safe-area-inset-bottom))] text-center">
          <div className="flex flex-col gap-2">
            <div aria-hidden="true" className="flex justify-center">
              {icon}
            </div>
            <div>
              <SheetTitle>{title}</SheetTitle>
              <SheetDescription className="mt-1 whitespace-pre-line">
                {description}
              </SheetDescription>
            </div>
          </div>
          <Button onClick={isSuccess ? onViewHolding : onClose}>
            {isSuccess ? "내 주식으로 이동" : "확인"}
          </Button>
        </SheetContent>
      </SheetPortal>
    </Sheet>
  );
}
