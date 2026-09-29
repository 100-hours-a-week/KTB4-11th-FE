"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { postKakaoLogin } from "@/features/auth/api/postKakaoLogin";
import { setAnalyticsUserId, trackEvent } from "@/shared/utils/analytics";

export function useKakaoLoginMutation() {
  const router = useRouter();

  return useMutation({
    mutationFn: postKakaoLogin,
    onSuccess: (data) => {
      setAnalyticsUserId(data.user_id);
      trackEvent(data.onboarding_required ? "sign_up" : "login", {
        method: "kakao",
      });
      router.replace(data.onboarding_required ? "/onboarding" : "/home");
    },
    onError: () => {
      toast.error("요청을 처리하지 못했어요. 다시 시도해 주세요.");
      router.replace("/");
    },
  });
}
