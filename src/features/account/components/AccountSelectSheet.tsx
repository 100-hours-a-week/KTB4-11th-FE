"use client";

import Link from "next/link";
import { useAccountListQuery } from "@/features/account/hooks/useAccountListQuery";
import { useSelectedAccountId } from "@/features/account/hooks/useSelectedAccountId";
import { useAccountStore } from "@/store/accountStore";
import CheckCircleIcon from "@/assets/icons/fill/check-circle.svg";
import CloseIcon from "@/assets/icons/fill/close.svg";
import PlusIcon from "@/assets/icons/fill/plus.svg";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
} from "@/shared/components/Sheet";

interface AccountSelectSheetProps {
  trigger: React.ReactNode;
}

export function AccountSelectSheet({ trigger }: AccountSelectSheetProps) {
  const { data } = useAccountListQuery();
  const accounts = data?.accounts ?? [];
  const selectedAccountId = useSelectedAccountId();
  const setSelectedAccountId = useAccountStore(
    (state) => state.setSelectedAccountId,
  );

  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetPortal>
        <SheetContent side="top">
          <div className="flex flex-col p-6">
            <div className="flex justify-end">
              <SheetClose>
                <CloseIcon
                  width={24}
                  height={24}
                  className="text-icon-neutral-secondary"
                />
              </SheetClose>
            </div>
            <SheetTitle className="mt-2">계좌 선택</SheetTitle>
            <div className="mt-6 flex flex-col">
              {accounts.map((account) => (
                <button
                  key={account.account_id}
                  type="button"
                  onClick={() => setSelectedAccountId(account.account_id)}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="border-border-neutral-tertiary size-10 rounded-full border border-dashed" />
                    <div className="flex flex-col items-start">
                      <span className="body-1-semibold">
                        {account.account_name}
                      </span>
                      <span className="body-2-regular text-text-neutral-secondary">
                        {account.total_assets.toLocaleString()}원
                      </span>
                    </div>
                  </div>
                  {selectedAccountId === account.account_id && (
                    <CheckCircleIcon
                      width={24}
                      height={24}
                      className="text-bg-accent"
                    />
                  )}
                </button>
              ))}
            </div>
            <hr className="border-border-neutral-muted my-4" />
            <Link href="/account/create" className="flex items-center gap-3">
              <span className="bg-bg-layer-basement flex size-10 items-center justify-center rounded-full">
                <PlusIcon
                  width={24}
                  height={24}
                  className="text-icon-neutral-primary"
                />
              </span>
              <span className="body-1-medium text-text-neutral-secondary">
                새 계좌 만들기
              </span>
            </Link>
            <div className="bg-bg-neutral-tertiary mx-auto mt-4 h-1 w-9 rounded-full" />
          </div>
        </SheetContent>
      </SheetPortal>
    </Sheet>
  );
}
