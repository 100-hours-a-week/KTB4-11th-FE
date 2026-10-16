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
}

const SIDE_COLUMN_CLASS =
  "grid-cols-[minmax(0,1fr)_minmax(0,164px)_minmax(0,1fr)]";

function OrderBookLimitRow({
  label,
  price,
  changeRate,
  labelBelow = false,
}: {
  label: string;
  price: number;
  changeRate: number;
  labelBelow?: boolean;
}) {
  const { colorClass } = getReturnRateInfo(changeRate);

  return (
    <div className={cn("grid", SIDE_COLUMN_CLASS)}>
      <div
        className={cn(
          "border-border-neutral-muted col-start-2 flex flex-col items-center gap-2 border-x",
          labelBelow ? "flex-col-reverse pt-5 pb-14" : "pt-36 pb-5",
        )}
      >
        <span className={cn("caption-1-semibold", colorClass)}>{label}</span>
        <span className="flex items-center gap-1.5">
          <span className={cn("body-1-semibold", colorClass)}>
            {price.toLocaleString()}
          </span>
          <span className={cn("caption-1-regular", colorClass)}>
            {formatSignedPercent(changeRate)}
          </span>
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
}: {
  level: OrderBookLevel;
  side: "ask" | "bid";
  maxQuantity: number;
  highlighted?: boolean;
}) {
  const barWidthPercent = Math.round((level.quantity / maxQuantity) * 100);
  const { colorClass } = getReturnRateInfo(level.changeRate);

  return (
    <div className={cn("grid h-9 items-center", SIDE_COLUMN_CLASS)}>
      <div className="relative flex h-full items-center justify-end px-3">
        {side === "ask" && level.quantity > 0 && (
          <div
            className="bg-sky-blue-50 absolute inset-y-1 right-0 rounded-l-lg"
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
          "flex h-full w-full items-center justify-center gap-1.5",
          highlighted
            ? "border-border-accent border-2"
            : "border-border-neutral-muted border-x border-b",
        )}
      >
        <span className={cn("body-2-semibold", colorClass)}>
          {level.price.toLocaleString()}
        </span>
        <span className={cn("caption-1-regular", colorClass)}>
          {formatSignedPercent(level.changeRate)}
        </span>
      </span>

      <div className="relative flex h-full items-center justify-start px-3">
        {side === "bid" && level.quantity > 0 && (
          <div
            className="bg-bg-error absolute inset-y-1 left-0 rounded-r-lg"
            style={{ width: `${barWidthPercent}%` }}
          />
        )}
        <span className="caption-1-regular text-text-price-rise relative z-10">
          {side === "bid" && level.quantity > 0
            ? level.quantity.toLocaleString()
            : ""}
        </span>
      </div>
    </div>
  );
}

export function StockOrderBook({ orderBook }: StockOrderBookProps) {
  const maxQuantity = Math.max(
    ...orderBook.asks.map((level) => level.quantity),
    ...orderBook.bids.map((level) => level.quantity),
  );

  return (
    <div className="bg-bg-layer-default h-full">
      <div className="max-h-full overflow-y-auto px-5 pt-3">
        <OrderBookLimitRow
          label="상한가"
          price={orderBook.upperLimitPrice}
          changeRate={orderBook.upperLimitChangeRate}
        />

        {[...orderBook.asks].reverse().map((level) => (
          <OrderBookRow
            key={level.price}
            level={level}
            side="ask"
            maxQuantity={maxQuantity}
          />
        ))}

        <OrderBookRow
          level={{
            price: orderBook.currentPrice,
            changeRate: orderBook.currentChangeRate,
            quantity: 0,
          }}
          side="ask"
          maxQuantity={maxQuantity}
          highlighted
        />

        {orderBook.bids.map((level) => (
          <OrderBookRow
            key={level.price}
            level={level}
            side="bid"
            maxQuantity={maxQuantity}
          />
        ))}

        <OrderBookLimitRow
          label="하한가"
          labelBelow
          price={orderBook.lowerLimitPrice}
          changeRate={orderBook.lowerLimitChangeRate}
        />
      </div>
    </div>
  );
}
