import { OnboardingCompleteContainer } from "@/screens/onboarding/complete/OnboardingCompleteContainer";

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
