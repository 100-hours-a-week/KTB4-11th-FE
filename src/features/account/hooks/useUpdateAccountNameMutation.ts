"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { putAccountName } from "@/features/account/api/putAccountName";

export function useUpdateAccountNameMutation(accountId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (accountName: string) =>
      putAccountName(accountId, { account_name: accountName }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["account", accountId] });
    },
  });
}
