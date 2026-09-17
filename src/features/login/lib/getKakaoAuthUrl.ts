export function getKakaoAuthUrl() {
  const params = new URLSearchParams({
    client_id: process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID ?? "",
    redirect_uri: process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI ?? "",
    response_type: "code",
  });

  return `https://kauth.kakao.com/oauth/authorize?${params.toString()}`;
}
