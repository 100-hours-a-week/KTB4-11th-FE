import axios from "axios";

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

// CSRF 쿠키가 httpOnly라 JS로 못 읽으므로, 응답 본문의 token을 직접 캐싱해서 헤더에 실어 보낸다
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

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const isCsrfError = error.response?.data?.code === "INVALID_CSRF_TOKEN";
    const alreadyRetried = error.config?.__isCsrfRetry;

    if (isCsrfError && !alreadyRetried) {
      csrfToken = null;
      csrfTokenPromise = null;

      return apiClient({ ...error.config, __isCsrfRetry: true });
    }

    return Promise.reject(error);
  },
);
