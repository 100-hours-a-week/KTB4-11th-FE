export type TradeType = "buy" | "sell";

export type UnsupportedFeature =
  "manual_investment" | "favorites" | "competition" | "discover" | "search";

export type ReasonSection = `step-${number}`;

export type ElapsedBucket = "within_1h" | "1h_6h" | "6h_24h" | "over_24h";

export type AnalyticsScreen =
  | "home_holdings"
  | "home_trades"
  | "holdings_list"
  | "trade_history"
  | "ai_reasoning"
  | "discover_ranking"
  | "favorites"
  | "duel_list"
  | "duel_detail"
  | "duel_result"
  | "stock_detail";

export type EmptyType =
  | "no_holdings"
  | "no_holdings_category"
  | "no_trades"
  | "no_ranking"
  | "no_favorites"
  | "no_duels";

export type AnalyticsApiName =
  | "holdings"
  | "orders"
  | "ai_report"
  | "ranking"
  | "watchlist"
  | "competitions";

export type DuelCardStatus =
  "ready" | "in_progress" | "completed" | "cancelled";

interface AnalyticsEventMap {
  login: { method: "kakao" };
  sign_up: { method: "kakao" };
  onboarding_start: Record<string, never>;
  onboarding_complete: Record<string, never>;
  account_create: { account_count_after: number };
  account_delete: { account_count_after: number };
  account_rename: Record<string, never>;
  account_switch: { account_count: number };
  trade_list_view: { trade_count: number; account_count: number };
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
  withdraw: Record<string, never>;
  duel_create: Record<string, never>;
  duel_card_click: { status: DuelCardStatus };
  duel_report_click: { competition_id: string };
  duel_report_view: { competition_id: string };
  duel_market_event_expand: { competition_id: string; event_index: number };
  stock_detail_view: { stock_code: string };
  trade_attempt: { stock_code: string; side: TradeType; price_mode: string };
  trade_success: { stock_code: string; side: TradeType; is_filled: boolean };
  trade_fail: { stock_code: string; side: TradeType; error_code?: string };
  trade_button_click: { stock_code: string; side: TradeType };
  trade_input_mode_change: {
    stock_code: string;
    mode: "number" | "orderbook";
  };
  trade_orderbook_select: {
    stock_code: string;
    side: TradeType;
    price: number;
  };
  order_cancel: { stock_code: string };
  chart_period_change: { stock_code: string; period: string };
  chart_granularity_change: { stock_code: string; granularity: string };
  chart_detail_toggle: { stock_code: string; detailed: boolean };
  filter_chip_click: { screen: AnalyticsScreen; filter_value: string };
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
