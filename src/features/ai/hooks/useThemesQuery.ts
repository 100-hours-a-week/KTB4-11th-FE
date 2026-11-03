"use client";

import { useQuery } from "@tanstack/react-query";
import { getThemes } from "@/features/ai/api/getThemes";

export function useThemesQuery() {
  return useQuery({
    queryKey: ["themes"],
    queryFn: getThemes,
  });
}
