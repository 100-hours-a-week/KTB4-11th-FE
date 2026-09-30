export interface KakaoLoginRequest {
  provider: "kakao";
  authorization_code: string;
  state: string;
}

export interface KakaoLoginResponse {
  code: string;
  message: string;
  user_id?: number;
}
