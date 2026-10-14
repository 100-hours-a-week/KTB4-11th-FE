import { apiClient } from "@/shared/lib/axios";
import type {
  CreateCompetitionRequest,
  CreateCompetitionResponse,
} from "@/features/ai/types/duel";

export async function postCompetition(payload: CreateCompetitionRequest) {
  const { data: createCompetitionResponse } =
    await apiClient.post<CreateCompetitionResponse>(
      "/api/v1/users/me/competitions",
      payload,
    );

  return createCompetitionResponse;
}
