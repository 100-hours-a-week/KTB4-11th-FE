import { Button } from "@/shared/components/Button";

interface StockTradeButtonsProps {
  showSell: boolean;
  onSellClick?: () => void;
  onBuyClick?: () => void;
}

export function StockTradeButtons({
  showSell,
  onSellClick,
  onBuyClick,
}: StockTradeButtonsProps) {
  return (
    <div className="bg-bg-layer-basement flex gap-2 px-5 pb-4">
      {showSell && (
        <Button
          className="text-text-neutral-secondary border-border-neutral-muted flex-1 border bg-white active:bg-gray-50"
          onClick={onSellClick}
        >
          판매하기
        </Button>
      )}
      <Button className="flex-1" onClick={onBuyClick}>
        구매하기
      </Button>
    </div>
  );
}
