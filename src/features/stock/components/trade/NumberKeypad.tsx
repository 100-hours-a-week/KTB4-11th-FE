import { cn } from "@/shared/utils/cn";

interface NumberKeypadProps {
  className?: string;
  onKey: (key: string) => void;
}

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "00", "0", "delete"];

export function NumberKeypad({ onKey, className }: NumberKeypadProps) {
  return (
    <div className={cn("grid grid-cols-3", className)} aria-label="숫자 키패드">
      {KEYS.map((key) => (
        <button
          key={key}
          type="button"
          aria-label={key === "delete" ? "마지막 숫자 삭제" : key}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => onKey(key)}
          className="text-text-neutral-primary active:bg-gray-75 flex h-[clamp(48px,7vh,64px)] items-center justify-center rounded-xl text-[30px] font-normal transition-colors"
        >
          {key === "delete" ? "←" : key}
        </button>
      ))}
    </div>
  );
}
