import axios from "axios";
import { toast } from "sonner";
import { postReissue } from "@/features/auth/api/postReissue";
import { captureError } from "@/shared/utils/captureError";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10_000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const SAFE_METHODS = new Set(["get", "head", "options"]);

type CsrfTokenResponse = {
  token: string;
  header_name: string;
};

let csrfToken: CsrfTokenResponse | null = null;
let csrfTokenPromise: Promise<CsrfTokenResponse> | null = null;

// httpOnly CSRF 쿠키를 못 읽어서 응답 본문 token을 직접 캐싱
async function fetchCsrfToken() {
  csrfTokenPromise ??= apiClient
    .get<CsrfTokenResponse>("/api/v1/auth/csrf")
    .then(({ data }) => {
      csrfToken = data;
      return data;
    })
    .catch((error) => {
      csrfTokenPromise = null;
      throw error;
    });

  return csrfTokenPromise;
}

apiClient.interceptors.request.use(async (config) => {
  const method = config.method?.toLowerCase();

  if (method && !SAFE_METHODS.has(method)) {
    const token = csrfToken ?? (await fetchCsrfToken());
    config.headers.set(token.header_name, token.token);
  }

  return config;
});

let reissuePromise: Promise<unknown> | null = null;

function expireSession() {
  toast.error("로그인 정보가 만료됐어요. 다시 로그인해 주세요.");
  // 하드 리로드로 React Query 캐시/앱 상태를 완전히 초기화
  // eslint-disable-next-line @next/next/no-location-assign-relative-destination
  window.location.href = "/";
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const isCsrfError = error.response?.data?.code === "INVALID_CSRF_TOKEN";
    const alreadyRetriedCsrf = error.config?.__isCsrfRetry;

    if (isCsrfError && !alreadyRetriedCsrf) {
      csrfToken = null;
      csrfTokenPromise = null;

      return apiClient({ ...error.config, __isCsrfRetry: true });
    }

    const isUnauthorized = error.response?.status === 401;

    if (isUnauthorized) {
      const skipAuthRedirect = error.config?.skipAuthRedirect;
      const isReissueRequest = error.config?.url?.includes("/auth/reissue");
      const alreadyRetriedAuth = error.config?.__isAuthRetry;

      if (!isReissueRequest && !alreadyRetriedAuth) {
        try {
          reissuePromise ??= postReissue(
            skipAuthRedirect ? { skipAuthRedirect: true } : undefined,
          ).finally(() => {
            reissuePromise = null;
          });
          await reissuePromise;

          return apiClient({ ...error.config, __isAuthRetry: true });
        } catch {
          if (!skipAuthRedirect) expireSession();
          return Promise.reject(error);
        }
      }

      if (!skipAuthRedirect) expireSession();
    }

    captureError(error, {
      tags: { source: "api-client" },
      extra: {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
      },
    });

    return Promise.reject(error);
  },
);
