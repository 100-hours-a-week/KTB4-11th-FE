"use client";

import { useMutation } from "@tanstack/react-query";
import { postKakaoLogin } from "@/features/auth/api/postKakaoLogin";

export function useKakaoLoginMutation() {
  return useMutation({
    mutationFn: postKakaoLogin,
  });
}
