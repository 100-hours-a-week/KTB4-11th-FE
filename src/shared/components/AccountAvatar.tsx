"use client";

import { useState } from "react";
import ProfileDefaultIcon from "@/assets/icons/stockspoon/profile-default.svg";
import { cn } from "@/shared/utils/cn";

const DICEBEAR_BACKGROUND_COLORS = "ffe3ea,e3edff,e2f5e9,fdf1d4";

interface AccountAvatarProps {
  accountId: number;
  className?: string;
}

export function AccountAvatar({ accountId, className }: AccountAvatarProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <ProfileDefaultIcon className={cn("shrink-0 rounded-full", className)} />
    );
  }

  return (
    <img
      src={`https://api.dicebear.com/10.x/gaze/svg?seed=${accountId}&backgroundColor=${DICEBEAR_BACKGROUND_COLORS}`}
      alt=""
      className={cn("shrink-0 rounded-full", className)}
      onError={() => setHasError(true)}
    />
  );
}
