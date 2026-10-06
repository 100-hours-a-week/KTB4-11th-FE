"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { deleteUser } from "@/features/user/api/deleteUser";
import { useAccountStore } from "@/store/accountStore";

export function useWithdrawMutation() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setSelectedAccountId = useAccountStore(
    (state) => state.setSelectedAccountId,
  );

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      setSelectedAccountId(undefined);
      queryClient.clear();
      router.replace("/");
    },
  });
}
