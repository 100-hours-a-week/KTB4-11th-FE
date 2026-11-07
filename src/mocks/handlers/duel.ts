import { http, HttpResponse, type HttpHandler } from "msw";
import type {
  CancelCompetitionResponse,
  CompetitionApiItem,
  CompetitionDetailResponse,
  CompetitionNameAvailabilityResponse,
  CompetitionExecution,
  CompetitionExecutionsResponse,
  CompetitionReportResponse,
  CompetitionResultResponse,
  CompetitionsResponse,
  CreateCompetitionRequest,
  CreateCompetitionResponse,
} from "@/features/ai/types/duel";
import { addDemoAccount } from "@/mocks/handlers/account";

const DEMO_COMPETITIONS: CompetitionApiItem[] = [
  {
    competition_id: 4,
    state: "ready",
    competition_name: "다음 장 시작 대기",
    competition_type: "user_vs_ai",
    start_date: "2026-10-21",
    end_date: "2026-11-04",
    d_day: 14,
    cumulative_return_percent: 0,
    winner: null,
  },
  {
    competition_id: 1,
    state: "in_progress",
    competition_name: "8월 반도체 집중",
    competition_type: "user_vs_ai",
    start_date: "2026-08-14",
    end_date: "2026-09-07",
    d_day: 12,
    cumulative_return_percent: 6.4,
    winner: null,
  },
  {
    competition_id: 2,
    state: "completed",
    competition_name: "5월 첫 대결",
    competition_type: "user_vs_ai",
    start_date: "2026-05-01",
    end_date: "2026-05-31",
    d_day: 0,
    cumulative_return_percent: 3.2,
    winner: "user",
  },
  {
    competition_id: 3,
    state: "completed",
    competition_name: "4월 연습 대결",
    competition_type: "user_vs_ai",
    start_date: "2026-04-01",
    end_date: "2026-04-30",
    d_day: 0,
    cumulative_return_percent: -1.5,
    winner: "ai",
  },
  {
    competition_id: 5,
    state: "in_progress",
    competition_name: "전략 A vs B",
    competition_type: "ai_vs_ai",
    start_date: "2026-11-02",
    end_date: "2026-12-02",
    d_day: 20,
    cumulative_return_percent: 3.4,
    winner: null,
  },
  {
    competition_id: 6,
    state: "completed",
    competition_name: "7월 배당주 실험",
    competition_type: "ai_vs_ai",
    start_date: "2026-07-01",
    end_date: "2026-07-31",
    d_day: 0,
    cumulative_return_percent: 5.8,
    winner: null,
  },
  {
    competition_id: 7,
    state: "completed",
    competition_name: "동률 테스트",
    competition_type: "user_vs_ai",
    start_date: "2026-03-01",
    end_date: "2026-03-31",
    d_day: 0,
    cumulative_return_percent: 0,
    winner: "draw",
  },
  {
    competition_id: 8,
    state: "completed",
    competition_name: "AI 동률 테스트",
    competition_type: "ai_vs_ai",
    start_date: "2026-02-01",
    end_date: "2026-02-28",
    d_day: 0,
    cumulative_return_percent: 3.3,
    winner: null,
  },
];

