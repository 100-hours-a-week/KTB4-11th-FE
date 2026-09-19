import { OnboardingCompleteContainer } from "@/features/account/components/OnboardingCompleteContainer";

interface OnboardingCompletePageProps {
  searchParams: Promise<{ amount?: string }>;
}

export default async function OnboardingCompletePage({
  searchParams,
}: OnboardingCompletePageProps) {
  const { amount } = await searchParams;

  return (
    <OnboardingCompleteContainer amount={Number(amount) || 0} isAiDelegated />
  );
}
