import { notFound } from "next/navigation";
import { AiReasoningContainer } from "@/screens/ai/reasoning/AiReasoningContainer";

interface AiReasoningPageProps {
  params: Promise<{ orderId: string }>;
  searchParams: Promise<{ accountId?: string | string[] }>;
}

export default async function AiReasoningPage({
  params,
  searchParams,
}: AiReasoningPageProps) {
  const { orderId } = await params;
  const { accountId } = await searchParams;
  const parsedAccountId =
    typeof accountId === "string" ? Number(accountId) : NaN;
  const parsedOrderId = Number(orderId);

  if (
    !Number.isSafeInteger(parsedAccountId) ||
    parsedAccountId <= 0 ||
    !Number.isSafeInteger(parsedOrderId) ||
    parsedOrderId <= 0
  ) {
    notFound();
  }

  return (
    <AiReasoningContainer accountId={parsedAccountId} orderId={parsedOrderId} />
  );
}
