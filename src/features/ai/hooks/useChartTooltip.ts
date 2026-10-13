import { useCallback, useRef } from "react";

/**
 * 크로스헤어로 움직일 때 커스텀 차트 툴팁의 표시/위치 계산을 담당.
 * 스냅된 지점(time)이 바뀔 때만 updateContent + 위치 재계산을 하고,
 * 같은 지점 안에서는 캐시된 위치만 재사용해 강제 리플로우를 피한다.
 */
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
