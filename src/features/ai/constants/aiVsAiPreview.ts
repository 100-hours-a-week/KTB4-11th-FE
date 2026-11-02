import type { AiVsAiDuelDetail } from "@/features/ai/types/aiVsAiDuelDetail";

export const AI_VS_AI_PREVIEW_DETAIL: AiVsAiDuelDetail = {
  name: "7월 배당주 실험",
  dDay: 20,
  agents: [
    {
      agentLabel: "AI 1",
      returnPercent: 3.1,

      investmentTendency: "성장형",
      interestThemes: ["반도체", "2차전지"],
      excludeThemes: ["게임"],
      additionalRequest:
        "장기 성장 가능성이 높은 기업을 중심으로 투자해주세요.",
    },
    {
      agentLabel: "AI 2",
      returnPercent: 1.4,

      investmentTendency: "안정형",
      interestThemes: ["금융"],
      excludeThemes: ["바이오"],
      additionalRequest: "",
    },
  ],
  trades: [
    {
      tradeId: 1,
      agentLabel: "AI 1",
      stockCode: "005930",
      stockName: "삼성전자",
      tradeSide: "매수",
      tradeDate: "8.26 10:12",
      quantity: 4,
      price: 71_000,
      hasReasoning: true,
      orderId: 1,
    },
    {
      tradeId: 2,
      agentLabel: "AI 2",
      stockCode: "035720",
      stockName: "카카오",
      tradeSide: "매도",
      tradeDate: "8.26 09:41",
      quantity: 10,
      price: 42_000,
      hasReasoning: true,
      orderId: 2,
    },
    {
      tradeId: 3,
      agentLabel: "AI 1",
      stockCode: "005380",
      stockName: "현대차",
      tradeSide: "매수",
      tradeDate: "8.25 13:02",
      quantity: 2,
      price: 215_000,
      hasReasoning: true,
      orderId: 3,
    },
  ],
};
