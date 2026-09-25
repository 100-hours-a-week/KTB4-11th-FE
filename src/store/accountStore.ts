import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AccountStore {
  selectedAccountId: number | undefined;
  setSelectedAccountId: (accountId: number | undefined) => void;
}

export const useAccountStore = create<AccountStore>()(
  persist(
    (set) => ({
      selectedAccountId: undefined,
      setSelectedAccountId: (accountId) =>
        set({ selectedAccountId: accountId }),
    }),
    { name: "account-store" },
  ),
);
