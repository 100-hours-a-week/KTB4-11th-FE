"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { postAccount } from "@/features/account/api/postAccount";

export function useCreateAccountMutation() {
  const router = useRouter();

  return useMutation({
    mutationFn: postAccount,
    onSuccess: (data) => {
      router.replace(`/onboarding/complete?amount=${data.initial_capital}`);
    },
    onError: () => {
      toast.error("계좌를 생성하지 못했어요. 다시 시도해 주세요.");
    },
  });
}
