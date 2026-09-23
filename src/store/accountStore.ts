import { create } from "zustand";

interface AccountStore {
  selectedAccountId: number | undefined;
  setSelectedAccountId: (accountId: number) => void;
}

export const useAccountStore = create<AccountStore>((set) => ({
  selectedAccountId: undefined,
  setSelectedAccountId: (accountId) => set({ selectedAccountId: accountId }),
}));
