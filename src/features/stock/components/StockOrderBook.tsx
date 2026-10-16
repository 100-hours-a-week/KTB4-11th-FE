import { useEffect, useRef } from "react";
import type {
  OrderBook,
  OrderBookLevel,
} from "@/features/stock/types/stockDetail";
import { cn } from "@/shared/utils/cn";
import {
  formatSignedPercent,
  getReturnRateInfo,
} from "@/shared/utils/getReturnRateInfo";

interface StockOrderBookProps {
  orderBook: OrderBook;
  onPriceSelect?: (price: number) => void;
  selectedPrice?: number;
  showLimits?: boolean;
  showChangeRate?: boolean;
  currentQuantity?: number;
  className?: string;
}

const SIDE_COLUMN_CLASS =
  "grid-cols-[minmax(0,1fr)_minmax(0,164px)_minmax(0,1fr)]";

const TRADE_COLUMN_CLASS = "grid-cols-[1fr_126px_1fr]";

function OrderBookLimitRow({
  label,
  price,
  changeRate,
  compact = false,
  labelBelow = false,
  showChangeRate = true,
}: {
  label: string;
  price: number;
  changeRate: number;
  compact?: boolean;
  labelBelow?: boolean;
  showChangeRate?: boolean;
}) {
  const { colorClass } = getReturnRateInfo(changeRate);

  return (
    <div
      className={cn("grid", compact ? TRADE_COLUMN_CLASS : SIDE_COLUMN_CLASS)}
    >
      <div
        className={cn(
          "border-border-neutral-muted col-start-2 flex flex-col items-center gap-2 border-x",
          labelBelow && "flex-col-reverse",
          compact ? "py-4" : labelBelow ? "pt-5 pb-14" : "pt-36 pb-5",
        )}
      >
        <span className={cn("caption-1-semibold", colorClass)}>{label}</span>
        <span className="flex items-center gap-1.5">
          <span className={cn("body-1-semibold", colorClass)}>
            {price.toLocaleString()}
          </span>
          {showChangeRate && (
            <span className={cn("caption-1-regular", colorClass)}>
              {formatSignedPercent(changeRate)}
            </span>
          )}
        </span>
      </div>
    </div>
  );
}

function OrderBookRow({
  level,
  side,
  maxQuantity,
  highlighted = false,
  onPriceSelect,
  showChangeRate = true,
  selected = false,
}: {
  level: OrderBookLevel;
  side: "ask" | "bid";
  maxQuantity: number;
  highlighted?: boolean;
  onPriceSelect?: (price: number) => void;
  showChangeRate?: boolean;
  selected?: boolean;
}) {
  const Row = onPriceSelect ? "button" : "div";
  const barWidthPercent = Math.round((level.quantity / maxQuantity) * 100);
  const { colorClass } = getReturnRateInfo(level.changeRate);

  return (
    <Row
      type={onPriceSelect ? "button" : undefined}
      onClick={onPriceSelect ? () => onPriceSelect(level.price) : undefined}
      aria-label={
        onPriceSelect ? `${level.price.toLocaleString()}원 선택` : undefined
      }
      aria-pressed={onPriceSelect ? selected : undefined}
      data-current-price={highlighted || undefined}
      className={cn(
        "grid w-full items-center",
        onPriceSelect
          ? `group h-11 ${TRADE_COLUMN_CLASS}`
          : `h-9 ${SIDE_COLUMN_CLASS}`,
      )}
    >
      <div className="relative flex h-full items-center justify-end px-3">
        {side === "ask" && level.quantity > 0 && (
          <div
            className="absolute inset-y-1 right-0 rounded-l-lg bg-[color-mix(in_srgb,var(--color-blue-50),var(--color-blue-100))]"
            style={{ width: `${barWidthPercent}%` }}
          />
        )}
        <span className="caption-1-regular text-text-price-fall relative z-10">
          {side === "ask" && level.quantity > 0
            ? level.quantity.toLocaleString()
            : ""}
        </span>
      </div>

      <span
        className={cn(
          "flex h-full w-full items-center justify-center gap-1.5 transition-colors",
          onPriceSelect && "group-active:bg-gray-75",
          highlighted
            ? "border-border-accent border-2"
            : "border-border-neutral-muted border-x",
        )}
      >
        <span className={cn("body-2-semibold", colorClass)}>
          {level.price.toLocaleString()}
        </span>
        {showChangeRate && (
          <span className={cn("caption-1-regular", colorClass)}>
            {formatSignedPercent(level.changeRate)}
          </span>
        )}
      </span>

      <div className="relative flex h-full items-center justify-start px-3">
        {side === "bid" && level.quantity > 0 && (
          <div
            className="absolute inset-y-1 left-0 rounded-r-lg bg-[color-mix(in_srgb,var(--color-red-50),var(--color-red-100))]"
            style={{ width: `${barWidthPercent}%` }}
          />
        )}
        <span className="caption-1-regular text-text-price-rise relative z-10">
          {side === "bid" && level.quantity > 0
            ? level.quantity.toLocaleString()
            : ""}
        </span>
      </div>
    </Row>
  );
}

