import type {
  CompetitionReportResponse,
  DuelReportData,
} from "@/features/ai/types/duel";
import {
  formatEventDate,
  formatFullDotDate,
  formatShortDotDate,
} from "@/features/ai/utils/duelDateFormat";

export function toDuelReportData(
  response: CompetitionReportResponse,
  agentLabel?: string,
): DuelReportData {
  const report =
    (agentLabel
      ? response.reports.find((item) => item.display_name === agentLabel)
      : undefined) ?? response.reports[0];

  return {
    name: response.competition_name ?? "",
    startDate: response.start_date
      ? formatFullDotDate(response.start_date)
      : "",
    endDate: response.end_date ? formatShortDotDate(response.end_date) : "",
    isReady: report?.report_state === "completed",
    marketEvents: (report?.market_analyses ?? []).map((analysis) => ({
      date: formatEventDate(analysis.date),
      title: analysis.title,
      body: analysis.content,
    })),
    judgmentClues: (report?.judgment_summaries ?? []).map((summary) => ({
      title: summary.title,
      description: summary.content,
    })),
  };
}
