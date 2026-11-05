import "server-only";

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

  // 영역별 전환 대기를 줄이기 위한 병렬 조회 결과의 렌더링 전 대기
  const [account, holdings, orders] = requests
    ? await Promise.all([requests.account, requests.holdings, requests.orders])
    : [null, null, null];

  const content = (
    <div className="bg-page-gradient pt-screen-top flex h-full flex-col">
      <HomeHeader />
      <div className="flex flex-col gap-1 px-5 pb-24">
        {requests && context ? (
          <QueryHydration
            data={account}
            queryKey={["account", context.selectedAccountId]}
          >
            <HomeAccountSection />
          </QueryHydration>
        ) : (
          <HomeAccountSection />
        )}
        <div className="mt-4">
          {requests && context ? (
            <QueryHydration
              data={holdings}
              queryKey={[
                "holdings",
                context.selectedAccountId,
                HOME_HOLDINGS_PARAMS,
              ]}
            >
              <HomeHoldingsSection />
            </QueryHydration>
          ) : (
            <HomeHoldingsSection />
          )}
        </div>
        <div className="mt-4">
          {requests && context ? (
            <QueryHydration
              data={orders}
              queryKey={[
                "orders",
                context.selectedAccountId,
                HOME_ORDERS_PARAMS,
              ]}
            >
              <HomeTradesSection />
            </QueryHydration>
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