const DEMO_COMPETITION_DETAILS: Record<number, CompetitionDetailResponse> = {
  4: {
    competition_id: 4,
    competition_name: "다음 장 시작 대기",
    competition_type: "user_vs_ai",
    state: "ready",
    start_date: "2026-10-21",
    end_date: "2026-11-04",
    d_day: 14,
    participants: [
      {
        participant_id: 7,
        account_id: 104,
        participant_type: "user",
        display_name: "나",
        executed_trade_count: 0,
        strategy: null,
        top_return_holding: null,
        total_assets: 3_000_000,
        cumulative_return_percent: 0,
        daily_performances: [],
      },
      {
        participant_id: 8,
        account_id: 105,
        participant_type: "ai",
        display_name: "AI",
        executed_trade_count: 0,
        strategy: null,
        top_return_holding: null,
        total_assets: 3_000_000,
        cumulative_return_percent: 0,
        daily_performances: [],
      },
    ],
  },
  1: {
    competition_id: 1,
    competition_name: "8월 반도체 집중",
    competition_type: "user_vs_ai",
    state: "in_progress",
    start_date: "2026-08-14",
    end_date: "2026-09-07",
    d_day: 12,
    participants: [
      {
        participant_id: 1,
        account_id: 3,
        participant_type: "user",
        display_name: "나",
        executed_trade_count: 2,
        strategy: null,
        top_return_holding: {
          stock_code: "000660",
          stock_name: "SK하이닉스",
          return_percent: 10.0,
        },
        total_assets: 3_192_000,
        cumulative_return_percent: 6.4,
        daily_performances: [
          { date: "2026-08-14", cumulative_return_percent: 0 },
          { date: "2026-08-19", cumulative_return_percent: 1.8 },
          { date: "2026-08-24", cumulative_return_percent: 3.4 },
          { date: "2026-08-26", cumulative_return_percent: 6.4 },
        ],
      },
      {
        participant_id: 2,
        account_id: 4,
        participant_type: "ai",
        display_name: "AI",
        executed_trade_count: 0,
        strategy: null,
        top_return_holding: null,
        total_assets: 3_000_000,
        cumulative_return_percent: 0,
        daily_performances: [
          { date: "2026-08-14", cumulative_return_percent: 0 },
          { date: "2026-08-19", cumulative_return_percent: 0 },
          { date: "2026-08-24", cumulative_return_percent: 0 },
          { date: "2026-08-26", cumulative_return_percent: 0 },
        ],
      },
    ],
  },
  5: {
    competition_id: 5,
    competition_name: "전략 A vs B",
    competition_type: "ai_vs_ai",
    state: "in_progress",
    start_date: "2026-11-02",
    end_date: "2026-12-02",
    d_day: 20,
    participants: [
      {
        participant_id: 9,
        account_id: 106,
        participant_type: "ai",
        display_name: "AI 1",
        executed_trade_count: 1,
        strategy: {
          risk_level: 5,
          preferred_themes: ["반도체", "2차전지"],
          excluded_themes: ["게임"],
          additional_request:
            "장기 성장 가능성이 높은 기업을 중심으로 투자해주세요.",
        },
        top_return_holding: {
          stock_code: "000660",
          stock_name: "SK하이닉스",
          return_percent: 10.0,
        },
        total_assets: 3_102_000,
        cumulative_return_percent: 3.4,
        daily_performances: [
          { date: "2026-11-02", cumulative_return_percent: 0 },
          { date: "2026-11-03", cumulative_return_percent: 1.2 },
          { date: "2026-11-04", cumulative_return_percent: 2.1 },
          { date: "2026-11-05", cumulative_return_percent: 3.4 },
        ],
      },
      {
        participant_id: 10,
        account_id: 107,
        participant_type: "ai",
        display_name: "AI 2",
        executed_trade_count: 0,
        strategy: {
          risk_level: 3,
          preferred_themes: ["금융"],
          excluded_themes: ["바이오"],
          additional_request: "",
        },
        top_return_holding: null,
        total_assets: 3_000_000,
        cumulative_return_percent: 0,
        daily_performances: [
          { date: "2026-11-02", cumulative_return_percent: 0 },
          { date: "2026-11-03", cumulative_return_percent: 0 },
          { date: "2026-11-04", cumulative_return_percent: 0 },
          { date: "2026-11-05", cumulative_return_percent: 0 },
        ],
      },
    ],
  },
};

