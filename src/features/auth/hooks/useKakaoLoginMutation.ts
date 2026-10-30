"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { postKakaoLogin } from "@/features/auth/api/postKakaoLogin";
import { getMe } from "@/features/user/api/getMe";
import { setAnalyticsUserId, trackEvent } from "@/shared/utils/analytics";

export function useKakaoLoginMutation() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postKakaoLogin,
    onSuccess: async (data) => {
      if (data.user_id != null) {
        setAnalyticsUserId(data.user_id);
      }

      const user = await queryClient.fetchQuery({
        queryKey: ["me"],
        queryFn: () => getMe(),
      });
      const onboardingRequired = !user.onboarding_completed;

      trackEvent(onboardingRequired ? "sign_up" : "login", {
        method: "kakao",
      });
      router.replace(onboardingRequired ? "/onboarding" : "/home");
    },
    onError: () => {
      toast.error("요청을 처리하지 못했어요. 다시 시도해 주세요.");
      router.replace("/");
    },
  });
}
