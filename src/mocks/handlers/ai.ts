import { http, HttpResponse, type HttpHandler } from "msw";
import type { Order, OrdersResponse } from "@/features/ai/types/aiTrade";
import type { AiReportResponse } from "@/features/ai/types/aiTradeReasoning";

const BUY_DECISION_STEPS = [
  {
    step: 1,
    title: "투자 조건 확인",
    items: [
      { label: "투자 목표", value: "안정적인 투자 경험" },
      { label: "투자 기간", value: "1개월" },
      { label: "감당 가능한 손실", value: "최대 -3%" },
      { label: "종목당 최대 비중", value: "30%" },
    ],
  },
  { step: 2, title: "시장 상황 확인", items: [] },
  { step: 3, title: "종목 데이터 분석", items: [] },
  { step: 4, title: "위험 검토", items: [] },
  { step: 5, title: "매수 결정", items: [] },
];

const AI_REPORTS: Record<number, AiReportResponse> = {
  101: {
    message: "success",
    report_id: 1,
    order_id: 101,
    order_side: "sell",
    stock_code: "000660",
    stock_name: "SK하이닉스",
    report_status: "completed",
    decided_at: "2026-09-03T14:20:00",
    execution: {
      executed_at: "2026-09-03T14:20:05",
      execution_price: 196_000,
      execution_quantity: 2,
      trade_amount: 392_000,
    },
    summary: "목표 수익률에 도달하고 상승 흐름이 약해져 매도했어요.",
    buy_analysis: null,
    sell_analysis: {
      trade_result: {
        average_buy_price: 186_600,
        holding_days: 14,
        realized_pnl: 18_400,
        realized_return_percent: 4.9,
        target_return_percent: 4.5,
        target_reached: true,
        stop_loss_triggered: false,
      },
      buy_decision: {
        buy_report_id: 0,
        summary: "업종 반등 초기로 보고 2주 매수했어요",
      },
      holding_changes: [
        { observed_at: "2026-08-29T00:00:00", summary: "상승 유지" },
        { observed_at: "2026-09-02T00:00:00", summary: "거래량이 줄었어요" },
      ],
      sell_decision: "매수 근거였던 상승 흐름이 유지되지 않아 정리했어요",
      expectation_vs_outcome: {
        expected_return_min_percent: 3,
        expected_return_max_percent: 5,
        summary: "예상 범위 안에서 목표를 달성했어요",
      },
    },
  },
  102: {
    message: "success",
    report_id: 2,
    order_id: 102,
    order_side: "buy",
    stock_code: "005930",
    stock_name: "삼성전자",
    report_status: "completed",
    decided_at: "2026-08-27T10:14:00",
    execution: {
      executed_at: "2026-08-27T10:14:05",
      execution_price: 72_400,
      execution_quantity: 3,
      trade_amount: 217_200,
    },
    summary:
      "최근 가격 상승 흐름과 거래량 증가가 함께 나타났고, 설정된 위험 범위 안에서 투자할 수 있어 매수했어요.",
    buy_analysis: {
      holding_weight_after_trade_percent: 28,
      holding_weight_limit_percent: 30,
      decision_steps: BUY_DECISION_STEPS,
    },
    sell_analysis: null,
  },
  103: {
    message: "success",
    report_id: 3,
    order_id: 103,
    order_side: "buy",
    stock_code: "035720",
    stock_name: "카카오",
    report_status: "completed",
    decided_at: "2026-08-26T09:38:00",
    execution: {
      executed_at: "2026-08-26T09:38:05",
      execution_price: 43_000,
      execution_quantity: 15,
      trade_amount: 645_000,
    },
    summary: "업종 비중을 나누기 위해 플랫폼 종목을 담았어요.",
    buy_analysis: {
      holding_weight_after_trade_percent: 22,
      holding_weight_limit_percent: 30,
      decision_steps: BUY_DECISION_STEPS,
    },
    sell_analysis: null,
  },
  104: {
    message: "success",
    report_id: 4,
    order_id: 104,
    order_side: "sell",
    stock_code: "035420",
    stock_name: "NAVER",
    report_status: "completed",
    decided_at: "2026-08-20T11:05:00",
    execution: {
      executed_at: "2026-08-20T11:05:05",
      execution_price: 221_500,
      execution_quantity: 4,
      trade_amount: 886_000,
    },
    summary: "실적 우려로 하락 흐름이 이어져 손실을 제한했어요.",
    buy_analysis: null,
    sell_analysis: {
      trade_result: {
        average_buy_price: 223_000,
        holding_days: 9,
        realized_pnl: -6_000,
        realized_return_percent: -0.8,
        target_return_percent: 4,
        target_reached: false,
        stop_loss_triggered: true,
      },
      buy_decision: {
        buy_report_id: 0,
        summary: "실적 발표 전 반등을 기대하고 매수했어요",
      },
      holding_changes: [
        {
          observed_at: "2026-08-18T00:00:00",
          summary: "실적 우려로 하락 전환",
        },
      ],
      sell_decision: "손실 제한 기준에 도달해 정리했어요",
      expectation_vs_outcome: {
        expected_return_min_percent: 2,
        expected_return_max_percent: 4,
        summary: "예상과 달리 손실 제한 기준에서 정리했어요",
      },
    },
  },
  105: {
    message: "success",
    report_id: 5,
    order_id: 105,
    order_side: "buy",
    stock_code: "373220",
    stock_name: "LG에너지솔루션",
    report_status: "completed",
    decided_at: "2026-08-14T13:42:00",
    execution: {
      executed_at: "2026-08-14T13:42:05",
      execution_price: 412_000,
      execution_quantity: 1,
      trade_amount: 412_000,
    },
    summary: "배터리 업황 반등 신호를 확인해 매수했어요.",
    buy_analysis: {
      holding_weight_after_trade_percent: 12,
      holding_weight_limit_percent: 30,
      decision_steps: BUY_DECISION_STEPS,
    },
    sell_analysis: null,
  },
  106: {
    message: "success",
    report_id: 6,
    order_id: 106,
    order_side: "sell",
    stock_code: "035720",
    stock_name: "카카오",
    report_status: "completed",
    decided_at: "2026-08-05T15:10:00",
    execution: {
      executed_at: "2026-08-05T15:10:05",
      execution_price: 45_200,
      execution_quantity: 10,
      trade_amount: 452_000,
    },
    summary: "목표 수익률에 도달해 일부 물량을 매도했어요.",
    buy_analysis: null,
    sell_analysis: {
      trade_result: {
        average_buy_price: 43_500,
        holding_days: 6,
        realized_pnl: 17_000,
        realized_return_percent: 3.9,
        target_return_percent: 3.5,
        target_reached: true,
        stop_loss_triggered: false,
      },
      buy_decision: {
        buy_report_id: 0,
        summary: "업종 비중을 나누기 위해 플랫폼 종목을 담았어요",
      },
      holding_changes: [
        {
          observed_at: "2026-08-04T00:00:00",
          summary: "거래량 증가와 함께 상승",
        },
      ],
      sell_decision: "목표 수익률에 도달해 일부 물량을 정리했어요",
      expectation_vs_outcome: {
        expected_return_min_percent: 3,
        expected_return_max_percent: 5,
        summary: "예상 범위 안에서 목표를 달성했어요",
      },
    },
  },
};

const ORDERS: Order[] = Object.values(AI_REPORTS)
  .map((report) => ({
    order_id: report.order_id,
    stock_code: report.stock_code,
    stock_name: report.stock_name,
    order_side: report.order_side,
    order_type: "market" as const,
    order_status: "executed" as const,
    quantity: report.execution.execution_quantity,
    limit_price: null,
    reserved_cash: 0,
    created_at: report.decided_at,
    canceled_at: null,
    executions: [
      {
        execution_id: report.report_id,
        execution_price: report.execution.execution_price,
        execution_quantity: report.execution.execution_quantity,
        created_at: report.execution.executed_at,
      },
    ],
    can_cancel: false,
    summary: report.summary,
    realized_pnl: report.sell_analysis?.trade_result.realized_pnl ?? null,
    realized_return_percent:
      report.sell_analysis?.trade_result.realized_return_percent ?? null,
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
