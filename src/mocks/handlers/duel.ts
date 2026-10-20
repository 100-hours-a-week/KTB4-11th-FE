import { http, HttpResponse, type HttpHandler } from "msw";
import type {
  CompetitionApiItem,
  CompetitionDetailResponse,
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
];

const DEMO_COMPETITION_DETAILS: Record<number, CompetitionDetailResponse> = {
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
      },
      {
        participant_id: 2,
        account_id: 4,
        participant_type: "ai",
        display_name: "AI",
      },
    ],
    cumulative_return_percent: 6.4,
    daily_performances: [
      { date: "2026-08-14", cumulative_return_percent: 0 },
      { date: "2026-08-19", cumulative_return_percent: 1.8 },
      { date: "2026-08-24", cumulative_return_percent: 3.4 },
      { date: "2026-08-26", cumulative_return_percent: 6.4 },
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
    participants: [
      {
        participant_id: 1,
        account_id: 5,
        participant_type: "user",
        display_name: "나",
      },
      {
        participant_id: 2,
        account_id: 6,
        participant_type: "ai",
        display_name: "AI",
      },
    ],
    winner: "user",
    user_final_return_percent: 3.2,
    ai_final_return_percent: 1.5,
    daily_performances: [
      {
        date: "2026-05-01",
        user_cumulative_return_percent: 0,
        ai_cumulative_return_percent: 0,
      },
      {
        date: "2026-05-15",
        user_cumulative_return_percent: 1.9,
        ai_cumulative_return_percent: 0.8,
      },
      {
        date: "2026-05-31",
        user_cumulative_return_percent: 3.2,
        ai_cumulative_return_percent: 1.5,
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
    participants: [
      {
        participant_id: 1,
        account_id: 7,
        participant_type: "user",
        display_name: "나",
      },
      {
        participant_id: 2,
        account_id: 8,
        participant_type: "ai",
        display_name: "AI",
      },
    ],
    winner: "ai",
    user_final_return_percent: -1.5,
    ai_final_return_percent: 2.3,
    daily_performances: [
      {
        date: "2026-04-01",
        user_cumulative_return_percent: 0,
        ai_cumulative_return_percent: 0,
      },
      {
        date: "2026-04-15",
        user_cumulative_return_percent: -0.8,
        ai_cumulative_return_percent: 1.1,
      },
      {
        date: "2026-04-30",
        user_cumulative_return_percent: -1.5,
        ai_cumulative_return_percent: 2.3,
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
    state: "ready",
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
    state: "ready",
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
      execution_id: 101,
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
      execution_id: 102,
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
      execution_id: 201,
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
      execution_id: 202,
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
      execution_id: 203,
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
      execution_id: 301,
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
      execution_id: 302,
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
      execution_id: 401,
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
};

function paginate<T>(items: T[], page: number, limit: number) {
  const totalElements = items.length;
  const totalPages = Math.ceil(totalElements / limit) || 1;
  const start = (page - 1) * limit;

  return {
    items: items.slice(start, start + limit),
    pagination: {
      page,
      limit,
      total_elements: totalElements,
      total_pages: totalPages,
      has_next: page < totalPages,
    },
  };
}

export const duelHandlers: HttpHandler[] = [
  http.get("*/api/v2/users/me/competitions", async ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? "1");
    const limit = Number(url.searchParams.get("limit") ?? "10");
    const { items, pagination } = paginate(DEMO_COMPETITIONS, page, limit);

    return HttpResponse.json<CompetitionsResponse>({
      ongoing_competition_count: DEMO_COMPETITIONS.filter(
        (competition) => competition.state === "in_progress",
      ).length,
      pagination,
      competitions: items,
    });
  }),

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

    const competitionId = DEMO_COMPETITIONS.length + 1;

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
        d_day: dDay,
      },
      { status: 201 },
    );
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
      const url = new URL(request.url);
      const page = Number(url.searchParams.get("page") ?? "1");
      const limit = Number(url.searchParams.get("limit") ?? "10");
      const allExecutions = DEMO_EXECUTIONS[Number(params.accountId)] ?? [];
      const { items, pagination } = paginate(allExecutions, page, limit);

      return HttpResponse.json<CompetitionExecutionsResponse>({
        account_id: Number(params.accountId),
        pagination,
        executions: items,
      });
    },
  ),
];
