"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useKakaoLoginMutation } from "@/features/auth/hooks/useKakaoLoginMutation";
import { verifyOAuthState } from "@/features/auth/utils/oauthState";

export function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { mutate } = useKakaoLoginMutation();
  const hasCalled = useRef(false);

  useEffect(() => {
    if (hasCalled.current) return;

    const errorParam = searchParams.get("error");
    if (errorParam) {
      router.replace("/");
      return;
    }

    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (!code || !verifyOAuthState(state)) {
      toast.error("요청을 처리하지 못했어요. 다시 시도해 주세요.");
      router.replace("/");
      return;
    }

    hasCalled.current = true;

    mutate({ authorization_code: code, state });
  }, [mutate, router, searchParams]);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <p className="body-2-regular text-text-neutral-secondary">
        로그인 처리 중이에요...
      </p>
    </div>
  );
}
