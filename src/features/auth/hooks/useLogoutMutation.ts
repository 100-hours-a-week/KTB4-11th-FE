"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postLogout } from "@/features/auth/api/postLogout";
import { useAccountStore } from "@/store/accountStore";

export function useLogoutMutation() {
  const queryClient = useQueryClient();
  const setSelectedAccountId = useAccountStore(
    (state) => state.setSelectedAccountId,
  );

  return useMutation({
    mutationFn: postLogout,
    onSuccess: () => {
      setSelectedAccountId(undefined);
      queryClient.clear();
      // 로그아웃 후 이전 사용자 정보와 이동 경로가 재사용되지 않도록 페이지 새로 로드
      window.location.replace("/");
    },
  });
}
