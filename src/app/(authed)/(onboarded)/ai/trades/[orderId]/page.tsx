import { notFound } from "next/navigation";
import { parseAiReasoningParams } from "@/features/ai/utils/parseAiReasoningParams";
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
  const reasoningParams = parseAiReasoningParams(orderId, accountId);
  if (!reasoningParams) notFound();

  return <AiReasoningContainer {...reasoningParams} />;
}
