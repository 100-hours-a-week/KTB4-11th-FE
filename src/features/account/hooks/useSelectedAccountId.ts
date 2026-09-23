"use client";

import { useEffect } from "react";
import { useAccountsQuery } from "@/features/account/hooks/useAccountsQuery";
import { useAccountStore } from "@/store/accountStore";

export function useSelectedAccountId() {
  const { data } = useAccountsQuery();
  const selectedAccountId = useAccountStore((state) => state.selectedAccountId);
  const setSelectedAccountId = useAccountStore(
    (state) => state.setSelectedAccountId,
  );

  useEffect(() => {
    if (selectedAccountId === undefined && data?.accounts[0]) {
      setSelectedAccountId(data.accounts[0].account_id);
    }
  }, [selectedAccountId, data, setSelectedAccountId]);

  return selectedAccountId;
}
