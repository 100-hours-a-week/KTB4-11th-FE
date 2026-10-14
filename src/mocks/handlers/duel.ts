import { http, HttpResponse, type HttpHandler } from "msw";
import type {
  CompetitionApiItem,
  CompetitionDetailResponse,
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
];
