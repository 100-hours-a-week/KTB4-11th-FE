export const INVESTMENT_TENDENCIES = [
  "성장형",
  "성장추구형",
  "위험중립형",
  "안정추구형",
  "안정형",
] as const;
export type InvestmentTendency = (typeof INVESTMENT_TENDENCIES)[number];

export interface AiAgentStrategy {
  investmentTendency: InvestmentTendency;
  interestThemes: string[];
  excludeThemes: string[];
  additionalRequest: string;
}

export function createEmptyAiAgentStrategy(): AiAgentStrategy {
  return {
    investmentTendency: "위험중립형",
    interestThemes: [],
    excludeThemes: [],
    additionalRequest: "",
  };
}

export type AiAgentRiskLevel = 1 | 2 | 3 | 4 | 5;

export function toRiskLevel(tendency: InvestmentTendency): AiAgentRiskLevel {
  return (INVESTMENT_TENDENCIES.length -
    INVESTMENT_TENDENCIES.indexOf(tendency)) as AiAgentRiskLevel;
}

export function fromRiskLevel(riskLevel: AiAgentRiskLevel): InvestmentTendency {
  return INVESTMENT_TENDENCIES[INVESTMENT_TENDENCIES.length - riskLevel];
}
