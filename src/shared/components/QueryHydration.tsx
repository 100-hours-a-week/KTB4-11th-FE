import "server-only";

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
  type QueryKey,
} from "@tanstack/react-query";
import type { ReactNode } from "react";

// 서버 조회 결과를 요청별로 분리한 React Query 캐시로 전달
export async function QueryHydration({
  data,
  queryKey,
  children,
}: {
  data: unknown | Promise<unknown>;
  queryKey: QueryKey;
  children: ReactNode;
}) {
  const resolvedData = await data;
  // 서버 결과가 없으면 기존 브라우저 조회로 전환
  if (resolvedData == null) return children;

  const queryClient = new QueryClient();
  queryClient.setQueryData(queryKey, resolvedData);
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
