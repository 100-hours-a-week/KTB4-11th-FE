import { DuelDetailContainer } from "@/screens/duel/DuelDetailContainer";

interface DuelDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function DuelDetailPage({ params }: DuelDetailPageProps) {
  const { id } = await params;

  return <DuelDetailContainer id={id} />;
}
