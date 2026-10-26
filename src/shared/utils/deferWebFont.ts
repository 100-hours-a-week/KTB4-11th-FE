import type { QueryClient } from "@tanstack/react-query";

export function deferWebFont(queryClient: QueryClient) {
  let applied = false;
  let cancelScheduled: (() => void) | undefined;

  const scheduleFont = () => {
    cancelScheduled?.();
    cancelScheduled = undefined;

    if (
      applied ||
      document.readyState !== "complete" ||
      queryClient.isFetching() > 0
    ) {
      return;
    }

    const applyFont = () => {
      if (queryClient.isFetching() > 0) return;

      applied = true;
      document.documentElement.style.setProperty(
        "--font-pretendard",
        '"Pretendard Variable"',
      );
    };

    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(applyFont, { timeout: 1000 });
      cancelScheduled = () => window.cancelIdleCallback(id);
    } else {
      const id = setTimeout(applyFont, 0);
      cancelScheduled = () => clearTimeout(id);
    }
  };

  // 새 데이터 조회 시작 시 예약 취소 및 조회 완료 시 재예약
  const unsubscribe = queryClient.getQueryCache().subscribe(scheduleFont);
  window.addEventListener("load", scheduleFont);
  scheduleFont();

  return () => {
    unsubscribe();
    window.removeEventListener("load", scheduleFont);
    cancelScheduled?.();
  };
}
