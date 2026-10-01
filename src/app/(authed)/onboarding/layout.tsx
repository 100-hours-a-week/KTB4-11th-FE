"use client";

import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { useAccountListQuery } from "@/features/account/hooks/useAccountListQuery";
import { Splash } from "@/shared/components/Splash";

export default function OnboardingLayout({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const isCompletePage = pathname === "/onboarding/complete";

  const { data, isSuccess } = useAccountListQuery({
    skipAuthRedirect: true,
    retry: false,
  });
  const alreadyOnboarded = isSuccess && (data?.length ?? 0) > 0;

  useEffect(() => {
    if (!isCompletePage && alreadyOnboarded) router.replace("/home");
  }, [isCompletePage, alreadyOnboarded, router]);

  if (!isCompletePage && (!isSuccess || alreadyOnboarded)) return <Splash />;

  return <>{children}</>;
}
