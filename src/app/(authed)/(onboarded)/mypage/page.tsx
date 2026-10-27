import { AccountHydration } from "@/features/account/components/AccountHydration";
import { getServerAccountData } from "@/features/account/server/getServerAccountData";
import { MyPageContainer } from "@/screens/mypage/MyPageContainer";

export default async function MyPage() {
  const accountData = await getServerAccountData();
  if (!accountData) return <MyPageContainer />;

  return (
    <AccountHydration {...accountData}>
      <MyPageContainer />
    </AccountHydration>
  );
}
