// 서버에서 조회한 사용자 정보를 React Query 캐시에 전달해 브라우저의 중복 조회 방지
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import type { ReactNode } from "react";
import type { UserProfile } from "@/features/user/types/user";

export function UserHydration({
  user,
  children,
}: {
  user: UserProfile;
  children: ReactNode;
}) {
  const queryClient = new QueryClient();
  queryClient.setQueryData(["me"], user);
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
