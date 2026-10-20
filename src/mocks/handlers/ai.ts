import { http, HttpResponse, type HttpHandler } from "msw";
import type { Order, OrdersResponse } from "@/features/ai/types/aiTrade";
import type { AiReportResponse } from "@/features/ai/types/aiTradeReasoning";
import type {
  CreateOrderRequest,
  CreateOrderResponse,
} from "@/features/stock/types/stockTrade";
import { DEMO_ACCOUNTS } from "@/mocks/handlers/account";
import { HOLDINGS } from "@/mocks/handlers/holdings";

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

// 종목 상세 "내 주식" 탭 데모용 (사용자가 직접 낸 주문)
const USER_ORDERS: Order[] = [
  {
    order_id: 201,
    stock_code: "035420",
    stock_name: "NAVER",
    order_source: "user",
    order_side: "buy",
    order_type: "limit",
    order_status: "pending",
    quantity: 3,
    limit_price: 220_000,
    reserved_cash: 660_000,
    created_at: "2026-08-25T09:41:00+09:00",
    canceled_at: null,
    reason: null,
    executions: [],
    execution_summary: null,
    can_cancel: true,
  },
  {
    order_id: 202,
    stock_code: "035420",
    stock_name: "NAVER",
    order_source: "user",
    order_side: "sell",
    order_type: "limit",
    order_status: "pending",
    quantity: 1,
    limit_price: 225_000,
    reserved_cash: 0,
    created_at: "2026-08-25T10:02:00+09:00",
    canceled_at: null,
    reason: null,
    executions: [],
    execution_summary: null,
    can_cancel: true,
  },
  {
    order_id: 203,
    stock_code: "035420",
    stock_name: "NAVER",
    order_source: "user",
    order_side: "buy",
    order_type: "limit",
    order_status: "executed",
    quantity: 2,
    limit_price: 223_000,
    reserved_cash: 0,
    created_at: "2026-08-26T09:32:00+09:00",
    canceled_at: null,
    reason: null,
    executions: [
      {
        execution_id: 3001,
        execution_price: 223_000,
        execution_quantity: 2,
        realized_pnl: null,
        realized_return_percent: null,
        created_at: "2026-08-26T09:32:00+09:00",
      },
    ],
    execution_summary: {
      quantity: 2,
      average_price: 223_000,
      total_amount: 446_000,
      executed_at: "2026-08-26T09:32:00+09:00",
      realized_pnl: null,
      realized_return_percent: null,
    },
    can_cancel: false,
  },
  {
    order_id: 204,
    stock_code: "035420",
    stock_name: "NAVER",
    order_source: "user",
    order_side: "buy",
    order_type: "limit",
    order_status: "executed",
    quantity: 3,
    limit_price: 221_000,
    reserved_cash: 0,
    created_at: "2026-08-20T10:15:00+09:00",
    canceled_at: null,
    reason: null,
    executions: [
      {
        execution_id: 3002,
        execution_price: 221_000,
        execution_quantity: 3,
        realized_pnl: null,
        realized_return_percent: null,
        created_at: "2026-08-20T10:15:00+09:00",
      },
    ],
    execution_summary: {
      quantity: 3,
      average_price: 221_000,
      total_amount: 663_000,
      executed_at: "2026-08-20T10:15:00+09:00",
      realized_pnl: null,
      realized_return_percent: null,
    },
    can_cancel: false,
  },
  {
    order_id: 205,
    stock_code: "035420",
    stock_name: "NAVER",
    order_source: "user",
    order_side: "sell",
    order_type: "limit",
    order_status: "executed",
    quantity: 1,
    limit_price: 219_500,
    reserved_cash: 0,
    created_at: "2026-08-18T13:47:00+09:00",
    canceled_at: null,
    reason: null,
    executions: [
      {
        execution_id: 3003,
        execution_price: 219_500,
        execution_quantity: 1,
        realized_pnl: -1_500,
        realized_return_percent: -0.7,
        created_at: "2026-08-18T13:47:00+09:00",
      },
    ],
    execution_summary: {
      quantity: 1,
      average_price: 219_500,
      total_amount: 219_500,
      executed_at: "2026-08-18T13:47:00+09:00",
      realized_pnl: -1_500,
      realized_return_percent: -0.7,
    },
    can_cancel: false,
  },
];

