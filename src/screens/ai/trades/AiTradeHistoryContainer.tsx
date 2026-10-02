"use client";

import { useEffect, useRef, useState } from "react";
import {
  AiTradeFilterChips,
  type AiTradeFilterValue,
} from "@/features/ai/components/AiTradeFilterChips";
import { AiTradeCard } from "@/features/ai/components/AiTradeCard";
import { useOrdersQuery } from "@/features/ai/hooks/useOrdersQuery";
import { toAiTrade } from "@/features/ai/utils/toAiTrade";
import { useAccountListQuery } from "@/features/account/hooks/useAccountListQuery";
import { useSelectedAccountId } from "@/features/account/hooks/useSelectedAccountId";
import RobotFlusteredIcon from "@/assets/icons/stockspoon/robot-flustered.svg";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { Header, HeaderBackButton } from "@/shared/components/Header";
import { trackEvent } from "@/shared/utils/analytics";

export function AiTradeHistoryContainer() {
  const accountId = useSelectedAccountId();
  const [filter, setFilter] = useState<AiTradeFilterValue>("전체");

  const { data: ordersResponse, isError, refetch } = useOrdersQuery(accountId);
  const { data: accounts } = useAccountListQuery();

  const trades = (ordersResponse?.orders ?? []).map(toAiTrade);

  const filteredTrades = trades.filter(
    (trade) => filter === "전체" || trade.tradeType === filter,
  );

  const hasTrackedView = useRef(false);
  useEffect(() => {
    if (ordersResponse && !hasTrackedView.current) {
      hasTrackedView.current = true;
      trackEvent("ai_trade_list_view", {
        trade_count: trades.length,
        account_count: accounts?.length ?? 0,
      });
    }
  }, [ordersResponse, trades.length, accounts?.length]);

  useEffect(() => {
    if (isError) {
      trackEvent("error_view", {
        screen: "ai_trade_history",
        api_name: "orders",
      });
    }
  }, [isError]);

  useEffect(() => {
    if (
      !isError &&
      ordersResponse &&
      filter === "전체" &&
      trades.length === 0
    ) {
      trackEvent("empty_state_view", {
        screen: "ai_trade_history",
        empty_type: "no_trades",
      });
    }
  }, [isError, ordersResponse, filter, trades.length]);

  return (
    <div className="pt-screen-top flex h-full flex-col">
      <Header
        title="AI 매매 내역"
        className="px-5 py-3"
        left={<HeaderBackButton />}
      />

      <div className="flex flex-1 flex-col gap-4 px-5 pt-4 pb-8">
        <AiTradeFilterChips value={filter} onChange={setFilter} />

        {isError ? (
          <div className="bg-bg-layer-default flex flex-1 flex-col items-center rounded-2xl pt-32">
            <ErrorState
              onRetry={() => {
                trackEvent("retry_click", {
                  screen: "ai_trade_history",
                  api_name: "orders",
                });
                refetch();
              }}
            />
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
