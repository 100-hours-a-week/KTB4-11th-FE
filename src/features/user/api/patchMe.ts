import { apiClient } from "@/shared/lib/axios";

interface PatchMeRequest {
  nickname?: string;
  profile_image_key?: string | null;
}

export async function patchMe(payload: PatchMeRequest) {
  const { data: patchMeResponse } = await apiClient.patch(
    "/api/v1/users/me",
    payload,
  );

  return patchMeResponse;
}
