export const SELECTED_ACCOUNT_COOKIE = "selected_account_id";

const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

export function writeSelectedAccountCookie(accountId?: number) {
  if (typeof document === "undefined") return;

  if (accountId === undefined) {
    document.cookie = `${SELECTED_ACCOUNT_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
    return;
  }

  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${SELECTED_ACCOUNT_COOKIE}=${accountId}; Path=/; Max-Age=${ONE_YEAR_IN_SECONDS}; SameSite=Lax${secure}`;
}
