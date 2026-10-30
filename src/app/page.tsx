import { redirect } from "next/navigation";
import { ClientAuthGuard } from "@/features/auth/components/ClientAuthGuard";
import { getServerUser } from "@/features/auth/server/getServerUser";
import { LoginContainer } from "@/screens/auth/LoginContainer";

export default async function LoginPage() {
  const user = await getServerUser();
  if (user) redirect(user.onboarding_completed ? "/home" : "/onboarding");
  return (
    <ClientAuthGuard mode="login">
      <LoginContainer />
    </ClientAuthGuard>
  );
}
