import { AccountCreationContainer } from "@/screens/account/AccountCreationContainer";

export default function AccountCreatePage() {
  return (
    <AccountCreationContainer
      headerTitle="새 계좌 만들기"
      submitLabel="계좌 만들기"
      showAccountNameField
    />
  );
}
