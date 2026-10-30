"use client";

import { useEffect } from "react";
import { useServerSelectedAccountId } from "@/features/account/components/SelectedAccountProvider";
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

  const candidateId = selectedAccountId ?? serverSelectedAccountId;
  // 삭제되거나 다른 사용자에게 속한 서버 선택값은 현재 계좌 목록으로 대체
  const accountId =
    serverSelectedAccountId !== undefined &&
    data &&
    !data.some((account) => account.account_id === candidateId)
      ? data[0]?.account_id
      : candidateId;

  useEffect(() => {
    if (accountId !== undefined && accountId !== selectedAccountId) {
      setSelectedAccountId(accountId);
    } else if (selectedAccountId !== undefined) {
      writeSelectedAccountCookie(selectedAccountId);
    } else if (selectedAccountId === undefined && data?.[0]) {
      setSelectedAccountId(data[0].account_id);
    }
  }, [accountId, selectedAccountId, data, setSelectedAccountId]);

  return accountId;
}