const DEMO_COMPETITION_RESULTS: Record<number, CompetitionResultResponse> = {
  2: {
    competition_id: 2,
    competition_name: "5월 첫 대결",
    competition_type: "user_vs_ai",
    state: "completed",
    start_date: "2026-05-01",
    end_date: "2026-05-31",
    d_day: null,
    winner: "나",
    winner_participant_ids: [1],
    participants: [
      {
        participant_id: 1,
        account_id: 5,
        participant_type: "user",
        display_name: "나",
        final_asset_value: 3_192_000,
        final_return_percent: 3.2,
        rank: 1,
        executed_trade_count: 2,
        strategy: null,
        daily_performances: [
          { date: "2026-05-01", cumulative_return_percent: 0 },
          { date: "2026-05-15", cumulative_return_percent: 1.9 },
          { date: "2026-05-31", cumulative_return_percent: 3.2 },
        ],
      },
      {
        participant_id: 2,
        account_id: 6,
        participant_type: "ai",
        display_name: "AI",
        final_asset_value: 3_045_000,
        final_return_percent: 1.5,
        rank: 2,
        executed_trade_count: 1,
        strategy: null,
        daily_performances: [
          { date: "2026-05-01", cumulative_return_percent: 0 },
          { date: "2026-05-15", cumulative_return_percent: 0.8 },
          { date: "2026-05-31", cumulative_return_percent: 1.5 },
        ],
      },
    ],
  },
  3: {
    competition_id: 3,
    competition_name: "4월 연습 대결",
    competition_type: "user_vs_ai",
    state: "completed",
    start_date: "2026-04-01",
    end_date: "2026-04-30",
    d_day: null,
    winner: "AI",
    winner_participant_ids: [2],
    participants: [
      {
        participant_id: 1,
        account_id: 7,
        participant_type: "user",
        display_name: "나",
        final_asset_value: 2_955_000,
        final_return_percent: -1.5,
        rank: 2,
        executed_trade_count: 1,
        strategy: null,
        daily_performances: [
          { date: "2026-04-01", cumulative_return_percent: 0 },
          { date: "2026-04-15", cumulative_return_percent: -0.8 },
          { date: "2026-04-30", cumulative_return_percent: -1.5 },
        ],
      },
      {
        participant_id: 2,
        account_id: 8,
        participant_type: "ai",
        display_name: "AI",
        final_asset_value: 3_069_000,
        final_return_percent: 2.3,
        rank: 1,
        executed_trade_count: 1,
        strategy: null,
        daily_performances: [
          { date: "2026-04-01", cumulative_return_percent: 0 },
          { date: "2026-04-15", cumulative_return_percent: 1.1 },
          { date: "2026-04-30", cumulative_return_percent: 2.3 },
        ],
      },
    ],
  },
  6: {
    competition_id: 6,
    competition_name: "7월 배당주 실험",
    competition_type: "ai_vs_ai",
    state: "completed",
    start_date: "2026-07-01",
    end_date: "2026-07-31",
    d_day: null,
    winner: "AI 2",
    winner_participant_ids: [12],
    participants: [
      {
        participant_id: 11,
        account_id: 108,
        participant_type: "ai",
        display_name: "AI 1",
        final_asset_value: 3_093_000,
        final_return_percent: 3.1,
        rank: 2,
        executed_trade_count: 18,
        strategy: {
          risk_level: 5,
          preferred_themes: ["반도체", "2차전지"],
          excluded_themes: ["게임"],
          additional_request:
            "장기 성장 가능성이 높은 기업을 중심으로 투자해주세요.",
        },
        daily_performances: [
          { date: "2026-07-01", cumulative_return_percent: 0 },
          { date: "2026-07-15", cumulative_return_percent: 1.4 },
          { date: "2026-07-31", cumulative_return_percent: 3.1 },
        ],
      },
      {
        participant_id: 12,
        account_id: 109,
        participant_type: "ai",
        display_name: "AI 2",
        final_asset_value: 3_174_000,
        final_return_percent: 5.8,
        rank: 1,
        executed_trade_count: 7,
        strategy: {
          risk_level: 1,
          preferred_themes: ["금융"],
          excluded_themes: ["바이오"],
          additional_request: "",
        },
        daily_performances: [
          { date: "2026-07-01", cumulative_return_percent: 0 },
          { date: "2026-07-15", cumulative_return_percent: 2.6 },
          { date: "2026-07-31", cumulative_return_percent: 5.8 },
        ],
      },
      {
        participant_id: 13,
        account_id: 110,
        participant_type: "ai",
        display_name: "AI 3",
        final_asset_value: 2_976_000,
        final_return_percent: -0.8,
        rank: 3,
        executed_trade_count: 12,
        strategy: {
          risk_level: 3,
          preferred_themes: ["자동차", "식품"],
          excluded_themes: [],
          additional_request: "여러 업종에 분산해서 투자해주세요.",
        },
        daily_performances: [
          { date: "2026-07-01", cumulative_return_percent: 0 },
          { date: "2026-07-15", cumulative_return_percent: -0.3 },
          { date: "2026-07-31", cumulative_return_percent: -0.8 },
        ],
      },
    ],
  },
  7: {
    competition_id: 7,
    competition_name: "동률 테스트",
    competition_type: "user_vs_ai",
    state: "completed",
    start_date: "2026-03-01",
    end_date: "2026-03-31",
    d_day: null,
    winner: "나, AI",
    winner_participant_ids: [15, 16],
    participants: [
      {
        participant_id: 15,
        account_id: 112,
        participant_type: "user",
        display_name: "나",
        final_asset_value: 3_000_000,
        final_return_percent: 0,
        rank: 1,
        executed_trade_count: 0,
        strategy: null,
        daily_performances: [
          { date: "2026-03-01", cumulative_return_percent: 0 },
          { date: "2026-03-15", cumulative_return_percent: 0 },
          { date: "2026-03-31", cumulative_return_percent: 0 },
        ],
      },
      {
        participant_id: 16,
        account_id: 113,
        participant_type: "ai",
        display_name: "AI",
        final_asset_value: 3_000_000,
        final_return_percent: 0,
        rank: 1,
        executed_trade_count: 0,
        strategy: null,
        daily_performances: [
          { date: "2026-03-01", cumulative_return_percent: 0 },
          { date: "2026-03-15", cumulative_return_percent: 0 },
          { date: "2026-03-31", cumulative_return_percent: 0 },
        ],
      },
    ],
  },
  8: {
    competition_id: 8,
    competition_name: "AI 동률 테스트",
    competition_type: "ai_vs_ai",
    state: "completed",
    start_date: "2026-02-01",
    end_date: "2026-02-28",
    d_day: null,
    winner: "AI 1, AI 2",
    winner_participant_ids: [17, 18],
    participants: [
      {
        participant_id: 17,
        account_id: 114,
        participant_type: "ai",
        display_name: "AI 1",
        final_asset_value: 3_099_000,
        final_return_percent: 3.3,
        rank: 1,
        executed_trade_count: 2,
        strategy: {
          risk_level: 4,
          preferred_themes: ["반도체"],
          excluded_themes: [],
          additional_request: "",
        },
        daily_performances: [
          { date: "2026-02-01", cumulative_return_percent: 0 },
          { date: "2026-02-14", cumulative_return_percent: 1.5 },
          { date: "2026-02-28", cumulative_return_percent: 3.3 },
        ],
      },
      {
        participant_id: 18,
        account_id: 115,
        participant_type: "ai",
        display_name: "AI 2",
        final_asset_value: 3_099_000,
        final_return_percent: 3.3,
        rank: 1,
        executed_trade_count: 1,
        strategy: {
          risk_level: 2,
          preferred_themes: ["금융"],
          excluded_themes: [],
          additional_request: "",
        },
        daily_performances: [
          { date: "2026-02-01", cumulative_return_percent: 0 },
          { date: "2026-02-14", cumulative_return_percent: 0.8 },
          { date: "2026-02-28", cumulative_return_percent: 3.3 },
        ],
      },
    ],
  },
};

