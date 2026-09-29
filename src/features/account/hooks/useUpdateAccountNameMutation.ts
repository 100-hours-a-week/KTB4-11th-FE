"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { putAccountName } from "@/features/account/api/putAccountName";
import { trackEvent } from "@/shared/utils/analytics";

export function useUpdateAccountNameMutation(accountId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (accountName: string) =>
      putAccountName(accountId, { account_name: accountName }),
    onSuccess: () => {
      trackEvent("account_rename");
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["account", accountId] });
    },
  });
}
