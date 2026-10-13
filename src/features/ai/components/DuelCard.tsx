import Link from "next/link";
import type { Duel } from "@/features/ai/types/duel";
import CalendarIcon from "@/assets/icons/fill/calendar.svg";
import FireIcon from "@/assets/icons/fill/fire.svg";
import PulseIcon from "@/assets/icons/fill/pulse.svg";
import SmileyIcon from "@/assets/icons/fill/smiley.svg";
import SmileyNervousIcon from "@/assets/icons/fill/smiley-nervous.svg";
import { cn } from "@/shared/utils/cn";
import {
  formatSignedPercent,
  getReturnRateInfo,
} from "@/shared/utils/getReturnRateInfo";

type DuelCardProps = Duel;

export function DuelCard({
  id,
  name,
  type,
  status,
  startDate,
  endDate,
  dDay,
  returnPercent,
  winner,
  result,
}: DuelCardProps) {
  const { colorClass: returnColorClass } = getReturnRateInfo(returnPercent);
  const isWin = result === "WIN";
  const ResultIcon = isWin ? SmileyIcon : SmileyNervousIcon;

  return (
    <Link
      href={`/duel/${id}`}
      className="bg-bg-layer-default relative flex flex-col gap-1 rounded-2xl p-4"
    >
      {!result && winner && (
        <span className="text-text-neutral-secondary caption-1-semibold absolute top-3 right-3">
          {winner} 승
        </span>
      )}
      <div className="flex items-center gap-2 pr-10">
        <span className="body-1-semibold">{name}</span>
        <span className="bg-sky-blue-50 text-text-accent caption-1-semibold rounded px-1.5 py-0.5">
          {type}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-text-neutral-secondary flex items-center gap-0.5">
          <CalendarIcon width={14} height={14} />
          <span className="caption-1-regular">
            {startDate} ~ {endDate}
          </span>
          <span className="bg-border-neutral-muted mx-1.5 h-3 w-px" />
          {status === "진행 중" ? (
            <>
              <FireIcon width={12} height={12} />
              <span className="caption-1-regular">D-{dDay}</span>
            </>
          ) : (
            <>
              <PulseIcon width={14} height={14} />
              <span className="caption-1-regular">내 수익률</span>
              <span className={cn("caption-1-semibold ml-1", returnColorClass)}>
                {formatSignedPercent(returnPercent)}
              </span>
            </>
          )}
        </span>
        {status === "진행 중" ? (
          <span className={cn("body-1-semibold", returnColorClass)}>
            {formatSignedPercent(returnPercent)}
          </span>
        ) : (
          result && (
            <span
              className={cn(
                "caption-1-semibold flex items-center gap-0.5 rounded px-1.5 py-0.5",
                isWin
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-bg-error text-text-error",
              )}
            >
              {result}
              <ResultIcon width={16} height={16} />
            </span>
          )
        )}
      </div>
    </Link>
  );
}
