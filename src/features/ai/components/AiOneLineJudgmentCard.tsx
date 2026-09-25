import MagicWandIcon from "@/assets/icons/fill/magic-wand.svg";

interface AiOneLineJudgmentCardProps {
  oneLineJudgment: string;
}

export function AiOneLineJudgmentCard({
  oneLineJudgment,
}: AiOneLineJudgmentCardProps) {
  return (
    <div className="bg-bg-layer-default flex flex-col gap-2 rounded-2xl p-4">
      <span className="body-2-medium text-text-neutral-secondary flex items-center gap-1.5">
        <MagicWandIcon width={16} height={16} className="text-icon-accent" />한
        줄 판단
      </span>
      <p className="body-2-medium">{oneLineJudgment}</p>
    </div>
  );
}
