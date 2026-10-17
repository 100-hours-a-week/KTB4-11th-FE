"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchCancelOrder } from "@/features/stock/api/patchCancelOrder";

export function useCancelOrderMutation(accountId: number | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: number) => patchCancelOrder(accountId!, orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders", accountId] });
    },
  });
}
