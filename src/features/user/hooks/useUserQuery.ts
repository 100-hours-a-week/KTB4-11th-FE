"use client";

import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/features/user/api/getMe";

export function useUserQuery() {
  return useQuery({
    queryKey: ["me"],
    queryFn: getMe,
  });
}
