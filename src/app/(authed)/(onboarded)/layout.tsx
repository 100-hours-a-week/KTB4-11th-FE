"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { toast } from "sonner";
import { useUserQuery } from "@/features/user/hooks/useUserQuery";
import { Splash } from "@/shared/components/Splash";

export default function OnboardedLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { data, isSuccess } = useUserQuery({
    skipAuthRedirect: true,
    retry: false,
  });
  const needsOnboarding = isSuccess && !data?.onboarding_completed;

  useEffect(() => {
    if (needsOnboarding) {
      toast.info("온보딩을 완료하지 않았어요");
      router.replace("/onboarding");
    }
  }, [needsOnboarding, router]);

  if (!isSuccess || needsOnboarding) return <Splash />;

  return <>{children}</>;
}
