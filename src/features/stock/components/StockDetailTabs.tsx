import type { StockDetailTab } from "@/features/stock/types/stockDetail";
import { Tabs } from "@/shared/components/Tabs";
interface StockDetailTabsProps {
  tabs: readonly StockDetailTab[];
  value: StockDetailTab;
  onChange: (value: StockDetailTab) => void;
}
export function StockDetailTabs(props: StockDetailTabsProps) {
  return <Tabs {...props} />;
}
