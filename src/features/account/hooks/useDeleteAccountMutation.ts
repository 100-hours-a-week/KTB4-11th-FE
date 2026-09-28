"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAccount } from "@/features/account/api/deleteAccount";
import type { Account } from "@/features/account/types/account";
import { trackEvent } from "@/shared/utils/analytics";
import { useAccountStore } from "@/store/accountStore";

export function useDeleteAccountMutation(accountId: number) {
  const queryClient = useQueryClient();
  const setSelectedAccountId = useAccountStore(
    (state) => state.setSelectedAccountId,
  );

  return useMutation({
    mutationFn: () => deleteAccount(accountId),
    onSuccess: () => {
      const accounts = queryClient.getQueryData<Account[]>(["accounts"]);
      trackEvent("account_delete", {
        account_count_after: Math.max((accounts?.length ?? 1) - 1, 0),
      });
      setSelectedAccountId(undefined);
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.removeQueries({ queryKey: ["account", accountId] });
    },
  });
}
