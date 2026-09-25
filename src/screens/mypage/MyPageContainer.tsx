"use client";

import { AccountBalanceCard } from "@/features/account/components/AccountBalanceCard";
import { AccountPerformanceCard } from "@/features/account/components/AccountPerformanceCard";
import { AccountSelector } from "@/features/account/components/AccountSelector";
import { useAccountDetailQuery } from "@/features/account/hooks/useAccountDetailQuery";
import { useSelectedAccountId } from "@/features/account/hooks/useSelectedAccountId";
import { ProfileCard } from "@/features/user/components/ProfileCard";
import { Header, HeaderBackButton } from "@/shared/components/Header";
import { MenuRow } from "@/shared/components/MenuRow";

export function MyPageContainer() {
  const accountId = useSelectedAccountId();
  const { data: account } = useAccountDetailQuery(accountId);

  return (
    <div className="pt-safe-top flex h-full flex-col">
      <Header title="마이" className="px-5 py-3" left={<HeaderBackButton />} />

      <div className="flex flex-1 flex-col gap-2 px-5 pt-4">
        <ProfileCard nickname="스푼러버" />

        <div className="px-1">
          <AccountSelector />
        </div>

        <div className="flex flex-col gap-2">
          <AccountBalanceCard
            cashBalance={account?.cash_balance ?? 0}
            valuation={account?.holdings_market_value ?? 0}
          />
          <AccountPerformanceCard
            returnPercent={account?.return_percent ?? 0}
            tradeCount={account?.executed_trade_count ?? 0}
          />
        </div>

        <div>
          <MenuRow label="주문 내역" />
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <span className="body-2-semibold text-text-neutral-secondary">
            계정
          </span>
          <div className="flex flex-col gap-2">
            <MenuRow label="로그아웃" />
            <MenuRow label="회원 탈퇴" />
          </div>
        </div>
      </div>
    </div>
  );
}
