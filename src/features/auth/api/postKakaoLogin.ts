import { apiClient } from "@/shared/lib/axios";
import type {
  KakaoLoginRequest,
  KakaoLoginResponse,
} from "@/features/auth/types/login";

export async function postKakaoLogin(
  payload: Omit<KakaoLoginRequest, "provider">,
) {
  const { data: kakaoLoginResponse } = await apiClient.post<KakaoLoginResponse>(
    "/api/v1/auth/login",
    { provider: "kakao", ...payload },
  );

  return kakaoLoginResponse;
}
