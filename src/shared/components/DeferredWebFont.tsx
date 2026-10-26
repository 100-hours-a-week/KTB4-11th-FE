"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { deferWebFont } from "@/shared/utils/deferWebFont";

// 초기 리소스와 데이터 조회 완료 후 웹폰트를 적용하는 전역 로더
export function DeferredWebFont() {
  const queryClient = useQueryClient();

  useEffect(() => deferWebFont(queryClient), [queryClient]);

  return null;
}
