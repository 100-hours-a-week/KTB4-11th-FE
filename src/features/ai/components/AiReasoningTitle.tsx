import CalendarIcon from "@/assets/icons/fill/calendar.svg";
import CartIcon from "@/assets/icons/fill/cart.svg";

interface AiReasoningTitleProps {
  title: string;
  date: string;
  holdingDays?: number;
}

export function AiReasoningTitle({
  title,
  date,
  holdingDays,
}: AiReasoningTitleProps) {
  return (
    <div className="flex flex-col gap-1">
      <span className="heading-1-bold">{title}</span>
      <span className="body-2-regular text-text-neutral-secondary flex items-center gap-1.5">
        <span className="flex items-center gap-1">
          <CalendarIcon className="text-icon-accent" />
          {date}
        </span>
        {holdingDays !== undefined && (
          <>
            <span className="bg-border-neutral-tertiary h-2.5 w-px" />
            <span className="flex items-center gap-1">
              <CartIcon width={12} height={12} className="text-icon-accent" />
              보유 {holdingDays}일
            </span>
          </>
        )}
      </span>
    </div>
  );
}
