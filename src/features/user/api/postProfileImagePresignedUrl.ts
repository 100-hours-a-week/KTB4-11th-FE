import { apiClient } from "@/shared/lib/axios";
import type { ProfileImagePresignedUrlResponse } from "@/features/user/types/profileImagePresignedUrl";

export async function postProfileImagePresignedUrl(
  contentType: string,
  contentLength: number,
) {
  const { data: presignedUrlResponse } =
    await apiClient.post<ProfileImagePresignedUrlResponse>(
      "/api/v1/users/me/profile-image/presigned-url",
      { content_type: contentType, content_length: contentLength },
    );

  return presignedUrlResponse;
}
