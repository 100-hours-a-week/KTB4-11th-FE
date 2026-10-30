"use client";

import { useEffect, useRef, useState } from "react";
import CameraIcon from "@/assets/icons/fill/camera.svg";
import ProfileDefaultIcon from "@/assets/icons/stockspoon/profile-default.svg";

interface ProfileImageFieldProps {
  profileImage: string | null;
  onImageSelect: (file: File) => void;
}

export function ProfileImageField({
  profileImage,
  onImageSelect,
}: ProfileImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
    onImageSelect(file);
  }

  const displayUrl = previewUrl ?? profileImage;

  return (
    <div className="relative mx-auto size-24">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        aria-label="프로필 이미지 변경"
        className="relative block size-24"
      >
        <span className="block size-24 overflow-hidden rounded-full">
          {displayUrl ? (
            <img
              src={displayUrl}
              alt="프로필 이미지"
              className="size-full object-cover"
            />
          ) : (
            <ProfileDefaultIcon width={96} height={96} />
          )}
        </span>
        <span className="bg-bg-layer-default border-border-neutral-muted absolute right-0 bottom-0 flex size-8 items-center justify-center rounded-full border">
          <CameraIcon
            width={18}
            height={18}
            className="text-icon-neutral-secondary"
          />
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}
