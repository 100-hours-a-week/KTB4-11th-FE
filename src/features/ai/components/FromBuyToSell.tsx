import type { AiReasoningSummaryItem } from "@/features/ai/types/aiTradeReasoning";

interface FromBuyToSellProps {
  items: AiReasoningSummaryItem[];
}

export function FromBuyToSell({ items }: FromBuyToSellProps) {
  return (
    <div className="bg-bg-layer-default divide-border-neutral-muted flex flex-col divide-y rounded-2xl p-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex flex-col gap-2 py-3 first:pt-0 last:pb-0"
        >
          <span className="body-2-regular text-text-neutral-secondary flex items-center gap-1.5">
            {item.icon && (
              <item.icon width={16} height={16} className="text-icon-accent" />
            )}
            {item.label}
          </span>
          <span className="body-2-medium">{item.value}</span>
        </div>
      ))}
    </div>
  );
}
