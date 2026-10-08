"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { useUserQuery } from "@/features/user/hooks/useUserQuery";
import { Splash } from "@/shared/components/Splash";

export default function AuthedLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { isSuccess, isError } = useUserQuery({
    skipAuthRedirect: true,
    retry: false,
  });

  useEffect(() => {
    if (isError) router.replace("/");
  }, [isError, router]);

  if (!isSuccess) return <Splash />;

  return <>{children}</>;
}
