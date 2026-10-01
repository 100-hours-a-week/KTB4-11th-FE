"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { useAccountListQuery } from "@/features/account/hooks/useAccountListQuery";
import { Splash } from "@/shared/components/Splash";

export default function AuthedLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { isSuccess, isError } = useAccountListQuery({
    skipAuthRedirect: true,
    retry: false,
  });

  useEffect(() => {
    if (isError) router.replace("/");
  }, [isError, router]);

  if (!isSuccess) return <Splash />;

  return <>{children}</>;
}
