"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import EditIcon from "@/assets/icons/fill/edit.svg";
import ProfileDefaultIcon from "@/assets/icons/stockspoon/profile-default.svg";

interface ProfileCardProps {
  nickname: string;
  profileImage: string | null;
}

export function ProfileCard({ nickname, profileImage }: ProfileCardProps) {
  const router = useRouter();

  return (
    <div className="bg-bg-layer-default flex items-center justify-between rounded-2xl p-4">
      <div className="flex items-center gap-3">
        {profileImage ? (
          <Image
            src={profileImage}
            width={40}
            height={40}
            sizes="40px"
            // 카카오 CDN 외 이미지는 원본 URL로 요청 (v3 Todo: 사용자 업로드 이미지 최적화)
            unoptimized={!profileImage.startsWith("https://k.kakaocdn.net/dn/")}
            alt={`${nickname} 프로필 이미지`}
            className="size-10 rounded-full object-cover"
          />
        ) : (
          <ProfileDefaultIcon width={40} height={40} />
        )}
        <span className="body-1-bold">{nickname}</span>
      </div>
      <button type="button" onClick={() => router.push("/mypage/edit")}>
        <EditIcon
          width={24}
          height={24}
          className="text-icon-neutral-secondary"
        />
      </button>
    </div>
  );
}
