const OAUTH_STATE_STORAGE_KEY = "kakao_oauth_state";

export function createOAuthState() {
  const state = crypto.randomUUID();
  sessionStorage.setItem(OAUTH_STATE_STORAGE_KEY, state);
  return state;
}

export function verifyOAuthState(state: string | null): state is string {
  const savedState = sessionStorage.getItem(OAUTH_STATE_STORAGE_KEY);
  sessionStorage.removeItem(OAUTH_STATE_STORAGE_KEY);
  return Boolean(state) && state === savedState;
}
