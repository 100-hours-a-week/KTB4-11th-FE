import Link from "next/link";
import type { Duel, DuelStatus } from "@/features/ai/types/duel";
import CalendarIcon from "@/assets/icons/fill/calendar.svg";
import FireIcon from "@/assets/icons/fill/fire.svg";
import PulseIcon from "@/assets/icons/fill/pulse.svg";
import SmileyIcon from "@/assets/icons/fill/smiley.svg";
import SmileyNervousIcon from "@/assets/icons/fill/smiley-nervous.svg";
import { cn } from "@/shared/utils/cn";
import { trackEvent, type DuelCardStatus } from "@/shared/utils/analytics";
import {
  formatSignedPercent,
  getReturnRateInfo,
} from "@/shared/utils/getReturnRateInfo";

const DUEL_STATUS_TO_CARD_STATUS: Record<DuelStatus, DuelCardStatus> = {
  "시작 대기": "ready",
  "진행 중": "in_progress",
  종료: "completed",
  취소: "cancelled",
};

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

  const isReady = status === "시작 대기";
  const isOngoing = status === "진행 중";

  return (
    <Link
      href={status === "종료" ? `/duel/${id}/result` : `/duel/${id}`}
      onClick={() =>
        trackEvent("duel_card_click", {
          status: DUEL_STATUS_TO_CARD_STATUS[status],
        })
      }
      className="bg-bg-layer-default relative flex flex-col gap-[5px] rounded-2xl px-4 py-3"
    >
      {!result && winner && (
        <span className="text-text-neutral-secondary caption-1-semibold absolute top-3 right-3">
          {winner} 승
        </span>
      )}
      <div className="flex flex-wrap items-center gap-2 pr-10">
        <span className="body-1-semibold">{name}</span>
        <span className="bg-sky-blue-50 text-text-accent caption-1-semibold rounded px-1.5 py-0.5">
          {type}
        </span>
      </div>
      <div className="flex items-center justify-between gap-2">
        <span className="text-text-neutral-secondary flex items-center gap-0.5">
          <CalendarIcon width={14} height={14} />
          <span className="caption-1-regular">
            {startDate} ~ {endDate}
          </span>
          {!isReady && (
            <span className="bg-border-neutral-muted mx-1.5 h-3 w-px" />
          )}
          {isOngoing ? (
            <>
              <FireIcon width={12} height={12} />
              <span className="caption-1-regular">D-{dDay}</span>
            </>
          ) : !isReady ? (
            <>
              <PulseIcon width={14} height={14} />
              <span className="caption-1-regular">내 수익률</span>
              <span className={cn("caption-1-semibold ml-1", returnColorClass)}>
                {formatSignedPercent(returnPercent)}
              </span>
            </>
          ) : null}
        </span>
        {isReady ? (
          <span className="caption-1-semibold shrink-0 rounded bg-yellow-100 px-1.5 py-0.5 text-yellow-800">
            시작 대기
          </span>
        ) : isOngoing ? (
          <span className={cn("body-1-semibold", returnColorClass)}>
            {formatSignedPercent(returnPercent)}
          </span>
        ) : (
          result && (
            <span
              className={cn(
                "caption-1-semibold flex items-center gap-0.5 rounded px-1.5 py-0.5",
                isWin
                  ? "bg-green-100 text-green-700"
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
