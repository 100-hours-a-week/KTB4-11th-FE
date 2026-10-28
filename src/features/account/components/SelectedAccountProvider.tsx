"use client";

import { createContext, useContext, type ReactNode } from "react";

const SelectedAccountContext = createContext<number | undefined>(undefined);

export function useServerSelectedAccountId() {
  return useContext(SelectedAccountContext);
}

// 서버에서 확인한 선택 계좌를 홈과 마이페이지의 조회 훅에 전달
export function SelectedAccountProvider({
  accountId,
  children,
}: {
  accountId: number;
  children: ReactNode;
}) {
  return (
    <SelectedAccountContext.Provider value={accountId}>
      {children}
    </SelectedAccountContext.Provider>
  );
}
