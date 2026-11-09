"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchMe } from "@/features/user/api/patchMe";
import { postProfileImagePresignedUrl } from "@/features/user/api/postProfileImagePresignedUrl";
import { putImageToS3 } from "@/features/user/api/putImageToS3";

export class ProfileImageUploadError extends Error {}

interface UpdateProfileParams {
  nickname?: string;
  imageFile?: File | null;
}

// 이미지가 있으면 presign → S3 직접 PUT → profile_image_key 확정 순서로 올린 뒤 저장
export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ nickname, imageFile }: UpdateProfileParams) => {
      let profileImageKey: string | undefined;

      if (imageFile) {
        try {
          const { presigned_url, profile_image_key } =
            await postProfileImagePresignedUrl(imageFile.type, imageFile.size);
          await putImageToS3(presigned_url, imageFile);
          profileImageKey = profile_image_key;
        } catch (error) {
          throw new ProfileImageUploadError("이미지 업로드에 실패했어요", {
            cause: error,
          });
        }
      }

      return patchMe({
        ...(nickname ? { nickname } : {}),
        ...(profileImageKey ? { profile_image_key: profileImageKey } : {}),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}
