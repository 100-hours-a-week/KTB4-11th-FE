"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import BellIcon from "@/assets/icons/fill/bell.svg";
import ProfileIcon from "@/assets/icons/fill/profile.svg";
import SearchIcon from "@/assets/icons/fill/search.svg";

interface AppHeaderActionsProps {
  hasUnreadNotification?: boolean;
}

export function AppHeaderActions({
  hasUnreadNotification = false,
}: AppHeaderActionsProps) {
  const router = useRouter();

  return (
    <>
      <button
        type="button"
        onClick={() => router.push("/notification")}
        aria-label={hasUnreadNotification ? "안 읽은 알림 있음" : "알림"}
        className="relative"
      >
        <BellIcon
          width={24}
          height={24}
          className="text-icon-neutral-primary"
        />
        {hasUnreadNotification && (
          <span className="absolute top-0.5 right-0.5 size-1.5 rounded-full bg-red-500" />
        )}
      </button>
      <button type="button" onClick={() => router.push("/search")}>
        <SearchIcon
          width={24}
          height={24}
          className="text-icon-neutral-primary"
        />
      </button>
      <Link href="/mypage">
        <ProfileIcon
          width={24}
          height={24}
          className="text-icon-neutral-primary"
        />
      </Link>
    </>
  );
}
