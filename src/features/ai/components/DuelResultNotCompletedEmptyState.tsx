import TrophyHappyIcon from "@/assets/icons/stockspoon/trophy-happy.svg";
import { EmptyState } from "@/shared/components/EmptyState";
import { EmptyStateCard } from "@/shared/components/EmptyStateCard";
import { Header, HeaderBackButton } from "@/shared/components/Header";

interface DuelResultNotCompletedEmptyStateProps {
  onViewDetail: () => void;
}

export function DuelResultNotCompletedEmptyState({
  onViewDetail,
}: DuelResultNotCompletedEmptyStateProps) {
  return (
    <div className="pt-screen-top flex h-full flex-col">
      <Header
        className="px-5 py-3"
        title="대결 결과"
        left={<HeaderBackButton fallbackHref="/duel" />}
      />
      <EmptyStateCard className="mx-5 mt-4 mb-5 px-5 break-keep">
        <EmptyState
          icon={TrophyHappyIcon}
          textClassName="gap-2"
          message="아직 완료되지 않은 대결이에요"
          description="대결 상세에서 현재 상태를 확인해 주세요"
          actionLabel="대결 상세 보기"
          onAction={onViewDetail}
        />
      </EmptyStateCard>
    </div>
  );
}