const ORDERS: Order[] = [
  ...Object.values(AI_REPORTS).map((report) => ({
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
  })),
  ...USER_ORDERS,
].sort(
  (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
);

let nextOrderId = 206;

export const aiHandlers: HttpHandler[] = [
  http.get("*/api/v1/accounts/:accountId/orders", async ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? "0");
    const limit = Number(url.searchParams.get("limit") ?? "10");
    const orderSide = url.searchParams.get("order_side");
    const orderStatus = url.searchParams.get("order_status");
    const stockCode = url.searchParams.get("stock_code");

    const filteredOrders = ORDERS.filter(
      (order) =>
        (!orderSide || order.order_side === orderSide) &&
        (!orderStatus || order.order_status === orderStatus) &&
        (!stockCode || order.stock_code === stockCode),
    );
    const totalElements = filteredOrders.length;
    const totalPages = Math.ceil(totalElements / limit);
    const start = page * limit;
    const orders = filteredOrders.slice(start, start + limit);

    return HttpResponse.json<OrdersResponse>({
      message: "success",
      account_id: 1,
      pagination: {
        page,
        limit,
        total_elements: totalElements,
        total_pages: totalPages,
        has_next: page + 1 < totalPages,
      },
      orders,
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

  http.post(
    "*/api/v1/accounts/:accountId/orders",
    async ({ request, params }) => {
      const body = (await request.json()) as CreateOrderRequest;
      const accountId = Number(params.accountId);
      const account = DEMO_ACCOUNTS.find(
        (item) => item.account_id === accountId,
      );
      const holding = HOLDINGS.find(
        (item) => item.stock_code === body.stock_code,
      );
      const referencePrice = body.limit_price ?? holding?.current_price ?? 0;

      if (body.order_side === "sell") {
        const availableQuantity = holding?.quantity ?? 0;
        if (body.quantity > availableQuantity) {
          return HttpResponse.json(
            {
              message: "매도 가능한 수량이 부족합니다.",
              code: "INSUFFICIENT_AVAILABLE_QUANTITY",
            },
            { status: 409 },
          );
        }
      }

      if (body.order_side === "buy") {
        const cost = referencePrice * body.quantity;
        if (account && cost > account.cash_balance) {
          return HttpResponse.json(
            {
              message: "주문 가능한 금액이 부족합니다.",
              code: "INSUFFICIENT_CASH",
            },
            { status: 409 },
          );
        }
      }

      const now = new Date().toISOString();
      const isFilled = body.order_type === "market";
      const orderId = nextOrderId++;

      const order: Order = {
        order_id: orderId,
        stock_code: body.stock_code,
        stock_name: body.stock_name,
        order_source: "user",
        order_side: body.order_side,
        order_type: body.order_type,
        order_status: isFilled ? "executed" : "pending",
        quantity: body.quantity,
        limit_price: body.limit_price,
        reserved_cash:
          body.order_side === "buy" && !isFilled
            ? referencePrice * body.quantity
            : 0,
        created_at: now,
        canceled_at: null,
        reason: null,
        executions: isFilled
          ? [
              {
                execution_id: orderId * 10,
                execution_price: referencePrice,
                execution_quantity: body.quantity,
                realized_pnl: null,
                realized_return_percent: null,
                created_at: now,
              },
            ]
          : [],
        execution_summary: isFilled
          ? {
              quantity: body.quantity,
              average_price: referencePrice,
              total_amount: referencePrice * body.quantity,
              executed_at: now,
              realized_pnl: null,
              realized_return_percent: null,
            }
          : null,
        can_cancel: !isFilled,
      };

      ORDERS.unshift(order);

      return HttpResponse.json<CreateOrderResponse>(
        {
          order_id: order.order_id,
          account_id: accountId,
          stock_code: order.stock_code,
          order_side: order.order_side,
          order_type: order.order_type,
          limit_price: order.limit_price,
          quantity: order.quantity,
          order_status: isFilled ? "executed" : "pending",
          reserved_cash: order.reserved_cash,
          created_at: order.created_at,
          executions: order.executions.map((execution) => ({
            execution_id: execution.execution_id,
            execution_price: execution.execution_price,
            execution_quantity: execution.execution_quantity,
          })),
        },
        { status: 201 },
      );
    },
  ),

  http.patch(
    "*/api/v1/accounts/:accountId/orders/:orderId",
    async ({ params }) => {
      const orderId = Number(params.orderId);
      const order = ORDERS.find((item) => item.order_id === orderId);

      if (!order) {
        return HttpResponse.json(
          { message: "찾을 수 없습니다" },
          { status: 404 },
        );
      }
      if (order.order_status === "executed") {
        return HttpResponse.json(
          {
            message: "이미 체결된 주문은 취소할 수 없습니다.",
            code: "ORDER_ALREADY_FILLED",
          },
          { status: 400 },
        );
      }
      if (order.order_status === "cancelled") {
        return HttpResponse.json(
          { message: "이미 취소된 주문입니다." },
          { status: 409 },
        );
      }

      const canceledAt = new Date().toISOString();
      order.order_status = "cancelled";
      order.canceled_at = canceledAt;
      order.can_cancel = false;

      return HttpResponse.json({
        message: "success",
        order_id: order.order_id,
        order_status: order.order_status,
        canceled_at: canceledAt,
      });
    },
  ),
];
