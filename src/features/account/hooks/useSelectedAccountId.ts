"use client";

import { useEffect } from "react";
import { useServerSelectedAccountId } from "@/features/account/components/AccountHydration";
import { useAccountListQuery } from "@/features/account/hooks/useAccountListQuery";
import { writeSelectedAccountCookie } from "@/features/account/utils/selectedAccountCookie";
import { useAccountStore } from "@/store/accountStore";

export function useSelectedAccountId() {
  const { data } = useAccountListQuery();
  const serverSelectedAccountId = useServerSelectedAccountId();
  const selectedAccountId = useAccountStore((state) => state.selectedAccountId);
  const setSelectedAccountId = useAccountStore(
    (state) => state.setSelectedAccountId,
  );

  const accountId = selectedAccountId ?? serverSelectedAccountId;

  useEffect(() => {
    if (selectedAccountId !== undefined) {
      writeSelectedAccountCookie(selectedAccountId);
    } else if (accountId !== undefined) {
      setSelectedAccountId(accountId);
    } else if (selectedAccountId === undefined && data?.[0]) {
      setSelectedAccountId(data[0].account_id);
    }
  }, [accountId, selectedAccountId, data, setSelectedAccountId]);

  return accountId;
}
