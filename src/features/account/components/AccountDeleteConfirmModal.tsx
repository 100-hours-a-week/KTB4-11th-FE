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

interface AccountDeleteConfirmModalProps {
  accountId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AccountDeleteConfirmModal({
  open,
  onOpenChange,
}: AccountDeleteConfirmModalProps) {
  const handleDelete = () => {
    onOpenChange(false);
    toast.info("계좌 삭제는 v2에서 이용할 수 있어요");
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalPortal>
        <ModalContent>
          <ModalTitle>계좌를 삭제할까요?</ModalTitle>
          <ModalDescription>
            삭제 후에는 계좌 정보를 다시 복구할 수 없어요
          </ModalDescription>
          <ModalFooter>
            <ModalClose asChild>
              <Button className="bg-bg-neutral-tertiary text-text-neutral-secondary active:text-text-neutral-primary flex-1 active:bg-gray-50">
                취소
              </Button>
            </ModalClose>
            <Button className="flex-1" onClick={handleDelete}>
              삭제하기
            </Button>
          </ModalFooter>
        </ModalContent>
      </ModalPortal>
    </Modal>
  );
}
