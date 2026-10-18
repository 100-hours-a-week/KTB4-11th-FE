import { useCallback, useRef } from "react";

// 차트 툴팁 표시와 위치 관리. 선택 지점이 같으면 기존 위치 재사용
export function useChartTooltip<T>() {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const lastTimeRef = useRef<T | null>(null);
  const cachedLeftRef = useRef(0);

  const hide = useCallback(() => {
    const tooltip = tooltipRef.current;
    if (tooltip) tooltip.style.opacity = "0";
  }, []);

  const show = useCallback(
    (time: T, x: number, containerWidth: number, updateContent: () => void) => {
      const tooltip = tooltipRef.current;
      if (!tooltip) return;

      if (time !== lastTimeRef.current) {
        lastTimeRef.current = time;
        updateContent();

        const tooltipWidth = tooltip.offsetWidth;
        cachedLeftRef.current = Math.max(
          0,
          Math.min(x - tooltipWidth / 2, containerWidth - tooltipWidth),
        );
      }

      tooltip.style.opacity = "1";
      tooltip.style.left = `${cachedLeftRef.current}px`;
    },
    [],
  );

  return { tooltipRef, show, hide };
}
