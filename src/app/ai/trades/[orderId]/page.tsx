import { AiReasoningContainer } from "@/screens/ai/reasoning/AiReasoningContainer";

interface AiReasoningPageProps {
  params: Promise<{ orderId: string }>;
}

export default async function AiReasoningPage({
  params,
}: AiReasoningPageProps) {
  const { orderId } = await params;

  return <AiReasoningContainer orderId={Number(orderId)} />;
}
