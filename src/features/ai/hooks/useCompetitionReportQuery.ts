"use client";

import { useQuery } from "@tanstack/react-query";
import { getCompetitionReport } from "@/features/ai/api/getCompetitionReport";
import { toDuelReportData } from "@/features/ai/utils/toDuelReport";

export function useCompetitionReportQuery(
  competitionId: string,
  agentLabel?: string,
) {
  return useQuery({
    queryKey: ["competition", competitionId, "report", agentLabel],
    queryFn: async () => {
      const report = await getCompetitionReport(competitionId);
      return toDuelReportData(report, agentLabel);
    },
  });
}
