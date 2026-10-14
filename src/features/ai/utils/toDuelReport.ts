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
  report: CompetitionReportResponse,
): DuelReportData {
  return {
    name: report.competition_name,
    startDate: formatFullDotDate(report.start_date),
    endDate: formatShortDotDate(report.end_date),
    marketEvents: report.market_analyses.map((analysis) => ({
      date: formatEventDate(analysis.date),
      title: analysis.title,
      body: analysis.content,
    })),
    judgmentClues: report.judgment_summaries.map((summary) => ({
      title: summary.title,
      description: summary.content,
    })),
  };
}
