"use client";

// 종목 상세 탭의 URL 상태와 보유·대기 주문 여부에 따른 표시 관리
import { useSearchParams } from "next/navigation";
import {
  STOCK_DETAIL_TABS_WITH_HOLDING,
  STOCK_DETAIL_TABS_WITHOUT_HOLDING,
  type StockDetailTab,
} from "@/features/stock/types/stockDetail";

const TAB_PARAM: Record<StockDetailTab, string> = {
  차트: "chart",
  호가: "orderbook",
  "내 주식": "holding",
};

export function useStockDetailTab(
  initialTab: StockDetailTab,
  hasStockActivity: boolean | undefined,
) {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const requestedTab =
    tabParam === null
      ? initialTab
      : ((Object.keys(TAB_PARAM) as StockDetailTab[]).find(
          (tab) => TAB_PARAM[tab] === tabParam,
        ) ?? "차트");
  const tab =
    requestedTab === "내 주식" && hasStockActivity === false
      ? "차트"
      : requestedTab;
  const tabs =
    hasStockActivity || tab === "내 주식"
      ? STOCK_DETAIL_TABS_WITH_HOLDING
      : STOCK_DETAIL_TABS_WITHOUT_HOLDING;

  function selectTab(next: StockDetailTab) {
    const url = new URL(window.location.href);
    url.searchParams.set("tab", TAB_PARAM[next]);
    window.history.replaceState(null, "", url);
  }

  return { tab, tabs, selectTab };
}
