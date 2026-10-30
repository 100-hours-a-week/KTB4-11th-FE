import { DuelResultContainer } from "@/screens/duel/DuelResultContainer";

interface DuelResultPageProps {
  params: Promise<{ id: string }>;
}

export default async function DuelResultPage({ params }: DuelResultPageProps) {
  const { id } = await params;
  return <DuelResultContainer id={id} />;
}
