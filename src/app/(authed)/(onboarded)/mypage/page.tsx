import { SelectedAccountProvider } from "@/features/account/components/SelectedAccountProvider";
import { getServerAccountData } from "@/features/account/server/getServerAccountData";
import { MyPageContainer } from "@/screens/mypage/MyPageContainer";
import { QueryHydration } from "@/shared/components/QueryHydration";

export default async function MyPage() {
  const accountData = await getServerAccountData();
  if (!accountData) return <MyPageContainer />;

  return (
    <SelectedAccountProvider accountId={accountData.selectedAccountId}>
      <QueryHydration
        data={accountData.account}
        queryKey={["account", accountData.selectedAccountId]}
      >
        <MyPageContainer />
      </QueryHydration>
    </SelectedAccountProvider>
  );
}
