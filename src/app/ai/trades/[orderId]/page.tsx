import { AiReasoningContainer } from "@/screens/ai/reasoning/AiReasoningContainer";

export default async function AiReasoningPage({
  params,
}: PageProps<"/ai/trades/[orderId]">) {
  const { orderId } = await params;

  return <AiReasoningContainer orderId={Number(orderId)} />;
}
