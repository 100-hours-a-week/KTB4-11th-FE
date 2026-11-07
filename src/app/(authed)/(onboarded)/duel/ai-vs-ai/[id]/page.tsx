import { DuelDetailAiVsAiContainer } from "@/screens/duel/DuelDetailAiVsAiContainer";

interface DuelDetailAiVsAiPageProps {
  params: Promise<{ id: string }>;
}

export default async function DuelDetailAiVsAiPage({
  params,
}: DuelDetailAiVsAiPageProps) {
  const { id } = await params;

  return <DuelDetailAiVsAiContainer id={id} />;
}
