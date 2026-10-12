"use client";

import type { Duel } from "@/features/ai/types/duel";
import CalendarIcon from "@/assets/icons/fill/calendar.svg";
import FireIcon from "@/assets/icons/fill/fire.svg";
import InfoIcon from "@/assets/icons/fill/info.svg";
import { useCarousel } from "@/shared/hooks/useCarousel";
import { cn } from "@/shared/utils/cn";
import { getReturnRateInfo } from "@/shared/utils/getReturnRateInfo";

const MAX_ONGOING = 3;

function getDuelProgressPercent(duel: Duel): number {
  const parseDate = (value: string) => {
    const [month, day] = value.split("/").map(Number);
    return new Date(new Date().getFullYear(), month - 1, day).getTime();
  };
  const totalDays =
    (parseDate(duel.endDate) - parseDate(duel.startDate)) /
    (1000 * 60 * 60 * 24);
  if (totalDays <= 0) return 100;
  const elapsedDays = totalDays - duel.dDay;
  return Math.min(100, Math.max(0, (elapsedDays / totalDays) * 100));
}

interface OngoingDuelCarouselProps {
  duels: Duel[];
}

export function OngoingDuelCarousel({ duels }: OngoingDuelCarouselProps) {
  const displayedDuels = duels.slice(0, MAX_ONGOING);
  const { emblaRef, selectedIndex, scrollTo } = useCarousel();

  if (displayedDuels.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <span className="heading-2-semibold">진행 중인 대결</span>
          <span className="flex items-center gap-0.5">
            <InfoIcon
              width={12}
              height={12}
              className="text-text-neutral-tertiary"
            />
            <span className="text-text-neutral-tertiary text-[11px] leading-[16px] tracking-[-0.3px]">
              AI 성적은 대결 종료 후 공개돼요
            </span>
          </span>
        </span>
        {displayedDuels.length > 1 && (
          <div className="flex items-center gap-1">
            {displayedDuels.map((duel, index) => (
              <button
                key={duel.id}
                type="button"
                aria-label={`${index + 1}번째 대결로 이동`}
                onClick={() => scrollTo(index)}
                className={cn(
                  "size-1.5 rounded-full transition-colors",
                  index === selectedIndex
                    ? "bg-bg-accent"
                    : "bg-bg-neutral-tertiary",
                )}
              />
            ))}
          </div>
        )}
      </div>
      <div className="-ml-3 overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {displayedDuels.map((duel) => {
            const { sign, colorClass } = getReturnRateInfo(duel.returnPercent);
            const progressPercent = getDuelProgressPercent(duel);

            return (
              <div key={duel.id} className="min-w-0 flex-[0_0_100%] pl-3">
                <div className="bg-bg-layer-default relative flex flex-col gap-1 rounded-2xl p-4">
                  <span className="text-text-neutral-secondary body-2-semibold absolute top-4 right-4 flex items-center gap-0.5">
                    <FireIcon width={16} height={16} />
                    D-{duel.dDay}
                  </span>
                  <div className="flex items-center gap-2 pr-10">
                    <span className="body-1-semibold">{duel.name}</span>
                    <span className="bg-sky-blue-50 text-text-accent caption-1-semibold rounded px-1.5 py-0.5">
                      {duel.type}
                    </span>
                  </div>
                  <span className="text-text-neutral-secondary flex items-center gap-0.5">
                    <CalendarIcon width={14} height={14} />
                    <span className="caption-1-regular">
                      {duel.startDate} ~ {duel.endDate}
                    </span>
                  </span>
                  <span className="caption-1-regular text-text-neutral-tertiary mt-1">
                    내 수익률
                  </span>
                  <span className={cn("heading-1-bold", colorClass)}>
                    {sign}
                    {duel.returnPercent.toFixed(1)}%
                  </span>
                  <div className="relative mt-1 h-1.5 w-full">
                    <div
                      className="bg-bg-layer-floating text-text-neutral-secondary border-border-neutral-muted absolute bottom-full mb-2.5 -translate-x-1/2 rounded-lg border px-2 py-1 text-[10px] leading-[14px] font-semibold whitespace-nowrap"
                      style={{
                        left: `clamp(32px, ${progressPercent}%, calc(100% - 32px))`,
                      }}
                    >
                      대결 종료까지 {duel.dDay}일 남았어요!
                      <div
                        className="absolute top-full left-1/2 -translate-x-1/2"
                        style={{
                          width: 0,
                          height: 0,
                          borderLeft: "5px solid transparent",
                          borderRight: "5px solid transparent",
                          borderTop:
                            "10px solid var(--color-border-neutral-muted)",
                        }}
                      />
                      <div
                        className="absolute top-full left-1/2 -translate-x-1/2"
                        style={{
                          width: 0,
                          height: 0,
                          borderLeft: "4px solid transparent",
                          borderRight: "4px solid transparent",
                          borderTop: "9px solid var(--color-bg-layer-floating)",
                        }}
                      />
                    </div>
                    <div className="bg-bg-neutral-tertiary h-full w-full overflow-hidden rounded-full">
                      <div
                        className="from-sky-blue-200 to-sky-blue-500 h-full rounded-full bg-gradient-to-r"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
