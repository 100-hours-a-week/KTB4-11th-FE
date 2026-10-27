"use client";

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { createContext, useContext, type ReactNode } from "react";
import type { AccountDetail } from "@/features/account/types/account";

const ServerSelectedAccountIdContext = createContext<number | undefined>(
  undefined,
);

export function useServerSelectedAccountId() {
  return useContext(ServerSelectedAccountIdContext);
}

export function AccountHydration({
  account,
  selectedAccountId,
  children,
}: {
  account: AccountDetail;
  selectedAccountId: number;
  children: ReactNode;
}) {
  const queryClient = new QueryClient();
  queryClient.setQueryData(["account", selectedAccountId], account);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ServerSelectedAccountIdContext.Provider value={selectedAccountId}>
        {children}
      </ServerSelectedAccountIdContext.Provider>
    </HydrationBoundary>
  );
}
