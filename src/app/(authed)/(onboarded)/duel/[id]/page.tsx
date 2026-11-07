import { DuelDetailUserVsAiContainer } from "@/screens/duel/DuelDetailUserVsAiContainer";

interface DuelDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function DuelDetailPage({ params }: DuelDetailPageProps) {
  const { id } = await params;

  return <DuelDetailUserVsAiContainer id={id} />;
}