const DEMO_COMPETITION_REPORTS: Record<number, CompetitionReportResponse> = {
  2: {
    competition_id: 2,
    competition_name: "5월 첫 대결",
    start_date: "2026-05-01",
    end_date: "2026-05-31",
    report_state: "completed",
    market_analyses: [
      {
        analysis_id: 201,
        date: "2026-05-25",
        title: "반도체 업황 반등 신호, 메모리 가격 상승세 전환",
        content:
          "메모리 반도체 가격이 바닥을 다지고 상승세로 전환했다는 분석이 나왔다. 주요 증권사들은 하반기 실적 개선을 전망했다.",
      },
      {
        analysis_id: 202,
        date: "2026-05-18",
        title: "2차전지 소재주, 공급 과잉 우려로 조정",
        content:
          "2차전지 소재 업종이 공급 과잉 우려로 단기 조정을 받았다. 다만 중장기 수요 전망은 여전히 긍정적이라는 평가다.",
      },
    ],
    judgment_summaries: [
      {
        title: "금리 전망",
        content:
          "5월 기준금리가 동결되면서 시장의 금리 인하 기대가 다소 늦춰졌습니다. 이는 성장주보다 실적 기반 종목에 유리한 환경을 만들었습니다.",
      },
      {
        title: "업종 로테이션",
        content:
          "반도체·2차전지 중심의 순환매 장세가 이어지며, 업황 반등 신호가 뚜렷한 종목 위주로 비중을 조정했습니다.",
      },
    ],
  },
  3: {
    competition_id: 3,
    competition_name: "4월 연습 대결",
    start_date: "2026-04-01",
    end_date: "2026-04-30",
    report_state: "completed",
    market_analyses: [
      {
        analysis_id: 301,
        date: "2026-04-20",
        title: "플랫폼 업종, 광고 매출 둔화 우려로 약세",
        content:
          "주요 플랫폼 기업들의 1분기 광고 매출 증가율이 둔화되며 관련 종목이 약세를 보였다.",
      },
    ],
    judgment_summaries: [
      {
        title: "소비 심리",
        content:
          "4월 소비자심리지수가 전월 대비 하락하며 소비 관련 업종 전반에 보수적으로 접근했습니다.",
      },
    ],
  },
};

