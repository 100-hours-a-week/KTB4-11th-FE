"use client";

import { useLayoutEffect, useRef } from "react";

interface DuelProgressBarProps {
  progressPercent: number;
  dDay: number;
}

export function DuelProgressBar({
  progressPercent,
  dDay,
}: DuelProgressBarProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const progress = Math.min(100, Math.max(0, progressPercent));

  useLayoutEffect(() => {
    const track = trackRef.current;
    const tooltip = tooltipRef.current;
    if (!track || !tooltip) return;
    const updatePosition = () => {
      const anchor = (track.clientWidth * progress) / 100;
      const left = Math.max(
        0,
        Math.min(
          anchor - tooltip.offsetWidth / 2,
          track.clientWidth - tooltip.offsetWidth,
        ),
      );
      tooltip.style.left = `${left}px`;
      // 꼬리가 둥근 모서리 밖으로 튀어나오지 않도록 안쪽 여백 확보
      const arrowLeft = Math.max(
        16,
        Math.min(anchor - left, tooltip.offsetWidth - 16),
      );
      tooltip.style.setProperty("--arrow-left", `${arrowLeft}px`);
    };
    updatePosition();
    const observer = new ResizeObserver(updatePosition);
    observer.observe(track);
    observer.observe(tooltip);
    return () => observer.disconnect();
  }, [progress, dDay]);

  return (
    <div ref={trackRef} className="relative mt-1 h-1.5 w-full">
      {dDay > 0 && (
        <div
          ref={tooltipRef}
          className="bg-bg-layer-floating text-text-neutral-secondary border-border-neutral-muted absolute bottom-full left-0 mb-2.5 w-max max-w-full rounded-lg border px-2 py-1 text-center text-[10px] leading-[14px] font-semibold"
        >
          대결 종료까지 {dDay}일 남았어요!
          <svg
            aria-hidden="true"
            width="8"
            height="8"
            viewBox="0 0 8 8"
            className="absolute -translate-x-1/2 overflow-visible"
            style={{ left: "var(--arrow-left, 50%)", top: "100%" }}
          >
            <path
              d="M 0 0 L 4 7 L 8 0"
              fill="var(--color-bg-layer-floating)"
              stroke="var(--color-border-neutral-muted)"
              strokeWidth="1"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}
      <div className="bg-bg-neutral-tertiary h-full w-full overflow-hidden rounded-full">
        <div
          className="from-sky-blue-200 to-sky-blue-500 h-full rounded-full bg-gradient-to-r"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
