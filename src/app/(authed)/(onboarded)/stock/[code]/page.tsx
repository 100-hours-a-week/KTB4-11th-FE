import { StockDetailContainer } from "@/screens/stock/StockDetailContainer";

interface StockDetailPageProps {
  params: Promise<{ code: string }>;
}

export default async function StockDetailPage({
  params,
}: StockDetailPageProps) {
  const { code } = await params;

  return <StockDetailContainer code={code} />;
}
