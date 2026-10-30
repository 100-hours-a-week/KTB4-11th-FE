"use client";

import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/features/user/api/getMe";

interface UseUserQueryOptions {
  skipAuthRedirect?: boolean;
  retry?: boolean;
}

export function useUserQuery(options?: UseUserQueryOptions) {
  const { skipAuthRedirect, retry } = options ?? {};

  return useQuery({
    queryKey: ["me"],
    queryFn: () =>
      getMe(skipAuthRedirect ? { skipAuthRedirect: true } : undefined),
    ...(retry !== undefined && { retry }),
  });
}
