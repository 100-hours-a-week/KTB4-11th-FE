"use client";

import { useEffect } from "react";
import { useAccountListQuery } from "@/features/account/hooks/useAccountListQuery";
import { useAccountStore } from "@/store/accountStore";

export function useSelectedAccountId() {
  const { data } = useAccountListQuery();
  const selectedAccountId = useAccountStore((state) => state.selectedAccountId);
  const setSelectedAccountId = useAccountStore(
    (state) => state.setSelectedAccountId,
  );

  useEffect(() => {
    if (selectedAccountId === undefined && data?.[0]) {
      setSelectedAccountId(data[0].account_id);
    }
  }, [selectedAccountId, data, setSelectedAccountId]);

  return selectedAccountId;
}
