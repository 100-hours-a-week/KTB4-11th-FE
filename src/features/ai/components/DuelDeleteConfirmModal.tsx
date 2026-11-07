"use client";

import { toast } from "sonner";
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
import { useCancelCompetitionMutation } from "@/features/ai/hooks/useCancelCompetitionMutation";

interface DuelDeleteConfirmModalProps {
  competitionId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DuelDeleteConfirmModal({
  competitionId,
  open,
  onOpenChange,
}: DuelDeleteConfirmModalProps) {
  const { mutate, isPending } = useCancelCompetitionMutation();

  const handleDelete = () => {
    mutate(competitionId, {
      onSuccess: () => {
        onOpenChange(false);
        toast.success("대결을 삭제했어요");
      },
      onError: () => {
        toast.error("대결을 삭제하지 못했어요. 다시 시도해 주세요.");
      },
    });
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalPortal>
        <ModalContent>
          <ModalTitle>대결을 삭제할까요?</ModalTitle>
          <ModalDescription>
            삭제 후에는 대결 정보를 다시 복구할 수 없어요
          </ModalDescription>
          <ModalFooter>
            <ModalClose asChild>
              <Button className="bg-bg-neutral-tertiary text-text-neutral-secondary active:text-text-neutral-primary flex-1 active:bg-gray-50">
                취소
              </Button>
            </ModalClose>
            <Button
              className="flex-1"
              onClick={handleDelete}
              disabled={isPending}
            >
              삭제하기
            </Button>
          </ModalFooter>
        </ModalContent>
      </ModalPortal>
    </Modal>
  );
}
