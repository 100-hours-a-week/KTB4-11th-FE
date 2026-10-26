import { redirect } from "next/navigation";
import { ClientAuthGuard } from "@/features/auth/components/ClientAuthGuard";
import { getServerUser } from "@/features/auth/server/getServerUser";
import { AccountCreationContainer } from "@/screens/account/AccountCreationContainer";

export default async function OnboardingPage() {
  const user = await getServerUser();
  if (user?.onboarding_completed) redirect("/home");
  const content = (
    <AccountCreationContainer
      headerTitle="시작 계좌 만들기"
      submitLabel="계좌 개설하기"
    />
  );
  return user ? (
    content
  ) : (
    <ClientAuthGuard mode="onboarding">{content}</ClientAuthGuard>
  );
}
