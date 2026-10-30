"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchCancelOrder } from "@/features/stock/api/patchCancelOrder";

export function useCancelOrderMutation(accountId: number | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: number) => patchCancelOrder(accountId!, orderId),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["orders", accountId] }),
        queryClient.invalidateQueries({
          queryKey: ["orders", "infinite", accountId],
        }),
        queryClient.invalidateQueries({
          queryKey: ["stockHolding", accountId],
        }),
        queryClient.invalidateQueries({ queryKey: ["account", accountId] }),
      ]),
  });
}
