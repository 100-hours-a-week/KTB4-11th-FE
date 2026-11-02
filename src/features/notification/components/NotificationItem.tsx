import type { ComponentType, SVGProps } from "react";
import Image from "next/image";
import Link from "next/link";
import CrownIcon from "@/assets/icons/fill/crown.svg";
import HeadCircuitIcon from "@/assets/icons/fill/head-circuit.svg";
import TimerIcon from "@/assets/icons/fill/timer.svg";
import TrendIcon from "@/assets/icons/fill/trend.svg";
import TrophyIcon from "@/assets/icons/nav/filled/trophy.svg";
import appIcon from "@/app/icon.png";
import type {
  Notification,
  NotificationKind,
} from "@/features/notification/types/notification";
import { StockLogo } from "@/shared/components/StockLogo";
import { cn } from "@/shared/utils/cn";
import { formatRelativeTime } from "@/shared/utils/formatRelativeTime";

const KIND_CONFIG: Record<
  NotificationKind,
  { label: string; icon: ComponentType<SVGProps<SVGSVGElement>> }
> = {
  ORDER: { label: "주문", icon: TrendIcon },
  DUEL_START: { label: "대결", icon: TrophyIcon },
  DUEL_REMINDER: { label: "대결", icon: TimerIcon },
  DUEL_END: { label: "대결", icon: TrophyIcon },
  APP_UPDATE: { label: "업데이트", icon: CrownIcon },
  AI_REPORT: { label: "AI 리포트", icon: HeadCircuitIcon },
};

function NotificationAvatar({
  kind,
  stockCode,
}: {
  kind: NotificationKind;
  stockCode?: string;
}) {
  if (stockCode) return <StockLogo code={stockCode} className="size-10" />;

  if (kind === "APP_UPDATE") {
    return (
      <span className="relative block size-10 shrink-0 overflow-hidden rounded-full">
        <Image src={appIcon} alt="" fill className="object-cover" />
      </span>
    );
  }

  const { icon: Icon } = KIND_CONFIG[kind];
  return (
    <span className="bg-sky-blue-50 flex size-10 shrink-0 items-center justify-center rounded-full">
      <Icon width={20} height={20} className="text-icon-accent" />
    </span>
  );
}

type NotificationItemProps = Notification;

export function NotificationItem({
  kind,
  title,
  body,
  createdAt,
  isRead,
  href,
  stockCode,
}: NotificationItemProps) {
  const { label } = KIND_CONFIG[kind];

  const content = (
    <div className="flex gap-3 py-4">
      <NotificationAvatar kind={kind} stockCode={stockCode} />
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex items-center gap-1">
          <span className="caption-1-semibold text-text-accent">{label}</span>
          <span className="caption-1-regular text-text-neutral-tertiary ml-auto">
            {formatRelativeTime(createdAt)}
          </span>
        </div>
        <span className="body-2-semibold text-text-neutral-primary">
          {title}
        </span>
        <span className="body-2-regular text-text-neutral-secondary">
          {body}
        </span>
      </div>
    </div>
  );

  return (
    <li className={cn("mx-5", isRead && "opacity-40")}>
      {href ? <Link href={href}>{content}</Link> : content}
    </li>
  );
}
