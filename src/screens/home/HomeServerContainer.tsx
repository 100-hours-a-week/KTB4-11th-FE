import "server-only";

import { Suspense } from "react";
import { Skeleton } from "@/shared/components/Skeleton";
import { HoldingStockList } from "@/features/account/components/HoldingStockList";
import { RecentTradeSection } from "@/features/stock/components/trade/RecentTradeSection";
import { BottomTabBar } from "@/shared/components/BottomTabBar";
import { QueryHydration } from "@/shared/components/QueryHydration";
import { SelectedAccountProvider } from "@/features/account/components/SelectedAccountProvider";
import { getServerAccountContext } from "@/features/account/server/getServerAccountData";
import {
  HomeHeader,
  HomeAccountSection,
  HomeHoldingsSection,
  HomeTradesSection,
} from "./HomeClientContainer";
import {
  HOME_HOLDINGS_PARAMS,
  HOME_ORDERS_PARAMS,
} from "@/features/home/constants/homeQueries";
import { requestServerHomeData } from "@/features/home/server/requestServerHomeData";

// 홈 초기 조회와 영역별 화면 조립을 담당하는 서버 컴포넌트
export async function HomeServerContainer() {
  const context = await getServerAccountContext();
  const requests = context
    ? requestServerHomeData(
        context.apiBaseUrl,
        context.accessToken,
        context.selectedAccountId,
      )
    : null;

  const content = (
    <div className="bg-page-gradient pt-screen-top flex h-full flex-col">
      <HomeHeader />
      <div className="flex flex-col gap-1 px-5 pb-24">
        {requests && context ? (
          <Suspense fallback={<HomeAccountSkeleton />}>
            <QueryHydration
              data={requests.account}
              queryKey={["account", context.selectedAccountId]}
            >
              <HomeAccountSection />
            </QueryHydration>
          </Suspense>
        ) : (
          <HomeAccountSection />
        )}
        <div className="mt-4">
          {requests && context ? (
            <Suspense fallback={<HomeHoldingsSkeleton />}>
              <QueryHydration
                data={requests.holdings}
                queryKey={[
                  "holdings",
                  context.selectedAccountId,
                  HOME_HOLDINGS_PARAMS,
                ]}
              >
                <HomeHoldingsSection />
              </QueryHydration>
            </Suspense>
          ) : (
            <HomeHoldingsSection />
          )}
        </div>
        <div className="mt-4">
          {requests && context ? (
            <Suspense fallback={<HomeTradesSkeleton />}>
              <QueryHydration
                data={requests.orders}
                queryKey={[
                  "orders",
                  context.selectedAccountId,
                  HOME_ORDERS_PARAMS,
                ]}
              >
                <HomeTradesSection />
              </QueryHydration>
            </Suspense>
          ) : (
            <HomeTradesSection />
          )}
        </div>
      </div>
      <BottomTabBar />
    </div>
  );

  return context ? (
    <SelectedAccountProvider accountId={context.selectedAccountId}>
      {content}
    </SelectedAccountProvider>
  ) : (
    content
  );
}

// 서버 조회 중 브라우저의 중복 요청을 막기 위한 조회 훅 없는 로딩 화면
export function HomeAccountSkeleton() {
  return (
    <>
      <div className="flex h-12 items-center">
        <Skeleton className="h-6 w-40" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-21 flex-1 rounded-2xl" />
        <Skeleton className="h-21 flex-1 rounded-2xl" />
      </div>
      <Skeleton className="h-12 rounded-2xl" />
    </>
  );
}

export function HomeHoldingsSkeleton() {
  return <HoldingStockList stocks={[]} isPending />;
}

export function HomeTradesSkeleton() {
  return <RecentTradeSection trades={[]} isPending />;
}
