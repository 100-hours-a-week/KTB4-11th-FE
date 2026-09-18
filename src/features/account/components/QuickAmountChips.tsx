"use client";

const QUICK_AMOUNTS = [
  { label: "+ 100만", value: 1_000_000 },
  { label: "+ 500만", value: 5_000_000 },
  { label: "+ 1,000만", value: 10_000_000 },
];

interface QuickAmountChipsProps {
  onAdd: (amount: number) => void;
  onManualInput: () => void;
}

export function QuickAmountChips({
  onAdd,
  onManualInput,
}: QuickAmountChipsProps) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {QUICK_AMOUNTS.map(({ label, value }) => (
        <button
          key={label}
          type="button"
          onClick={() => onAdd(value)}
          className="bg-bg-layer-default border-border-neutral-muted text-text-neutral-secondary body-2-medium rounded-full border px-2 py-1.5 whitespace-nowrap transition-colors active:bg-gray-50"
        >
          {label}
        </button>
      ))}
      <button
        type="button"
        onClick={onManualInput}
        className="bg-bg-layer-default border-border-neutral-muted text-text-neutral-secondary body-2-medium rounded-full border px-2 py-1.5 whitespace-nowrap transition-colors active:bg-gray-50"
      >
        직접 입력
      </button>
    </div>
  );
}
