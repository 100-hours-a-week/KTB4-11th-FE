import { apiClient } from "@/shared/lib/axios";
import type {
  RankingApiResponse,
  RankingApiType,
} from "@/features/stock/types/ranking";

interface GetRankingParams {
  type: RankingApiType;
  page: number;
  size?: number;
}

export async function getRanking({ type, page, size = 20 }: GetRankingParams) {
  const { data } = await apiClient.get<RankingApiResponse>(
    "/api/v2/stocks/rankings",
    { params: { type, page, size } },
  );

  return data;
}
