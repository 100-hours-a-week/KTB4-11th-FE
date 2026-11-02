import { apiClient } from "@/shared/lib/axios";
import type {
  CreateAiCompetitionSettingsRequest,
  CreateAiCompetitionSettingsResponse,
} from "@/features/ai/types/duel";

export async function postAiCompetitionSettings(
  payload: CreateAiCompetitionSettingsRequest,
) {
  const { data: aiCompetitionSettingsResponse } =
    await apiClient.post<CreateAiCompetitionSettingsResponse>(
      "/api/v3/users/me/competitions/ai-settings",
      payload,
    );

  return aiCompetitionSettingsResponse;
}
