export interface KakaoLoginRequest {
  provider: "kakao";
  authorization_code: string;
  state: string;
}

export interface KakaoLoginResponse {
  message: string;
  user_id: number;
  access_token: string;
  token_type: string;
  expires_in: number;
  onboarding_required: boolean;
}
