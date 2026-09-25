interface AiReasoningTitleProps {
  title: string;
  meta: string;
}

export function AiReasoningTitle({ title, meta }: AiReasoningTitleProps) {
  return (
    <div className="flex flex-col gap-1">
      <span className="heading-1-bold">{title}</span>
      <span className="body-2-regular text-text-neutral-secondary">{meta}</span>
    </div>
  );
}
