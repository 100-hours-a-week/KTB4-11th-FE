import type { ReactNode } from "react";
import { ClientAuthGuard } from "@/features/auth/components/ClientAuthGuard";
import { UserHydration } from "@/features/auth/components/UserHydration";
import { getServerUser } from "@/features/auth/server/getServerUser";

export default async function AuthedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getServerUser();
  if (!user)
    return <ClientAuthGuard mode="authenticated">{children}</ClientAuthGuard>;
  return <UserHydration user={user}>{children}</UserHydration>;
}
