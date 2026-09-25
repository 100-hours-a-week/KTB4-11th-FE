import EditIcon from "@/assets/icons/fill/edit.svg";
import ProfileDefaultIcon from "@/assets/icons/stockspoon/profile-default.svg";

interface ProfileCardProps {
  nickname: string;
  profileImage: string | null;
}

export function ProfileCard({ nickname, profileImage }: ProfileCardProps) {
  return (
    <div className="bg-bg-layer-default flex items-center justify-between rounded-2xl p-4">
      <div className="flex items-center gap-3">
        {profileImage ? (
          <img
            src={profileImage}
            alt={`${nickname} 프로필 이미지`}
            className="size-10 rounded-full object-cover"
          />
        ) : (
          <ProfileDefaultIcon width={40} height={40} />
        )}
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
