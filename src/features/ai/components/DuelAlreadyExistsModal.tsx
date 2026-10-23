"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/shared/components/Button";
import {
  Modal,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalPortal,
  ModalTitle,
} from "@/shared/components/Modal";

interface DuelAlreadyExistsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ongoingDuelId: string;
  ongoingDuelName: string;
  remainingDays: number;
  isReady: boolean;
}

export function DuelAlreadyExistsModal({
  open,
  onOpenChange,
  ongoingDuelId,
  ongoingDuelName,
  remainingDays,
  isReady,
}: DuelAlreadyExistsModalProps) {
  const router = useRouter();
  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalPortal>
        <ModalContent>
          <ModalTitle>
            {isReady
              ? "이미 시작 대기 중인 대결이 있어요"
              : "이미 진행 중인 대결이 있어요"}
          </ModalTitle>
          <ModalDescription>
            {isReady ? (
              <>
                &apos;{ongoingDuelName}&apos;이 종료된 후 새 대결을 만들 수
                있어요
              </>
            ) : (
              <>
                &apos;{ongoingDuelName}&apos; 종료까지 D-{remainingDays}일
                남았어요
                <br />이 대결이 종료된 후 새 대결을 만들 수 있어요
              </>
            )}
          </ModalDescription>
          <ModalFooter>
            <ModalClose asChild>
              <Button className="bg-bg-neutral-tertiary text-text-neutral-secondary active:text-text-neutral-primary flex-1 active:bg-gray-50">
                닫기
              </Button>
            </ModalClose>
            <ModalClose asChild>
              <Button
                className="flex-1"
                onClick={() => router.push(`/duel/${ongoingDuelId}`)}
              >
                대결 보기
              </Button>
            </ModalClose>
          </ModalFooter>
        </ModalContent>
      </ModalPortal>
    </Modal>
  );
}
