const OAUTH_STATE_STORAGE_KEY = "kakao_oauth_state";

function generateState() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  if (
    typeof crypto !== "undefined" &&
    typeof crypto.getRandomValues === "function"
  ) {
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join(
      "",
    );
  }

  return `${Date.now().toString(16)}${Math.random().toString(16).slice(2)}`;
}

export function createOAuthState() {
  const state = generateState();
  sessionStorage.setItem(OAUTH_STATE_STORAGE_KEY, state);
  return state;
}

export function verifyOAuthState(state: string | null): state is string {
  const savedState = sessionStorage.getItem(OAUTH_STATE_STORAGE_KEY);
  sessionStorage.removeItem(OAUTH_STATE_STORAGE_KEY);
  return Boolean(state) && state === savedState;
}
