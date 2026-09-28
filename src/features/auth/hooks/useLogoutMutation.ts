"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { postLogout } from "@/features/auth/api/postLogout";
import { useAccountStore } from "@/store/accountStore";

export function useLogoutMutation() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setSelectedAccountId = useAccountStore(
    (state) => state.setSelectedAccountId,
  );

  return useMutation({
    mutationFn: postLogout,
    onSuccess: () => {
      setSelectedAccountId(undefined);
      queryClient.clear();
      router.replace("/");
    },
  });
}
