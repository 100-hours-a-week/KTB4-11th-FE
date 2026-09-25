import EditIcon from "@/assets/icons/fill/edit.svg";

interface ProfileCardProps {
  nickname: string;
}

export function ProfileCard({ nickname }: ProfileCardProps) {
  return (
    <div className="bg-bg-layer-default flex items-center justify-between rounded-2xl p-4">
      <div className="flex items-center gap-3">
        <span className="border-border-neutral-tertiary size-10 rounded-full border border-dashed" />
        <span className="body-1-bold">{nickname}</span>
      </div>
      <button type="button">
        <EditIcon
          width={24}
          height={24}
          className="text-icon-neutral-secondary"
        />
      </button>
    </div>
  );
}
