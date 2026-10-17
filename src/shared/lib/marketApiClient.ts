import axios from "axios";

// market 서비스(시세·호가 실시간 연동)용 클라이언트 (공개 데이터라 인증/CSRF 없음)
export const marketApiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_MARKET_API_BASE_URL,
  timeout: 10_000,
});
