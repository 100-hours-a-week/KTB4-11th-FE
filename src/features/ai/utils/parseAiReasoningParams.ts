export function parseAiReasoningParams(
  orderId: string,
  accountId: string | string[] | undefined,
): { orderId: number; accountId: number } | null {
  const parsedAccountId =
    typeof accountId === "string" ? Number(accountId) : NaN;
  const parsedOrderId = Number(orderId);

  if (
    !Number.isSafeInteger(parsedAccountId) ||
    parsedAccountId <= 0 ||
    !Number.isSafeInteger(parsedOrderId) ||
    parsedOrderId <= 0
  ) {
    return null;
  }

  return { accountId: parsedAccountId, orderId: parsedOrderId };
}