const DEMO_EXECUTIONS: Record<number, CompetitionExecution[]> = {
  5: [
    {
      order_id: 1001,
      stock_code: "000660",
      stock_name: "SK하이닉스",
      order_side: "sell",
      executed_at: "2026-09-03T14:20:00+09:00",
      execution_quantity: 2,
      execution_amount: 392_000,
      realized_profit_amount: 18_400,
      realized_return_percent: 4.9,
    },
    {
      order_id: 1002,
      stock_code: "005930",
      stock_name: "삼성전자",
      order_side: "buy",
      executed_at: "2026-08-20T10:05:00+09:00",
      execution_quantity: 12,
      execution_amount: 858_000,
      realized_profit_amount: null,
      realized_return_percent: null,
    },
  ],
  6: [
    {
      order_id: 2001,
      stock_code: "035720",
      stock_name: "카카오",
      order_side: "sell",
      executed_at: "2026-08-25T09:40:00+09:00",
      execution_quantity: 120,
      execution_amount: 4_860_000,
      realized_profit_amount: 102_000,
      realized_return_percent: 2.1,
    },
    {
      order_id: 2002,
      stock_code: "035720",
      stock_name: "카카오",
      order_side: "buy",
      executed_at: "2026-08-24T10:12:00+09:00",
      execution_quantity: 30,
      execution_amount: 1_245_000,
      realized_profit_amount: null,
      realized_return_percent: null,
    },
    {
      order_id: 2003,
      stock_code: "035720",
      stock_name: "카카오",
      order_side: "buy",
      executed_at: "2026-08-23T10:03:00+09:00",
      execution_quantity: 30,
      execution_amount: 1_230_000,
      realized_profit_amount: null,
      realized_return_percent: null,
    },
  ],
  7: [
    {
      order_id: 3001,
      stock_code: "035420",
      stock_name: "NAVER",
      order_side: "sell",
      executed_at: "2026-04-25T13:10:00+09:00",
      execution_quantity: 3,
      execution_amount: 664_500,
      realized_profit_amount: -6_000,
      realized_return_percent: -0.9,
    },
    {
      order_id: 3002,
      stock_code: "035420",
      stock_name: "NAVER",
      order_side: "buy",
      executed_at: "2026-04-10T10:30:00+09:00",
      execution_quantity: 3,
      execution_amount: 670_500,
      realized_profit_amount: null,
      realized_return_percent: null,
    },
  ],
  8: [
    {
      order_id: 4001,
      stock_code: "005380",
      stock_name: "현대차",
      order_side: "buy",
      executed_at: "2026-04-12T09:50:00+09:00",
      execution_quantity: 5,
      execution_amount: 1_225_000,
      realized_profit_amount: null,
      realized_return_percent: null,
    },
  ],
  106: [
    {
      order_id: 5001,
      stock_code: "000660",
      stock_name: "SK하이닉스",
      order_side: "buy",
      executed_at: "2026-11-04T10:15:00+09:00",
      execution_quantity: 3,
      execution_amount: 540_000,
      realized_profit_amount: null,
      realized_return_percent: null,
    },
  ],
  108: [
    {
      order_id: 6001,
      stock_code: "005930",
      stock_name: "삼성전자",
      order_side: "buy",
      executed_at: "2026-07-26T10:12:00+09:00",
      execution_quantity: 4,
      execution_amount: 284_000,
      realized_profit_amount: null,
      realized_return_percent: null,
    },
  ],
  109: [
    {
      order_id: 6002,
      stock_code: "035720",
      stock_name: "카카오",
      order_side: "sell",
      executed_at: "2026-07-26T09:41:00+09:00",
      execution_quantity: 10,
      execution_amount: 420_000,
      realized_profit_amount: 18_000,
      realized_return_percent: 4.5,
    },
  ],
  114: [
    {
      order_id: 7001,
      stock_code: "000660",
      stock_name: "SK하이닉스",
      order_side: "buy",
      executed_at: "2026-02-10T10:20:00+09:00",
      execution_quantity: 2,
      execution_amount: 360_000,
      realized_profit_amount: null,
      realized_return_percent: null,
    },
  ],
  115: [
    {
      order_id: 7002,
      stock_code: "005930",
      stock_name: "삼성전자",
      order_side: "buy",
      executed_at: "2026-02-10T10:05:00+09:00",
      execution_quantity: 5,
      execution_amount: 355_000,
      realized_profit_amount: null,
      realized_return_percent: null,
    },
  ],
};

