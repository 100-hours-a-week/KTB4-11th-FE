import { apiClient } from "@/shared/lib/axios";
import type {
  CreateAccountRequest,
  CreateAccountResponse,
} from "@/features/account/types/account";

export async function postOnboarding(
  payload: Pick<CreateAccountRequest, "initial_capital">,
) {
  const { data: onboardingResponse } =
    await apiClient.post<CreateAccountResponse>(
      "/api/v1/users/me/onboarding",
      payload,
    );

  return onboardingResponse;
}
