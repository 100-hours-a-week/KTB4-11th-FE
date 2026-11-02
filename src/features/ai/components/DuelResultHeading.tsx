import type { ComponentType, SVGProps } from "react";
import BadgeIcon from "@/assets/icons/fill/badge.svg";
import CalendarIcon from "@/assets/icons/fill/calendar.svg";

interface DuelResultHeadingProps {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  iconClassName: string;
  title: string;
  name: string;
  startDate: string;
  endDate: string;
}

export function DuelResultHeading({
  icon: Icon,
  iconClassName,
  title,
  name,
  startDate,
  endDate,
}: DuelResultHeadingProps) {
  return (
    <>
      <Icon width={40} height={40} className={iconClassName} />
      <span className="heading-1-bold">{title}</span>
      <span className="body-2-regular text-text-neutral-secondary flex items-center">
        <BadgeIcon width={14} height={14} className="text-icon-accent mr-0.5" />
        {name}
        <span className="bg-border-neutral-muted mx-1.5 h-3 w-px" />
        <CalendarIcon
          width={13}
          height={13}
          className="text-icon-accent mr-0.5"
        />
        {startDate} ~ {endDate}
      </span>
    </>
  );
}
