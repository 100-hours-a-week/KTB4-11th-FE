import { http, HttpResponse, type HttpHandler } from "msw";
import type { Order, OrdersResponse } from "@/features/ai/types/aiTrade";
import type { AiReportResponse } from "@/features/ai/types/aiTradeReasoning";

const AI_REPORTS: Record<number, AiReportResponse> = {
  101: {
    order_id: 101,
    order_side: "sell",
    stock_code: "000660",
    stock_name: "SK하이닉스",
    execution: {
      executed_at: "2026-09-03T14:20:05",
      execution_price: 196_000,
      execution_quantity: 2,
      trade_amount: 392_000,
    },
    reason: "목표 수익률에 도달하고 상승 흐름이 약해져 매도했어요.",
    reasoning: [
      { label: "수익률 확인", body: "목표 수익률에 도달했어요." },
      {
        label: "흐름 검토",
        body: "상승 흐름이 약해져 보유분을 정리하기로 했어요.",
      },
    ],
    sell_result: {
      holding_days: 14,
      average_buy_price: 186_600,
      realized_pnl: 18_400,
      realized_return_percent: 4.9,
      target_return_percent: 4.5,
      target_reached: true,
      stop_loss_triggered: false,
    },
  },
  102: {
    order_id: 102,
    order_side: "buy",
    stock_code: "005930",
    stock_name: "삼성전자",
    execution: {
      executed_at: "2026-08-27T10:14:05",
      execution_price: 72_400,
      execution_quantity: 3,
      trade_amount: 217_200,
    },
    reason:
      "최근 가격 상승 흐름과 거래량 증가가 함께 나타났고, 설정된 위험 범위 안에서 투자할 수 있어 매수했어요.",
    reasoning: [
      {
        label: "투자 조건 확인",
        body: "안정적인 투자 경험을 목표로, 1개월 동안 최대 -3% 손실까지 감당 가능한 범위에서 투자했어요.",
      },
      { label: "시장 상황 확인", body: "반도체 업황이 개선되고 있어요." },
      {
        label: "종목 데이터 분석",
        body: "최근 가격 상승 흐름과 거래량 증가가 함께 나타났어요.",
      },
    ],
    holding_weight_after_trade_percent: 28,
    holding_weight_limit_percent: 30,
    sell_result: null,
  },
  103: {
    order_id: 103,
    order_side: "buy",
    stock_code: "035720",
    stock_name: "카카오",
    execution: {
      executed_at: "2026-08-26T09:38:05",
      execution_price: 43_000,
      execution_quantity: 15,
      trade_amount: 645_000,
    },
    reason: "업종 비중을 나누기 위해 플랫폼 종목을 담았어요.",
    reasoning: [
      { label: "포트폴리오 비중 확인", body: "플랫폼 업종 비중이 낮았어요." },
    ],
    holding_weight_after_trade_percent: 22,
    holding_weight_limit_percent: 30,
    sell_result: null,
  },
  104: {
    order_id: 104,
    order_side: "sell",
    stock_code: "035420",
    stock_name: "NAVER",
    execution: {
      executed_at: "2026-08-20T11:05:05",
      execution_price: 221_500,
      execution_quantity: 4,
      trade_amount: 886_000,
    },
    reason: "실적 우려로 하락 흐름이 이어져 손실을 제한했어요.",
    reasoning: [
      { label: "손실 제한 기준 확인", body: "손실 제한 기준에 도달했어요." },
      { label: "흐름 검토", body: "실적 우려로 하락 흐름이 이어졌어요." },
    ],
    sell_result: {
      holding_days: 9,
      average_buy_price: 223_000,
      realized_pnl: -6_000,
      realized_return_percent: -0.8,
      target_return_percent: 4,
      target_reached: false,
      stop_loss_triggered: true,
    },
  },
  105: {
    order_id: 105,
    order_side: "buy",
    stock_code: "373220",
    stock_name: "LG에너지솔루션",
    execution: {
      executed_at: "2026-08-14T13:42:05",
      execution_price: 412_000,
      execution_quantity: 1,
      trade_amount: 412_000,
    },
    reason: "배터리 업황 반등 신호를 확인해 매수했어요.",
    reasoning: [
      { label: "업황 확인", body: "배터리 업황 반등 신호를 확인했어요." },
    ],
    holding_weight_after_trade_percent: 12,
    holding_weight_limit_percent: 30,
    sell_result: null,
  },
  106: {
    order_id: 106,
    order_side: "sell",
    stock_code: "035720",
    stock_name: "카카오",
    execution: {
      executed_at: "2026-08-05T15:10:05",
      execution_price: 45_200,
      execution_quantity: 10,
      trade_amount: 452_000,
    },
    reason: "목표 수익률에 도달해 일부 물량을 매도했어요.",
    reasoning: [
      { label: "수익률 확인", body: "목표 수익률에 도달했어요." },
      {
        label: "비중 조정",
        body: "업종 비중을 나누기 위해 일부 물량을 정리했어요.",
      },
    ],
    sell_result: {
      holding_days: 6,
      average_buy_price: 43_500,
      realized_pnl: 17_000,
      realized_return_percent: 3.9,
      target_return_percent: 3.5,
      target_reached: true,
      stop_loss_triggered: false,
    },
  },
};

const ORDERS: Order[] = Object.values(AI_REPORTS)
  .map((report) => ({
    order_id: report.order_id,
    stock_code: report.stock_code,
    stock_name: report.stock_name,
    order_source: "ai" as const,
    order_side: report.order_side,
    order_type: "market" as const,
    order_status: "executed" as const,
    quantity: report.execution.execution_quantity,
    limit_price: null,
    reserved_cash: 0,
    created_at: report.execution.executed_at,
    canceled_at: null,
    reason: { summary: report.reason },
    executions: [
      {
        execution_id: report.order_id,
        execution_price: report.execution.execution_price,
        execution_quantity: report.execution.execution_quantity,
        realized_pnl: report.sell_result?.realized_pnl ?? null,
        realized_return_percent:
          report.sell_result?.realized_return_percent ?? null,
        created_at: report.execution.executed_at,
      },
    ],
    execution_summary: {
      quantity: report.execution.execution_quantity,
      average_price: report.execution.execution_price,
      total_amount: report.execution.trade_amount,
      executed_at: report.execution.executed_at,
      realized_pnl: report.sell_result?.realized_pnl ?? null,
      realized_return_percent:
        report.sell_result?.realized_return_percent ?? null,
    },
    can_cancel: false,
  }))
  .sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

export const aiHandlers: HttpHandler[] = [
  http.get("*/api/v1/accounts/:accountId/orders", async () => {
    return HttpResponse.json<OrdersResponse>({
      message: "success",
      account_id: 1,
      orders: ORDERS,
    });
  }),
  http.get(
    "*/api/v1/accounts/:accountId/orders/:orderId/ai-report",
    async ({ params }) => {
      const orderId = Number(params.orderId);
      const report = AI_REPORTS[orderId];

      if (!report) {
        return HttpResponse.json({ message: "not found" }, { status: 404 });
      }

      return HttpResponse.json<AiReportResponse>(report);
    },
  ),
];
