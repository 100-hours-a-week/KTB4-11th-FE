"use client";

import { OngoingDuelCard } from "@/features/ai/components/OngoingDuelCard";
import type { Duel } from "@/features/ai/types/duel";
import { useCarousel } from "@/shared/hooks/useCarousel";
import { cn } from "@/shared/utils/cn";

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
  const displayedDuels = duels
    .filter((duel) => duel.status === "진행 중")
    .slice(0, MAX_ONGOING);
  const { emblaRef, selectedIndex, scrollTo } = useCarousel();

  if (displayedDuels.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="heading-2-semibold">진행 중인 대결</span>
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
          {displayedDuels.map((duel) => (
            <div key={duel.id} className="min-w-0 flex-[0_0_100%] pl-3">
              <OngoingDuelCard
                duel={duel}
                progressPercent={getDuelProgressPercent(duel)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
