"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAccount } from "@/features/account/api/deleteAccount";
import { useAccountStore } from "@/store/accountStore";

export function useDeleteAccountMutation(accountId: number) {
  const queryClient = useQueryClient();
  const setSelectedAccountId = useAccountStore(
    (state) => state.setSelectedAccountId,
  );

  return useMutation({
    mutationFn: () => deleteAccount(accountId),
    onSuccess: () => {
      setSelectedAccountId(undefined);
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.removeQueries({ queryKey: ["account", accountId] });
    },
  });
}
