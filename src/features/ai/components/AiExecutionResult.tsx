import type { AiReasoningSummaryItem } from "@/features/ai/types/aiTradeReasoning";

interface AiExecutionResultProps {
  items: AiReasoningSummaryItem[];
}

export function AiExecutionResult({ items }: AiExecutionResultProps) {
  return (
    <div className="bg-bg-layer-default divide-border-neutral-muted flex flex-col divide-y rounded-2xl p-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
        >
          <span className="body-2-regular text-text-neutral-secondary">
            {item.label}
          </span>
          <span className="body-2-semibold">{item.value}</span>
        </div>
      ))}
    </div>
  );
}
