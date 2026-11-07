import TrophyHappyIcon from "@/assets/icons/stockspoon/trophy-happy.svg";
import { EmptyState } from "@/shared/components/EmptyState";
import { EmptyStateCard } from "@/shared/components/EmptyStateCard";
import { Header, HeaderBackButton } from "@/shared/components/Header";

export function DuelReadyEmptyState() {
  return (
    <div className="pt-screen-top flex h-full flex-col">
      <Header
        className="px-5 py-3"
        title="대결 시작 대기"
        left={<HeaderBackButton fallbackHref="/duel" />}
      />
      <EmptyStateCard className="mx-5 mt-4 mb-5 px-5 break-keep whitespace-pre-line">
        <EmptyState
          icon={TrophyHappyIcon}
          textClassName="gap-2"
          message="장이 마감된 후 생성한 대결이에요"
          description={
            "다음 장이 열리면 대결이 시작돼요\n진행 상황은 이 화면에서 확인할 수 있어요"
          }
        />
      </EmptyStateCard>
    </div>
  );
}
