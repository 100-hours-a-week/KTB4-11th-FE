import { isAxiosError } from "axios";
import type { ApiErrorResponse } from "@/shared/types/apiError";

const DELETE_ACCOUNT_ERROR_MESSAGE: Record<string, string> = {
  ACCOUNT_HAS_HOLDINGS: "보유 중인 종목이 있어 삭제할 수 없어요",
  ACCOUNT_HAS_PENDING_ORDERS: "체결되지 않은 주문이 있어 삭제할 수 없어요",
  ACCOUNT_IN_ACTIVE_COMPETITION: "진행 중인 대결이 있어 삭제할 수 없어요",
};

export function getDeleteAccountErrorMessage(error: unknown) {
  if (
    !isAxiosError<ApiErrorResponse>(error) ||
    error.response?.status !== 409
  ) {
    return null;
  }

  const code = error.response?.data?.code;
  return code ? (DELETE_ACCOUNT_ERROR_MESSAGE[code] ?? null) : null;
}
