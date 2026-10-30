import { create } from "zustand";
import { persist } from "zustand/middleware";
import { writeSelectedAccountCookie } from "@/features/account/utils/selectedAccountCookie";

interface AccountStore {
  selectedAccountId: number | undefined;
  setSelectedAccountId: (accountId: number | undefined) => void;
}

export const useAccountStore = create<AccountStore>()(
  persist(
    (set) => ({
      selectedAccountId: undefined,
      setSelectedAccountId: (accountId) => {
        writeSelectedAccountCookie(accountId);
        set({ selectedAccountId: accountId });
      },
    }),
    { name: "account-store" },
  ),
);
