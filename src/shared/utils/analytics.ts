export type TradeType = "buy" | "sell";

export type UnsupportedFeature =
  "manual_investment" | "favorites" | "competition" | "discover";

export type ReasonSection =
  "step-1" | "step-2" | "step-3" | "step-4" | "step-5";

export type ElapsedBucket = "within_1h" | "1h_6h" | "6h_24h" | "over_24h";

export type AnalyticsScreen =
  | "home_holdings"
  | "home_ai_trades"
  | "holdings_list"
  | "ai_trade_history"
  | "ai_reasoning";

export type EmptyType = "no_holdings" | "no_holdings_category" | "no_trades";

export type AnalyticsApiName = "holdings" | "orders" | "ai_report";

interface AnalyticsEventMap {
  login: { method: "kakao" };
  sign_up: { method: "kakao" };
  onboarding_start: Record<string, never>;
  onboarding_complete: Record<string, never>;
  account_create: { account_count_after: number };
  account_delete: { account_count_after: number };
  account_rename: Record<string, never>;
  account_switch: { account_count: number };
  ai_trade_list_view: { trade_count: number; account_count: number };
  ai_reason_view: {
    stock_code: string;
    trade_type: TradeType;
    elapsed_bucket: ElapsedBucket;
  };
  ai_reason_expand: { reason_section: ReasonSection };
  unsupported_feature_click: { feature_name: UnsupportedFeature };
  empty_state_view: { screen: AnalyticsScreen; empty_type: EmptyType };
  error_view: {
    screen: AnalyticsScreen;
    api_name: AnalyticsApiName;
    error_code?: string;
  };
  retry_click: {
    screen: AnalyticsScreen;
    api_name: AnalyticsApiName;
    error_code?: string;
  };
  logout: Record<string, never>;
}

function pushToDataLayer(...args: unknown[]) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(args);
}

export function trackEvent<Name extends keyof AnalyticsEventMap>(
  name: Name,
  ...params: AnalyticsEventMap[Name] extends Record<string, never>
    ? []
    : [AnalyticsEventMap[Name]]
) {
  pushToDataLayer("event", name, params[0] ?? {});
}

export function setAnalyticsUserId(userId: number) {
  pushToDataLayer("set", { user_id: String(userId) });
}

export function getElapsedBucket(executedAt: string): ElapsedBucket {
  const hoursElapsed =
    (Date.now() - new Date(executedAt).getTime()) / (1000 * 60 * 60);

  if (hoursElapsed < 1) return "within_1h";
  if (hoursElapsed < 6) return "1h_6h";
  if (hoursElapsed < 24) return "6h_24h";
  return "over_24h";
}
