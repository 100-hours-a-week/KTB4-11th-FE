import { AiExecutionResult } from "@/features/ai/components/AiExecutionResult";
import { FromBuyToSell } from "@/features/ai/components/FromBuyToSell";
import { AiOneLineJudgmentCard } from "@/features/ai/components/AiOneLineJudgmentCard";
import { AiReasoningTitle } from "@/features/ai/components/AiReasoningTitle";
import type { AiSellReasoning } from "@/features/ai/types/aiTradeReasoning";
import CartIcon from "@/assets/icons/fill/cart.svg";
import FlameIcon from "@/assets/icons/fill/flame.svg";
import HandCoinsIcon from "@/assets/icons/fill/hand-coins.svg";
import TrendIcon from "@/assets/icons/fill/trend.svg";
import { Header, HeaderBackButton } from "@/shared/components/Header";

const MOCK_REASONING: AiSellReasoning = {
  stockName: "SK하이닉스",
  tradeDate: "2026.09.03 14:20",
  holdingDays: 14,
  oneLineJudgment: "목표 수익률에 도달하고 상승 흐름이 약해져 매도했어요.",
  summary: [
    { label: "매수가 → 매도가", value: "186,600 → 196,000원" },
    { label: "실현손익", value: "+18,400원 · +4.9%" },
    { label: "목표 수익률 도달", value: "도달 (+4.5% 기준)" },
    { label: "손실 제한", value: "발동하지 않음" },
  ],
  fromBuyToSell: [
    {
      label: "매수 당시 판단",
      value: "업종 반등 초기로 보고 2주 매수했어요",
      icon: CartIcon,
    },
    {
      label: "보유 중 변화",
      value: "8/29 상승 유지, 9/2부터 거래량이 줄었어요",
      icon: TrendIcon,
    },
    {
      label: "매도 판단",
      value: "매수 근거였던 상승 흐름이 유지되지 않아 정리했어요",
      icon: HandCoinsIcon,
    },
    {
      label: "처음 예상과 결과",
      value: "예상 3~5% · 실제 +4.9%",
      icon: FlameIcon,
    },
  ],
};

export function AiSellReasoningContainer() {
  return (
    <div className="pt-safe-top flex h-full flex-col">
      <Header
        title="매도 판단 근거"
        className="px-5 py-3"
        left={<HeaderBackButton />}
      />

      <div className="flex flex-1 flex-col gap-6 px-5 pt-4 pb-8">
        <div className="flex flex-col gap-4">
          <AiReasoningTitle
            title={`${MOCK_REASONING.stockName}를 매도한 이유`}
            meta={`${MOCK_REASONING.tradeDate} · 보유 ${MOCK_REASONING.holdingDays}일`}
          />
          <AiOneLineJudgmentCard
            oneLineJudgment={MOCK_REASONING.oneLineJudgment}
          />
        </div>

        <div className="flex flex-col gap-2">
          <span className="body-1-bold">실행 결과</span>
          <AiExecutionResult items={MOCK_REASONING.summary} />
        </div>

        <div className="flex flex-col gap-2">
          <span className="body-1-bold">매수부터 매도까지</span>
          <FromBuyToSell items={MOCK_REASONING.fromBuyToSell} />
        </div>
      </div>
    </div>
  );
}
