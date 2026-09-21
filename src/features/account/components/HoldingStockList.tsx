import { HoldingStockItem } from "@/features/account/components/HoldingStockItem";

interface HoldingStock {
  id: string;
  name: string;
  category: string;
  quantity: number;
  avgPrice: number;
  value: number;
  changeRate: number;
}

interface HoldingStockListProps {
  stocks: HoldingStock[];
}

export function HoldingStockList({ stocks }: HoldingStockListProps) {
  return (
    <div className="flex flex-col gap-2">
      <span className="body-1-bold">보유 주식</span>
      <div className="flex flex-col gap-2">
        {stocks.map((stock) => (
          <HoldingStockItem key={stock.id} {...stock} />
        ))}
      </div>
    </div>
  );
}
