import { AiExecutionResult } from "@/features/ai/components/AiExecutionResult";
import { JudgmentFlowAccordion } from "@/features/ai/components/JudgmentFlowAccordion";
import { AiOneLineJudgmentCard } from "@/features/ai/components/AiOneLineJudgmentCard";
import { AiReasoningTitle } from "@/features/ai/components/AiReasoningTitle";
import type { AiBuyReasoning } from "@/features/ai/types/aiTradeReasoning";
import { Header, HeaderBackButton } from "@/shared/components/Header";

const MOCK_REASONING: AiBuyReasoning = {
  stockName: "삼성전자",
  tradeDate: "2026.08.27 10:14",
  decisionCount: 1,
  executionCount: 2,
  oneLineJudgment:
    "최근 가격 상승 흐름과 거래량 증가가 함께 나타났고, 설정된 위험 범위 안에서 투자할 수 있어 매수했어요.",
  executionResult: [
    { label: "종목", value: "삼성전자 (005930)" },
    { label: "체결 가격 · 수량", value: "72,400원 · 3주" },
    { label: "총 거래 금액", value: "217,200원" },
    { label: "거래 후 비중", value: "28% (상한 30%)" },
  ],
  judgmentFlow: [
    {
      id: "investment-condition",
      title: "투자 조건 확인",
      details: [
        { label: "투자 목표", value: "안정적인 투자 경험" },
        { label: "투자 기간", value: "1개월" },
        { label: "감당 가능한 손실", value: "최대 -3%" },
        { label: "종목당 최대 비중", value: "30%" },
      ],
    },
    { id: "market-condition", title: "시장 상황 확인" },
    { id: "stock-data-analysis", title: "종목 데이터 분석" },
    { id: "risk-review", title: "위험 검토" },
    { id: "buy-decision", title: "매수 결정" },
  ],
};

export function AiBuyReasoningContainer() {
  return (
    <div className="pt-safe-top flex h-full flex-col">
      <Header
        title="매수 판단 근거"
        className="px-5 py-3"
        left={<HeaderBackButton />}
      />

      <div className="flex flex-1 flex-col gap-6 px-5 pt-4 pb-8">
        <div className="flex flex-col gap-4">
          <AiReasoningTitle
            title={`${MOCK_REASONING.stockName}를 매수한 이유`}
            meta={`${MOCK_REASONING.tradeDate} · 의사결정 ${MOCK_REASONING.decisionCount}건 · 체결 ${MOCK_REASONING.executionCount}건`}
          />
          <AiOneLineJudgmentCard
            oneLineJudgment={MOCK_REASONING.oneLineJudgment}
          />
        </div>

        <div className="flex flex-col gap-2">
          <span className="body-1-bold">실행 결과</span>
          <AiExecutionResult items={MOCK_REASONING.executionResult} />
        </div>

        <div className="flex flex-col gap-2">
          <span className="body-1-bold">판단 흐름</span>
          <JudgmentFlowAccordion steps={MOCK_REASONING.judgmentFlow} />
        </div>
      </div>
    </div>
  );
}
