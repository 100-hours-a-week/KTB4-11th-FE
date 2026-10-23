import type { RefObject } from "react";
import type {
  PendingOrder,
  StockHolding,
} from "@/features/stock/types/stockDetail";
import type { Trade } from "@/shared/types/trade";
import { StockHoldingSummary } from "@/features/stock/components/StockHoldingSummary";
import {
  StockHoldingSummarySkeleton,
  StockHoldingTabSkeleton,
} from "@/features/stock/components/StockHoldingTabSkeleton";
import { StockOrderHistoryList } from "@/features/stock/components/StockOrderHistoryList";
import { StockPendingOrderList } from "@/features/stock/components/StockPendingOrderList";

interface StockHoldingTabProps {
  hasHolding: boolean;
  holding?: StockHolding;
  isLoadingHoldingValuation: boolean;
  isCheckingActivity: boolean;
  pendingOrders: PendingOrder[];
  orderHistory: Trade[];
  hasMorePendingOrders: boolean;
  hasMoreOrderHistory: boolean;
  pendingOrdersSentinelRef: RefObject<HTMLDivElement | null>;
  orderHistorySentinelRef: RefObject<HTMLDivElement | null>;
  onCancelOrder: (orderId: number) => void;
}

// 데이터·로딩 상태·콜백을 받아 내 주식 탭 UI만 표시한다.
export function StockHoldingTab({
  hasHolding,
  holding,
  isLoadingHoldingValuation,
  isCheckingActivity,
  pendingOrders,
  orderHistory,
  hasMorePendingOrders,
  hasMoreOrderHistory,
  pendingOrdersSentinelRef,
  orderHistorySentinelRef,
  onCancelOrder,
}: StockHoldingTabProps) {
  return (
    <div className="flex flex-col gap-4 px-5 pt-4">
      {hasHolding && holding && <StockHoldingSummary holding={holding} />}
      {hasHolding && !holding && isLoadingHoldingValuation && (
        <StockHoldingSummarySkeleton />
      )}
      {isCheckingActivity && <StockHoldingTabSkeleton />}
      <StockPendingOrderList orders={pendingOrders} onCancel={onCancelOrder} />
      {hasMorePendingOrders && (
        <div ref={pendingOrdersSentinelRef} className="h-1" />
      )}
      {(hasHolding || orderHistory.length > 0) && (
        <StockOrderHistoryList items={orderHistory} />
      )}
      {hasMoreOrderHistory && (
        <div ref={orderHistorySentinelRef} className="h-1" />
      )}
    </div>
  );
}
