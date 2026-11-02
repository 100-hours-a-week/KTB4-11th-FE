import { InvestmentTendencySelector } from "@/features/ai/components/InvestmentTendencySelector";
import type { AiVsAiAgentSummary } from "@/features/ai/types/aiVsAiDuelDetail";

function ThemeChips({ themes }: { themes: string[] }) {
  if (themes.length === 0) {
    return (
      <span className="caption-1-regular text-text-neutral-secondary">
        설정 없음
      </span>
    );
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {themes.map((theme) => (
        <span
          key={theme}
          className="bg-bg-layer-default border-border-neutral-muted text-text-neutral-primary caption-1-semibold rounded-full border px-2.5 py-1"
        >
          {theme}
        </span>
      ))}
    </div>
  );
}

export function AiVsAiStrategyPanel({
  agent,
  open,
  id,
}: {
  agent: AiVsAiAgentSummary;
  open: boolean;
  id: string;
}) {
  return (
    <div
      id={id}
      role="region"
      aria-label={`${agent.agentLabel} 투자 설정`}
      aria-hidden={!open}
      inert={!open}
      className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out motion-reduce:transition-none ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
    >
      <div className="min-h-0 overflow-hidden">
        <div className="bg-sky-blue-50/40 mt-3 rounded-xl p-4">
          <div
            key={agent.agentLabel}
            className="animate-in fade-in duration-200 motion-reduce:animate-none"
          >
            <dl className="flex flex-col gap-5">
              <div className="grid grid-cols-[64px_minmax(0,1fr)] items-start gap-3">
                <dt className="caption-1-semibold text-text-neutral-secondary py-1">
                  투자 성향
                </dt>
                <dd className="min-w-0">
                  <InvestmentTendencySelector
                    value={agent.investmentTendency}
                    readOnly
                    size="sm"
                    showLabel={false}
                  />
                </dd>
              </div>
              {[
                { label: "관심 테마", themes: agent.interestThemes },
                { label: "제외 테마", themes: agent.excludeThemes },
              ].map(({ label, themes }) => (
                <div
                  key={label}
                  className="grid grid-cols-[64px_minmax(0,1fr)] items-start gap-3"
                >
                  <dt className="caption-1-semibold text-text-neutral-secondary py-1">
                    {label}
                  </dt>
                  <dd>
                    <ThemeChips themes={themes} />
                  </dd>
                </div>
              ))}
              <div className="grid grid-cols-[64px_minmax(0,1fr)] gap-3">
                <dt className="caption-1-semibold text-text-neutral-secondary">
                  추가 요청
                </dt>
                <dd className="caption-1-regular text-text-neutral-primary leading-relaxed break-words whitespace-pre-wrap">
                  {agent.additionalRequest || (
                    <span className="text-text-neutral-secondary">
                      설정 없음
                    </span>
                  )}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
