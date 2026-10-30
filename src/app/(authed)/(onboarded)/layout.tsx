import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { ClientAuthGuard } from "@/features/auth/components/ClientAuthGuard";
import { getServerUser } from "@/features/auth/server/getServerUser";

export default async function OnboardedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getServerUser();
  if (!user)
    return <ClientAuthGuard mode="onboarded">{children}</ClientAuthGuard>;
  if (!user.onboarding_completed) redirect("/onboarding");
  return <>{children}</>;
}
