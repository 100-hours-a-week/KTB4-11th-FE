"use client";

import { useRouter } from "next/navigation";
import CalendarIcon from "@/assets/icons/fill/calendar.svg";
import { DuelMarketEventAccordion } from "@/features/ai/components/DuelMarketEventAccordion";
import { useCompetitionReportQuery } from "@/features/ai/hooks/useCompetitionReportQuery";
import { Header, HeaderBackButton } from "@/shared/components/Header";

interface DuelReportContainerProps {
  id: string;
}

export function DuelReportContainer({ id }: DuelReportContainerProps) {
  const router = useRouter();
  const { data: report } = useCompetitionReportQuery(id);

  if (!report) return null;

  return (
    <div className="pt-screen-top flex h-full flex-col">
      <Header
        className="px-5 py-3"
        left={<HeaderBackButton onClick={() => router.back()} />}
        title="AI 리포트"
      />

      <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-5 pt-4 pb-10">
        <div className="flex flex-col gap-1">
          <span className="heading-1-bold">{report.name}</span>
          <span className="body-2-regular text-text-neutral-secondary flex items-center gap-1">
            <CalendarIcon width={14} height={14} className="text-icon-accent" />
            {report.startDate} ~ {report.endDate}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <span className="body-1-bold">AI가 분석한 시장</span>
          <div className="bg-bg-layer-default rounded-2xl px-4">
            <DuelMarketEventAccordion items={report.marketEvents} />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="body-1-bold">AI의 판단 단서</span>
          <div className="flex flex-col gap-2">
            {report.judgmentClues.map((clue) => (
              <div
                key={clue.title}
                className="bg-bg-layer-default flex flex-col gap-1 rounded-2xl p-4"
              >
                <span className="body-2-semibold">{clue.title}</span>
                <p className="body-2-regular text-text-neutral-secondary text-justify">
                  {clue.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
