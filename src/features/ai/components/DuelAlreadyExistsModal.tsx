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
}

export function DuelAlreadyExistsModal({
  open,
  onOpenChange,
  ongoingDuelId,
  ongoingDuelName,
  remainingDays,
}: DuelAlreadyExistsModalProps) {
  const router = useRouter();
  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalPortal>
        <ModalContent>
          <ModalTitle>이미 진행 중인 대결이 있어요</ModalTitle>
          <ModalDescription>
            나 vs AI 대결은 동시에 진행할 수 없어요.
            <br />
            &apos;{ongoingDuelName}&apos; 종료까지 D-{remainingDays}
          </ModalDescription>
          <ModalFooter>
            <ModalClose asChild>
              <Button className="bg-bg-neutral-tertiary text-text-neutral-secondary active:text-text-neutral-primary flex-1 active:bg-gray-50">
                닫기
              </Button>
            </ModalClose>
            {/* TODO: 해당 대결 진행 리포트 화면으로 이동 */}
            <ModalClose asChild>
              <Button
                className="flex-1"
                onClick={() => router.push(`/duel/${ongoingDuelId}`)}
              >
                진행 중 대결 보기
              </Button>
            </ModalClose>
          </ModalFooter>
        </ModalContent>
      </ModalPortal>
    </Modal>
  );
}
