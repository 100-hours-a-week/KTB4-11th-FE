"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchAccountName } from "@/features/account/api/patchAccountName";
import { trackEvent } from "@/shared/utils/analytics";

export function useUpdateAccountNameMutation(accountId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (accountName: string) =>
      patchAccountName(accountId, { account_name: accountName }),
    onSuccess: () => {
      trackEvent("account_rename");
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["account", accountId] });
    },
  });
}
