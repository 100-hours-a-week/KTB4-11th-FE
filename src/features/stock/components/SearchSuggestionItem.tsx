import { StockLogo } from "@/shared/components/StockLogo";
import { highlightMatch } from "@/shared/utils/highlightMatch";

interface SearchSuggestionItemProps {
  stockCode: string;
  name: string;
  query: string;
  matchedBy: "name" | "code";
  onClick: () => void;
}

export function SearchSuggestionItem({
  stockCode,
  name,
  query,
  matchedBy,
  onClick,
}: SearchSuggestionItemProps) {
  return (
    <div
      onClick={onClick}
      className="flex cursor-pointer items-center gap-3 rounded-2xl px-3 py-2.5"
    >
      <StockLogo code={stockCode} className="size-9" />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="body-2-semibold truncate">
          {matchedBy === "name" ? highlightMatch(name, query) : name}
        </span>
        {matchedBy === "code" && (
          <span className="caption-1-regular text-text-neutral-tertiary">
            {highlightMatch(stockCode, query)}
          </span>
        )}
      </div>
    </div>
  );
}
