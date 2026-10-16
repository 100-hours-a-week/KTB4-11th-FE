import { StockDetailContainer } from "@/screens/stock/StockDetailContainer";

interface StockDetailPageProps {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ tab?: string }>;
}

export default async function StockDetailPage({
  params,
  searchParams,
}: StockDetailPageProps) {
  const { code } = await params;

  const { tab } = await searchParams;
  return (
    <StockDetailContainer
      key={`${code}-${tab ?? "chart"}`}
      code={code}
      initialTab={tab === "holding" ? "내 주식" : "차트"}
    />
  );
}
