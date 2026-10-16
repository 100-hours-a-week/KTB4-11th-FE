import { notFound } from "next/navigation";
import { StockTradeContainer } from "@/screens/stock/StockTradeContainer";

interface StockTradePageProps {
  params: Promise<{ code: string; side: string }>;
}

export default async function StockTradePage({ params }: StockTradePageProps) {
  const { code, side } = await params;
  if (side !== "buy" && side !== "sell") notFound();
  return (
    <StockTradeContainer key={`${code}-${side}`} code={code} side={side} />
  );
}
