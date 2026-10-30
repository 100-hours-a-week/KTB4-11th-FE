import { DuelReportContainer } from "@/screens/duel/DuelReportContainer";

interface DuelReportPageProps {
  params: Promise<{ id: string }>;
}

export default async function DuelReportPage({ params }: DuelReportPageProps) {
  const { id } = await params;
  return <DuelReportContainer id={id} />;
}
