import { DuelReportContainer } from "@/screens/duel/DuelReportContainer";

interface DuelReportPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ agent?: string | string[] }>;
}

export default async function DuelReportPage({
  params,
  searchParams,
}: DuelReportPageProps) {
  const { id } = await params;
  const { agent } = await searchParams;
  const agentLabel = Array.isArray(agent) ? agent[0] : agent;

  return <DuelReportContainer id={id} agentLabel={agentLabel} />;
}
