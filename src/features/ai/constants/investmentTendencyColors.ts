import type { InvestmentTendency } from "@/features/ai/types/aiStrategy";

export const TENDENCY_DOT_COLORS: Record<InvestmentTendency, string> = {
  성장형: "bg-red-500",
  성장추구형: "bg-orange-500",
  위험중립형: "bg-yellow-500",
  안정추구형: "bg-green-500",
  안정형: "bg-blue-500",
};
