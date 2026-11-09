import { DuelResultUserVsAiContainer } from "@/screens/duel/DuelResultUserVsAiContainer";

interface DuelResultPageProps {
  params: Promise<{ id: string }>;
}

export default async function DuelResultPage({ params }: DuelResultPageProps) {
  const { id } = await params;
  return <DuelResultUserVsAiContainer id={id} />;
}
