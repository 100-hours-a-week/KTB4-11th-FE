import { DuelResultAiVsAiContainer } from "@/screens/duel/DuelResultAiVsAiContainer";

interface DuelResultAiVsAiPageProps {
  params: Promise<{ id: string }>;
}

export default async function DuelResultAiVsAiPage({
  params,
}: DuelResultAiVsAiPageProps) {
  const { id } = await params;

  return <DuelResultAiVsAiContainer id={id} />;
}
