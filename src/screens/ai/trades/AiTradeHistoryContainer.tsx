"use client";

import { useState } from "react";
import {
  AiTradeFilterChips,
  type AiTradeFilterValue,
} from "@/features/ai/components/AiTradeFilterChips";
import { AiTradeCard } from "@/features/ai/components/AiTradeCard";
import { useOrdersQuery } from "@/features/ai/hooks/useOrdersQuery";
import { toAiTrade } from "@/features/ai/utils/toAiTrade";
import { useSelectedAccountId } from "@/features/account/hooks/useSelectedAccountId";
import RobotFlusteredIcon from "@/assets/icons/stockspoon/robot-flustered.svg";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { Header, HeaderBackButton } from "@/shared/components/Header";

export function AiTradeHistoryContainer() {
  const accountId = useSelectedAccountId();
  const [filter, setFilter] = useState<AiTradeFilterValue>("전체");

  const { data: ordersResponse, isError, refetch } = useOrdersQuery(accountId);

  const trades = (ordersResponse?.orders ?? []).map(toAiTrade);

  const filteredTrades = trades.filter(
    (trade) => filter === "전체" || trade.tradeType === filter,
  );

  return (
    <div className="pt-safe-top flex h-full flex-col">
      <Header
        title="AI 매매 내역"
        className="px-5 py-3"
        left={<HeaderBackButton />}
      />

      <div className="flex flex-1 flex-col gap-4 px-5 pt-4 pb-8">
        <AiTradeFilterChips value={filter} onChange={setFilter} />

        {isError ? (
          <div className="bg-bg-layer-default flex flex-1 flex-col items-center rounded-2xl pt-32">
            <ErrorState onRetry={() => refetch()} />
          </div>
        ) : filteredTrades.length === 0 ? (
          <div className="bg-bg-layer-default flex flex-1 flex-col items-center rounded-2xl pt-32">
            <EmptyState
              icon={RobotFlusteredIcon}
              message={
                filter === "전체"
                  ? "매매 내역이 없어요"
                  : `${filter} 내역이 없어요`
              }
              description="AI가 매매를 진행하면 여기에 표시돼요"
            />
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {filteredTrades.map((trade) => (
              <AiTradeCard key={trade.orderId} {...trade} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