export const duelHandlers: HttpHandler[] = [
  http.get("*/api/v2/users/me/competitions", async ({ request }) => {
    const url = new URL(request.url);
    const state = url.searchParams.get("state");
    const limit = Number(url.searchParams.get("limit") ?? "10");
    const cursor = url.searchParams.get("cursor");

    const filtered = DEMO_COMPETITIONS.filter(
      (competition) => !state || competition.state === state,
    );
    const startIndex = cursor
      ? filtered.findIndex(
          (competition) => String(competition.competition_id) === cursor,
        ) + 1
      : 0;
    const page = filtered.slice(startIndex, startIndex + limit);
    const hasNext = startIndex + limit < filtered.length;

    return HttpResponse.json<CompetitionsResponse>({
      ongoing_competition_count: DEMO_COMPETITIONS.filter(
        (competition) => competition.state === "in_progress",
      ).length,
      pagination: {
        limit,
        has_next: hasNext,
        next_cursor: hasNext
          ? String(page[page.length - 1].competition_id)
          : null,
      },
      competitions: page,
    });
  }),

  http.get(
    "*/api/v3/users/me/competitions/name-availability",
    async ({ request }) => {
      const url = new URL(request.url);
      const competitionName = url.searchParams.get("competition_name") ?? "";

      const available = !DEMO_COMPETITIONS.some(
        (competition) => competition.competition_name === competitionName,
      );

      return HttpResponse.json<CompetitionNameAvailabilityResponse>({
        competition_name: competitionName,
        available,
      });
    },
  ),

  http.post("*/api/v2/users/me/competitions", async ({ request }) => {
    const body = (await request.json()) as CreateCompetitionRequest;

    if (!body.competition_name || body.competition_name.length < 1) {
      return HttpResponse.json(
        { code: "INVALID_REQUEST", message: "대결 이름을 입력해 주세요" },
        { status: 400 },
      );
    }

    const isDuplicateName = DEMO_COMPETITIONS.some(
      (competition) => competition.competition_name === body.competition_name,
    );
    if (isDuplicateName) {
      return HttpResponse.json(
        { code: "DUPLICATE_NAME", message: "이미 사용 중인 대결 이름이에요" },
        { status: 409 },
      );
    }

    if (
      body.initial_capital < 1_000_000 ||
      body.initial_capital > 100_000_000
    ) {
      return HttpResponse.json(
        {
          code: "INVALID_REQUEST",
          message: "대결 자금은 100만원 이상 1억원 이하로 입력해 주세요",
        },
        { status: 400 },
      );
    }

    if (
      !body.start_date ||
      !body.end_date ||
      body.start_date >= body.end_date
    ) {
      return HttpResponse.json(
        { code: "INVALID_REQUEST", message: "대결 기간이 올바르지 않습니다" },
        { status: 400 },
      );
    }

    const dDay = Math.round(
      (new Date(body.end_date).getTime() -
        new Date(body.start_date).getTime()) /
        (1000 * 60 * 60 * 24),
    );

    const competitionId =
      Math.max(
        ...DEMO_COMPETITIONS.map((competition) => competition.competition_id),
      ) + 1;

    DEMO_COMPETITIONS.push({
      competition_id: competitionId,
      state: "in_progress",
      competition_name: body.competition_name,
      competition_type: body.competition_type,
      start_date: body.start_date,
      end_date: body.end_date,
      d_day: dDay,
      cumulative_return_percent: 0,
      winner: null,
    });

    addDemoAccount({
      account_id: 100 + competitionId,
      account_name: body.competition_name,
      is_duel_account: true,
      cash_balance: body.initial_capital,
      total_assets: body.initial_capital,
      return_percent: 0,
    });

    return HttpResponse.json<CreateCompetitionResponse>(
      {
        message: "success",
        competition_id: competitionId,
        state: "in_progress",
      },
      { status: 201 },
    );
  }),

  http.post("*/api/v2/users/me/competitions/:id/cancel", async ({ params }) => {
    const competition = DEMO_COMPETITIONS.find(
      (item) => item.competition_id === Number(params.id),
    );
    if (!competition) {
      return HttpResponse.json(
        { code: "NOT_FOUND", message: "찾을 수 없습니다" },
        { status: 404 },
      );
    }
    if (competition.state !== "ready" && competition.state !== "in_progress") {
      return HttpResponse.json(
        {
          code: "INVALID_STATE",
          message: "시작 대기 또는 진행 중인 대결만 삭제할 수 있어요",
        },
        { status: 409 },
      );
    }

    competition.state = "cancelled";

    return HttpResponse.json<CancelCompetitionResponse>({
      competition_id: competition.competition_id,
      state: "cancelled",
    });
  }),

  http.get("*/api/v2/users/me/competitions/:id", async ({ params }) => {
    const detail = DEMO_COMPETITION_DETAILS[Number(params.id)];
    if (!detail) {
      return HttpResponse.json(
        { code: "NOT_FOUND", message: "찾을 수 없습니다" },
        { status: 404 },
      );
    }
    return HttpResponse.json<CompetitionDetailResponse>(detail);
  }),

  http.get("*/api/v2/users/me/competitions/:id/result", async ({ params }) => {
    const competition = DEMO_COMPETITIONS.find(
      (item) => item.competition_id === Number(params.id),
    );
    if (competition && competition.state !== "completed") {
      return HttpResponse.json(
        {
          code: "COMPETITION_NOT_COMPLETED",
          message: "아직 완료되지 않은 대결입니다.",
        },
        { status: 409 },
      );
    }
    const result = DEMO_COMPETITION_RESULTS[Number(params.id)];
    if (!result) {
      return HttpResponse.json(
        { code: "NOT_FOUND", message: "찾을 수 없습니다" },
        { status: 404 },
      );
    }
    return HttpResponse.json<CompetitionResultResponse>(result);
  }),

  http.get("*/api/v2/users/me/competitions/:id/report", async ({ params }) => {
    const report = DEMO_COMPETITION_REPORTS[Number(params.id)];
    if (!report) {
      return HttpResponse.json(
        { code: "NOT_FOUND", message: "찾을 수 없습니다" },
        { status: 404 },
      );
    }
    return HttpResponse.json<CompetitionReportResponse>(report);
  }),

  http.get(
    "*/api/v2/accounts/:accountId/executions",
    async ({ params, request }) => {
      const accountId = Number(params.accountId);
      const url = new URL(request.url);
      const orderSide = url.searchParams.get("order_side");
      const limit = Number(url.searchParams.get("limit") ?? "10");
      const cursor = url.searchParams.get("cursor");

      const filtered = (DEMO_EXECUTIONS[accountId] ?? []).filter(
        (execution) => !orderSide || execution.order_side === orderSide,
      );
      const startIndex = cursor
        ? filtered.findIndex(
            (execution) => String(execution.order_id) === cursor,
          ) + 1
        : 0;
      const page = filtered.slice(startIndex, startIndex + limit);
      const hasNext = startIndex + limit < filtered.length;

      return HttpResponse.json<CompetitionExecutionsResponse>({
        account_id: accountId,
        pagination: {
          limit,
          has_next: hasNext,
          next_cursor: hasNext ? String(page[page.length - 1].order_id) : null,
        },
        executions: page,
      });
    },
  ),
];
