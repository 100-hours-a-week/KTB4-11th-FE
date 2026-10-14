"use client";

import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { useUserQuery } from "@/features/user/hooks/useUserQuery";
import { Splash } from "@/shared/components/Splash";

export default function OnboardingLayout({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const isCompletePage = pathname === "/onboarding/complete";

  const { data, isSuccess } = useUserQuery({
    skipAuthRedirect: true,
    retry: false,
  });
  const alreadyOnboarded = isSuccess && !!data?.onboarding_completed;

  useEffect(() => {
    if (!isCompletePage && alreadyOnboarded) router.replace("/home");
  }, [isCompletePage, alreadyOnboarded, router]);

  if (!isCompletePage && (!isSuccess || alreadyOnboarded)) return <Splash />;

  return <>{children}</>;
}
