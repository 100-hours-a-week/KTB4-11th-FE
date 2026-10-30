"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import EditIcon from "@/assets/icons/fill/edit.svg";
import { ProfileImageField } from "@/features/user/components/ProfileImageField";
import { useUserQuery } from "@/features/user/hooks/useUserQuery";
import {
  nicknameEditFormSchema,
  NICKNAME_MAX_LENGTH,
  type NicknameEditFormValues,
} from "@/features/user/schemas/nicknameEditFormSchema";
import { Button } from "@/shared/components/Button";
import { Header, HeaderBackButton } from "@/shared/components/Header";
import { Input } from "@/shared/components/Input";

export function ProfileEditContainer() {
  const router = useRouter();
  const { data: user } = useUserQuery();
  const [imageFile, setImageFile] = useState<File | null>(null);

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<NicknameEditFormValues>({
    resolver: zodResolver(nicknameEditFormSchema),
    values: { nickname: user?.nickname ?? "" },
  });
  const nickname = watch("nickname");

  const hasChanges = nickname !== (user?.nickname ?? "") || imageFile !== null;
  const canSubmit = hasChanges && !errors.nickname;

  const onSubmit = handleSubmit(() => {
    toast.success("프로필이 수정됐어요");
    router.back();
  });

  if (!user) return null;

  return (
    <div className="pt-screen-top flex h-full flex-col">
      <Header
        className="px-5 py-3"
        title="프로필 수정"
        left={<HeaderBackButton />}
      />

      <div className="flex flex-1 flex-col gap-7 px-5 pt-6">
        <ProfileImageField
          profileImage={user.profile_image_url}
          onImageSelect={setImageFile}
        />

        <div className="flex flex-col gap-2">
          <span className="body-1-bold">닉네임</span>
          <Input
            bordered
            value={nickname}
            maxLength={NICKNAME_MAX_LENGTH}
            placeholder="닉네임을 입력해 주세요"
            onChange={(value) =>
              setValue("nickname", value, { shouldValidate: true })
            }
            error={!!errors.nickname}
            helperText={errors.nickname?.message}
            right={<EditIcon width={20} height={20} />}
          />
        </div>
      </div>

      <div className="px-5 pb-[max(24px,env(safe-area-inset-bottom))]">
        <Button onClick={onSubmit} disabled={!canSubmit}>
          수정하기
        </Button>
      </div>
    </div>
  );
}
