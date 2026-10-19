"use client";

// 내부 방문 기록이 있으면 뒤로가기, 직접 진입했으면 지정 경로로 이동
import { useRouter } from "next/navigation";
import { getInternalHistoryDepth } from "@/shared/utils/navigationHistory";

export function useSafeBack(fallbackHref = "/home") {
  const router = useRouter();
  return () => {
    if (getInternalHistoryDepth(window.history.state) > 0) router.back();
    else router.replace(fallbackHref);
  };
}
