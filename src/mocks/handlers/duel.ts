import { http, HttpResponse, type HttpHandler } from "msw";
import type {
  CompetitionApiItem,
  CompetitionDetailResponse,
  CompetitionReportResponse,
  CompetitionResultResponse,
  CompetitionsResponse,
  CreateCompetitionRequest,
  CreateCompetitionResponse,
} from "@/features/ai/types/duel";

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
    d_day: 24,
    remaining_days: 12,
    cumulative_return_percent: 6.4,
    daily_performances: [
      { date: "2026-08-14", cumulative_return_percent: 0 },
      { date: "2026-08-19", cumulative_return_percent: 1.8 },
      { date: "2026-08-24", cumulative_return_percent: 3.4 },
      { date: "2026-08-26", cumulative_return_percent: 6.4 },
    ],
    as_of: "2026-08-26T15:30:00+09:00",
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

export const duelHandlers: HttpHandler[] = [
  http.get("*/api/v2/users/me/competitions", async () => {
    return HttpResponse.json<CompetitionsResponse>({
      ongoing_competition_count: DEMO_COMPETITIONS.filter(
        (competition) => competition.state === "in_progress",
      ).length,
      competitions: DEMO_COMPETITIONS,
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

    return HttpResponse.json<CreateCompetitionResponse>(
      {
        message: "success",
        competition_id: DEMO_COMPETITIONS.length + 1,
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
];
