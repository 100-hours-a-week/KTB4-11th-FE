import { marketApiClient } from "@/shared/lib/marketApiClient";
import type {
  RankingApiResponse,
  RankingApiType,
} from "@/features/stock/types/ranking";

interface GetRankingParams {
  type: RankingApiType;
  limit: number;
  signal?: AbortSignal;
}

export async function getRanking({ type, limit, signal }: GetRankingParams) {
  const { data } = await marketApiClient.get<RankingApiResponse>(
    `/rankings/${type}`,
    { params: { limit }, signal },
  );
  return data;
}