export function StockOrderBook({
  orderBook,
  onPriceSelect,
  selectedPrice,
  showLimits = true,
  showChangeRate = true,
  currentQuantity = 0,
  className,
}: StockOrderBookProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const selectable = Boolean(onPriceSelect);
  useEffect(() => {
    if (!selectable) return;
    const element = scrollRef.current;
    const current = element?.querySelector<HTMLElement>("[data-current-price]");
    if (element && current)
      element.scrollTop =
        current.offsetTop -
        element.offsetTop -
        element.clientHeight / 2 +
        current.offsetHeight / 2;
  }, [orderBook.currentPrice, selectable]);
  const maxQuantity = Math.max(
    1,
    currentQuantity,
    ...orderBook.asks.map((level) => level.quantity),
    ...orderBook.bids.map((level) => level.quantity),
  );

  return (
    <div className={cn("bg-bg-layer-default h-full", className)}>
      <div
        ref={scrollRef}
        className="relative max-h-full overflow-y-auto px-5 pt-3"
      >
        {showLimits && (
          <OrderBookLimitRow
            label="상한가"
            compact={selectable}
            price={orderBook.upperLimitPrice}
            changeRate={orderBook.upperLimitChangeRate}
            showChangeRate={showChangeRate}
          />
        )}

        {[...orderBook.asks].reverse().map((level) => (
          <OrderBookRow
            key={level.price}
            level={level}
            side="ask"
            maxQuantity={maxQuantity}
            onPriceSelect={onPriceSelect}
            selected={selectedPrice === level.price}
            showChangeRate={showChangeRate}
          />
        ))}

        <OrderBookRow
          level={{
            price: orderBook.currentPrice,
            changeRate: orderBook.currentChangeRate,
            quantity: currentQuantity,
          }}
          side="ask"
          maxQuantity={maxQuantity}
          highlighted
          onPriceSelect={onPriceSelect}
          selected={selectedPrice === orderBook.currentPrice}
          showChangeRate={showChangeRate}
        />

        {orderBook.bids.map((level) => (
          <OrderBookRow
            key={level.price}
            level={level}
            side="bid"
            maxQuantity={maxQuantity}
            onPriceSelect={onPriceSelect}
            selected={selectedPrice === level.price}
            showChangeRate={showChangeRate}
          />
        ))}

        {showLimits && (
          <OrderBookLimitRow
            label="하한가"
            compact={selectable}
            labelBelow
            price={orderBook.lowerLimitPrice}
            changeRate={orderBook.lowerLimitChangeRate}
            showChangeRate={showChangeRate}
          />
        )}
      </div>
    </div>
  );
}
